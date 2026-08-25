-- ====================================================================
-- 영광군의회 「열린소통 ON」 V4 Proposal Empathy WRITE & Status RPC
-- File: supabase/migrations/20260826040000_v4_proposal_empathy_write.sql
-- ====================================================================

-- 1. SAFE TOGGLE PROPOSAL EMPATHY RPC FUNCTION
CREATE OR REPLACE FUNCTION public.toggle_proposal_empathy(
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
  v_proposal_exists BOOLEAN := false;
  v_already_empathized BOOLEAN := false;
  v_now_empathized BOOLEAN := false;
  v_empathy_count BIGINT := 0;
BEGIN
  -- 1. 사용자 ID 획득 (auth.uid() 필수)
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '인증된 사용자만 공감할 수 있습니다.';
  END IF;

  -- 2. DB 기준 영광군민 인증 완료 여부 검증
  IF NOT app_private.is_verified_resident(p_tenant_id) THEN
    RAISE EXCEPTION '영광군민 인증이 완료된 사용자만 공감할 수 있습니다.';
  END IF;

  -- 3. Proposal 존재 및 Cross-Tenant 검증
  SELECT EXISTS(
    SELECT 1 FROM public.proposals
    WHERE id = p_proposal_id AND tenant_id = p_tenant_id AND deleted_at IS NULL
  ) INTO v_proposal_exists;

  IF NOT v_proposal_exists THEN
    RAISE EXCEPTION '존재하지 않거나 삭제된 제안입니다.';
  END IF;

  -- 4. 공감 여부 확인 및 Toggle
  SELECT EXISTS(
    SELECT 1 FROM public.proposal_empathy
    WHERE tenant_id = p_tenant_id AND proposal_id = p_proposal_id AND user_id = v_user_id
  ) INTO v_already_empathized;

  IF v_already_empathized THEN
    -- 공감 취소
    DELETE FROM public.proposal_empathy
    WHERE tenant_id = p_tenant_id AND proposal_id = p_proposal_id AND user_id = v_user_id;
    v_now_empathized := false;
  ELSE
    -- 공감 등록
    INSERT INTO public.proposal_empathy (tenant_id, proposal_id, user_id)
    VALUES (p_tenant_id, p_proposal_id, v_user_id);
    v_now_empathized := true;
  END IF;

  -- 5. 최신 공감수 집계
  SELECT COUNT(*) INTO v_empathy_count
  FROM public.proposal_empathy
  WHERE tenant_id = p_tenant_id AND proposal_id = p_proposal_id;

  RETURN jsonb_build_object(
    'empathized', v_now_empathized,
    'empathy_count', v_empathy_count
  );
END;
$$;

-- Revoke Public & Anon Access to Toggle RPC
REVOKE ALL ON FUNCTION public.toggle_proposal_empathy(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.toggle_proposal_empathy(UUID, UUID) TO authenticated;


-- 2. SAFE GET PROPOSAL EMPATHY STATUS RPC FUNCTION
CREATE OR REPLACE FUNCTION public.get_proposal_empathy_status(
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
  v_empathized BOOLEAN := false;
  v_empathy_count BIGINT := 0;
BEGIN
  v_user_id := (SELECT auth.uid());

  IF v_user_id IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM public.proposal_empathy
      WHERE tenant_id = p_tenant_id AND proposal_id = p_proposal_id AND user_id = v_user_id
    ) INTO v_empathized;
  END IF;

  SELECT COUNT(*) INTO v_empathy_count
  FROM public.proposal_empathy
  WHERE tenant_id = p_tenant_id AND proposal_id = p_proposal_id;

  RETURN jsonb_build_object(
    'empathized', v_empathized,
    'empathy_count', v_empathy_count
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_proposal_empathy_status(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_proposal_empathy_status(UUID, UUID) TO PUBLIC, anon, authenticated;
