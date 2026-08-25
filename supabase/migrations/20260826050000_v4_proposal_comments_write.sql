-- ====================================================================
-- 영광군의회 「열린소통 ON」 V4 Proposal Comments WRITE & Security RPC
-- File: supabase/migrations/20260826050000_v4_proposal_comments_write.sql
-- ====================================================================

-- 1. SUBMIT PROPOSAL COMMENT RPC FUNCTION
CREATE OR REPLACE FUNCTION public.submit_proposal_comment(
  p_tenant_id UUID,
  p_proposal_id UUID,
  p_content TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_proposal_exists BOOLEAN := false;
  v_content_clean TEXT;
  v_comment_id UUID;
BEGIN
  -- 1. 사용자 ID 획득 (auth.uid() 필수)
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '인증된 사용자만 댓글을 작성할 수 있습니다.';
  END IF;

  -- 2. DB 기준 영광군민 인증 완료 여부 검증
  IF NOT app_private.is_verified_resident(p_tenant_id) THEN
    RAISE EXCEPTION '영광군민 인증이 완료된 사용자만 댓글을 작성할 수 있습니다.';
  END IF;

  -- 3. Proposal 존재 및 Cross-Tenant 검증
  SELECT EXISTS(
    SELECT 1 FROM public.proposals
    WHERE id = p_proposal_id AND tenant_id = p_tenant_id AND deleted_at IS NULL
  ) INTO v_proposal_exists;

  IF NOT v_proposal_exists THEN
    RAISE EXCEPTION '존재하지 않거나 삭제된 제안입니다.';
  END IF;

  -- 4. 댓글 내용 정제 및 500자 검증
  v_content_clean := trim(COALESCE(p_content, ''));
  IF length(v_content_clean) < 1 OR length(v_content_clean) > 500 THEN
    RAISE EXCEPTION '댓글 내용은 1자 이상 500자 이하이어야 합니다.';
  END IF;

  -- 5. 댓글 INSERT
  INSERT INTO public.proposal_comments (
    tenant_id, proposal_id, user_id, content
  ) VALUES (
    p_tenant_id, p_proposal_id, v_user_id, v_content_clean
  ) RETURNING id INTO v_comment_id;

  RETURN v_comment_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_proposal_comment(UUID, UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_proposal_comment(UUID, UUID, TEXT) TO authenticated;


-- 2. DELETE MY PROPOSAL COMMENT RPC FUNCTION (SOFT DELETE)
CREATE OR REPLACE FUNCTION public.delete_my_proposal_comment(
  p_tenant_id UUID,
  p_comment_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_comment RECORD;
BEGIN
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '인증된 사용자만 본인 댓글을 삭제할 수 있습니다.';
  END IF;

  SELECT * INTO v_comment
  FROM public.proposal_comments
  WHERE id = p_comment_id AND tenant_id = p_tenant_id AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION '존재하지 않거나 이미 삭제된 댓글입니다.';
  END IF;

  IF v_comment.user_id != v_user_id THEN
    RAISE EXCEPTION '본인이 작성한 댓글만 삭제할 수 있습니다.';
  END IF;

  UPDATE public.proposal_comments
  SET deleted_at = now(), updated_at = now()
  WHERE id = p_comment_id AND tenant_id = p_tenant_id;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_my_proposal_comment(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_my_proposal_comment(UUID, UUID) TO authenticated;


-- 3. HIDE PROPOSAL COMMENT RPC FUNCTION (STAFF/ADMIN ONLY WITH AUDIT LOG)
CREATE OR REPLACE FUNCTION public.hide_proposal_comment(
  p_tenant_id UUID,
  p_comment_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_comment_exists BOOLEAN := false;
BEGIN
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '인증된 사용자만 접근 가능합니다.';
  END IF;

  -- 관리자 / 직원 권한 검증
  IF NOT app_private.has_tenant_role(p_tenant_id, ARRAY['council_staff', 'admin']) THEN
    RAISE EXCEPTION '관리자 또는 직원 권한이 필요합니다.';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM public.proposal_comments
    WHERE id = p_comment_id AND tenant_id = p_tenant_id AND hidden_at IS NULL
  ) INTO v_comment_exists;

  IF NOT v_comment_exists THEN
    RAISE EXCEPTION '존재하지 않거나 이미 숨김 처리된 댓글입니다.';
  END IF;

  UPDATE public.proposal_comments
  SET hidden_at = now(), hidden_by = v_user_id, updated_at = now()
  WHERE id = p_comment_id AND tenant_id = p_tenant_id;

  -- Audit Log 기록
  INSERT INTO public.audit_logs (
    tenant_id, actor_user_id, action, target_table, target_id, after_data
  ) VALUES (
    p_tenant_id, v_user_id, 'PROPOSAL_COMMENT_HIDDEN', 'proposal_comments', p_comment_id,
    jsonb_build_object('reason', COALESCE(p_reason, '부적절한 내용'))
  );

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.hide_proposal_comment(UUID, UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.hide_proposal_comment(UUID, UUID, TEXT) TO authenticated;


-- 4. GET PROPOSAL COMMENTS PUBLIC RPC FUNCTION
CREATE OR REPLACE FUNCTION public.get_proposal_comments(
  p_tenant_id UUID,
  p_proposal_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_result JSONB;
BEGIN
  v_user_id := (SELECT auth.uid());

  SELECT jsonb_agg(
    jsonb_build_object(
      'comment_id', pc.id,
      'content', pc.content,
      'created_at', pc.created_at,
      'author_display', COALESCE(r.name || ' 주민', '군민인증 회원'),
      'is_my_comment', (v_user_id IS NOT NULL AND pc.user_id = v_user_id)
    ) ORDER BY pc.created_at ASC
  ) INTO v_result
  FROM public.proposal_comments pc
  LEFT JOIN public.resident_verifications rv ON pc.tenant_id = rv.tenant_id AND pc.user_id = rv.user_id
  LEFT JOIN public.regions r ON rv.tenant_id = r.tenant_id AND rv.region_id = r.id
  WHERE pc.tenant_id = p_tenant_id
    AND pc.proposal_id = p_proposal_id
    AND pc.deleted_at IS NULL
    AND pc.hidden_at IS NULL;

  RETURN COALESCE(v_result, '[]'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.get_proposal_comments(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_proposal_comments(UUID, UUID) TO PUBLIC, anon, authenticated;
