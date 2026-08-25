-- ====================================================================
-- 영광군의회 「열린소통 ON」 V4 Outcomes Management & Security RPC
-- File: supabase/migrations/20260826060000_v4_outcomes_management.sql
-- ====================================================================

-- 1. DROP EXISTING STATUS CHECK & RE-ADD EXTENDED CHECK
ALTER TABLE public.outcomes DROP CONSTRAINT IF EXISTS outcomes_status_check;
ALTER TABLE public.outcomes ADD CONSTRAINT outcomes_status_check CHECK (status IN ('completed', 'active', 'draft', 'published', 'archived'));

-- 2. CREATE OUTCOME RPC FUNCTION (STAFF/ADMIN ONLY)
CREATE OR REPLACE FUNCTION public.create_outcome(
  p_tenant_id UUID,
  p_title TEXT,
  p_summary TEXT,
  p_result TEXT,
  p_category TEXT,
  p_region_id UUID DEFAULT NULL,
  p_status TEXT DEFAULT 'published',
  p_source_proposal_id UUID DEFAULT NULL,
  p_source_ask_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_proposal_exists BOOLEAN := false;
  v_ask_exists BOOLEAN := false;
  v_outcome_id UUID;
  v_clean_title TEXT;
  v_clean_summary TEXT;
  v_clean_result TEXT;
  v_clean_category TEXT;
BEGIN
  -- 1. 사용자 ID 획득 및 관리자/직원 권한 검증
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '인증된 사용자만 접근 가능합니다.';
  END IF;

  IF NOT app_private.has_tenant_role(p_tenant_id, ARRAY['council_staff', 'admin']) THEN
    RAISE EXCEPTION '의회 직원 또는 관리자만 성과를 등록할 수 있습니다.';
  END IF;

  -- 2. 필드 입력값 정제 및 Validation
  v_clean_title := trim(COALESCE(p_title, ''));
  v_clean_summary := trim(COALESCE(p_summary, ''));
  v_clean_result := trim(COALESCE(p_result, ''));
  v_clean_category := trim(COALESCE(p_category, ''));

  IF length(v_clean_title) < 2 OR length(v_clean_title) > 100 THEN
    RAISE EXCEPTION '성과 제목은 2자 이상 100자 이하이어야 합니다.';
  END IF;
  IF length(v_clean_summary) < 5 OR length(v_clean_summary) > 500 THEN
    RAISE EXCEPTION '성과 요약은 5자 이상 500자 이하이어야 합니다.';
  END IF;

  -- 3. Cross-Tenant Source Proposal / Ask 무결성 검증
  IF p_source_proposal_id IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM public.proposals WHERE id = p_source_proposal_id AND tenant_id = p_tenant_id
    ) INTO v_proposal_exists;
    IF NOT v_proposal_exists THEN
      RAISE EXCEPTION '유효하지 않거나 타 테넌트의 제안 ID입니다.';
    END IF;
  END IF;

  IF p_source_ask_id IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM public.asks WHERE id = p_source_ask_id AND tenant_id = p_tenant_id
    ) INTO v_ask_exists;
    IF NOT v_ask_exists THEN
      RAISE EXCEPTION '유효하지 않거나 타 테넌트의 안건 ID입니다.';
    END IF;
  END IF;

  -- 4. Outcome INSERT
  INSERT INTO public.outcomes (
    tenant_id, title, summary, result, category, region_id, status, created_by, outcome_at
  ) VALUES (
    p_tenant_id, v_clean_title, v_clean_summary, v_clean_result, v_clean_category, p_region_id, p_status, v_user_id, CURRENT_DATE
  ) RETURNING id INTO v_outcome_id;

  -- 5. Link Relationship INSERT
  IF p_source_proposal_id IS NOT NULL THEN
    INSERT INTO public.outcome_proposals (outcome_id, proposal_id)
    VALUES (v_outcome_id, p_source_proposal_id)
    ON CONFLICT DO NOTHING;
  END IF;

  IF p_source_ask_id IS NOT NULL THEN
    INSERT INTO public.outcome_asks (outcome_id, ask_id)
    VALUES (v_outcome_id, p_source_ask_id)
    ON CONFLICT DO NOTHING;
  END IF;

  -- 6. Audit Log 기록
  INSERT INTO public.audit_logs (
    tenant_id, actor_user_id, action, target_table, target_id, after_data
  ) VALUES (
    p_tenant_id, v_user_id, 'OUTCOME_CREATED', 'outcomes', v_outcome_id,
    jsonb_build_object('title', v_clean_title, 'status', p_status)
  );

  RETURN v_outcome_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_outcome(UUID, TEXT, TEXT, TEXT, TEXT, UUID, TEXT, UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_outcome(UUID, TEXT, TEXT, TEXT, TEXT, UUID, TEXT, UUID, UUID) TO authenticated;


-- 3. UPDATE OUTCOME RPC FUNCTION (STAFF/ADMIN ONLY)
CREATE OR REPLACE FUNCTION public.update_outcome(
  p_tenant_id UUID,
  p_outcome_id UUID,
  p_title TEXT,
  p_summary TEXT,
  p_result TEXT,
  p_category TEXT,
  p_region_id UUID DEFAULT NULL,
  p_status TEXT DEFAULT 'published',
  p_source_proposal_id UUID DEFAULT NULL,
  p_source_ask_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_outcome_exists BOOLEAN := false;
  v_proposal_exists BOOLEAN := false;
  v_ask_exists BOOLEAN := false;
  v_clean_title TEXT;
  v_clean_summary TEXT;
  v_clean_result TEXT;
  v_clean_category TEXT;
BEGIN
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '인증된 사용자만 접근 가능합니다.';
  END IF;

  IF NOT app_private.has_tenant_role(p_tenant_id, ARRAY['council_staff', 'admin']) THEN
    RAISE EXCEPTION '의회 직원 또는 관리자만 성과를 수정할 수 있습니다.';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM public.outcomes WHERE id = p_outcome_id AND tenant_id = p_tenant_id
  ) INTO v_outcome_exists;
  IF NOT v_outcome_exists THEN
    RAISE EXCEPTION '존재하지 않는 성과 항목입니다.';
  END IF;

  v_clean_title := trim(COALESCE(p_title, ''));
  v_clean_summary := trim(COALESCE(p_summary, ''));
  v_clean_result := trim(COALESCE(p_result, ''));
  v_clean_category := trim(COALESCE(p_category, ''));

  IF p_source_proposal_id IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM public.proposals WHERE id = p_source_proposal_id AND tenant_id = p_tenant_id
    ) INTO v_proposal_exists;
    IF NOT v_proposal_exists THEN
      RAISE EXCEPTION '유효하지 않거나 타 테넌트의 제안 ID입니다.';
    END IF;
  END IF;

  IF p_source_ask_id IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM public.asks WHERE id = p_source_ask_id AND tenant_id = p_tenant_id
    ) INTO v_ask_exists;
    IF NOT v_ask_exists THEN
      RAISE EXCEPTION '유효하지 않거나 타 테넌트의 안건 ID입니다.';
    END IF;
  END IF;

  UPDATE public.outcomes SET
    title = v_clean_title,
    summary = v_clean_summary,
    result = v_clean_result,
    category = v_clean_category,
    region_id = p_region_id,
    status = p_status,
    updated_at = now()
  WHERE id = p_outcome_id AND tenant_id = p_tenant_id;

  -- 갱신된 Relationship 정리
  DELETE FROM public.outcome_proposals WHERE outcome_id = p_outcome_id;
  IF p_source_proposal_id IS NOT NULL THEN
    INSERT INTO public.outcome_proposals (outcome_id, proposal_id)
    VALUES (p_outcome_id, p_source_proposal_id)
    ON CONFLICT DO NOTHING;
  END IF;

  DELETE FROM public.outcome_asks WHERE outcome_id = p_outcome_id;
  IF p_source_ask_id IS NOT NULL THEN
    INSERT INTO public.outcome_asks (outcome_id, ask_id)
    VALUES (p_outcome_id, p_source_ask_id)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Audit Log
  INSERT INTO public.audit_logs (
    tenant_id, actor_user_id, action, target_table, target_id, after_data
  ) VALUES (
    p_tenant_id, v_user_id, 'OUTCOME_UPDATED', 'outcomes', p_outcome_id,
    jsonb_build_object('title', v_clean_title, 'status', p_status)
  );

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.update_outcome(UUID, UUID, TEXT, TEXT, TEXT, TEXT, UUID, TEXT, UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_outcome(UUID, UUID, TEXT, TEXT, TEXT, TEXT, UUID, TEXT, UUID, UUID) TO authenticated;


-- 4. GET PUBLIC OUTCOMES RPC FUNCTION (PUBLIC READ ONLY PUBLISHED/COMPLETED/ACTIVE)
CREATE OR REPLACE FUNCTION public.get_public_outcomes(
  p_tenant_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', o.id,
      'title', o.title,
      'summary', o.summary,
      'result', o.result,
      'category', o.category,
      'status', o.status,
      'region_name', COALESCE(r.name, '영광군 전역'),
      'outcome_at', COALESCE(o.outcome_at::text, o.created_at::date::text),
      'source_proposal_id', (SELECT proposal_id FROM public.outcome_proposals WHERE outcome_id = o.id LIMIT 1),
      'source_ask_id', (SELECT ask_id FROM public.outcome_asks WHERE outcome_id = o.id LIMIT 1)
    ) ORDER BY o.created_at DESC
  ) INTO v_result
  FROM public.outcomes o
  LEFT JOIN public.regions r ON o.tenant_id = r.tenant_id AND o.region_id = r.id
  WHERE o.tenant_id = p_tenant_id
    AND o.status IN ('published', 'completed', 'active');

  RETURN COALESCE(v_result, '[]'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.get_public_outcomes(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_outcomes(UUID) TO PUBLIC, anon, authenticated;


-- 5. GET PUBLIC OUTCOME BY ID RPC FUNCTION
CREATE OR REPLACE FUNCTION public.get_public_outcome_by_id(
  p_tenant_id UUID,
  p_outcome_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'id', o.id,
    'title', o.title,
    'summary', o.summary,
    'result', o.result,
    'category', o.category,
    'status', o.status,
    'region_name', COALESCE(r.name, '영광군 전역'),
    'outcome_at', COALESCE(o.outcome_at::text, o.created_at::date::text),
    'source_proposal_id', (SELECT proposal_id FROM public.outcome_proposals WHERE outcome_id = o.id LIMIT 1),
    'source_ask_id', (SELECT ask_id FROM public.outcome_asks WHERE outcome_id = o.id LIMIT 1)
  ) INTO v_result
  FROM public.outcomes o
  LEFT JOIN public.regions r ON o.tenant_id = r.tenant_id AND o.region_id = r.id
  WHERE o.tenant_id = p_tenant_id
    AND o.id = p_outcome_id
    AND o.status IN ('published', 'completed', 'active');

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_public_outcome_by_id(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_outcome_by_id(UUID, UUID) TO PUBLIC, anon, authenticated;
