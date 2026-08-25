-- ====================================================================
-- 영광군의회 「열린소통 ON」 V4 Proposal WRITE RPC Function
-- File: supabase/migrations/20260826030000_v4_proposal_write.sql
-- ====================================================================

-- ATOMIC CITIZEN PROPOSAL SUBMISSION RPC FUNCTION
CREATE OR REPLACE FUNCTION public.submit_citizen_proposal(
  p_tenant_id UUID,
  p_region_id UUID,
  p_category TEXT,
  p_title TEXT,
  p_content TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_region_valid BOOLEAN := false;
  v_title_clean TEXT;
  v_content_clean TEXT;
  v_summary TEXT;
  v_proposal_id UUID;
BEGIN
  -- 1. 사용자 ID 획득 (auth.uid() 필수)
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '인증된 사용자만 제안을 등록할 수 있습니다.';
  END IF;

  -- 2. DB 기준 영광군민 인증 완료 여부 검증
  IF NOT app_private.is_verified_resident(p_tenant_id) THEN
    RAISE EXCEPTION '영광군민 인증이 완료된 사용자만 제안을 등록할 수 있습니다.';
  END IF;

  -- 3. Region 소속 및 활성화 상태 검증 (Cross-Tenant 차단)
  SELECT EXISTS(
    SELECT 1 FROM public.regions
    WHERE id = p_region_id AND tenant_id = p_tenant_id AND is_active = true
  ) INTO v_region_valid;

  IF NOT v_region_valid THEN
    RAISE EXCEPTION '유효하지 않거나 지정된 테넌트에 속하지 않는 거주 읍면입니다.';
  END IF;

  -- 4. 입력값 정제 및 길이 검증
  v_title_clean := trim(COALESCE(p_title, ''));
  v_content_clean := trim(COALESCE(p_content, ''));

  IF length(v_title_clean) < 2 OR length(v_title_clean) > 80 THEN
    RAISE EXCEPTION '제안 제목은 2자 이상 80자 이하이어야 합니다.';
  END IF;

  IF length(v_content_clean) < 10 OR length(v_content_clean) > 2000 THEN
    RAISE EXCEPTION '제안 내용은 10자 이상 2,000자 이하이어야 합니다.';
  END IF;

  IF p_category IS NULL OR trim(p_category) = '' THEN
    RAISE EXCEPTION '제안 분야(카테고리)를 선택해 주세요.';
  END IF;

  v_summary := substring(v_content_clean from 1 for 150);

  -- 5. Atomic Proposals & Timeline INSERT
  -- status = 'received' (고정), public_discussion_eligible = false (고정)
  INSERT INTO public.proposals (
    tenant_id,
    user_id,
    category,
    region_id,
    title,
    summary,
    content,
    status,
    public_discussion_eligible,
    featured
  ) VALUES (
    p_tenant_id,
    v_user_id,
    trim(p_category),
    p_region_id,
    v_title_clean,
    v_summary,
    v_content_clean,
    'received',
    false,
    false
  ) RETURNING id INTO v_proposal_id;

  -- 초기 타임라인 '의견 접수' 생성
  INSERT INTO public.proposal_timeline (
    tenant_id,
    proposal_id,
    label,
    status,
    occurred_at,
    display_order,
    created_by
  ) VALUES (
    p_tenant_id,
    v_proposal_id,
    '의견 접수',
    'completed',
    now(),
    1,
    v_user_id
  );

  RETURN v_proposal_id;
END;
$$;

-- Revoke Public & Anon Access
REVOKE ALL ON FUNCTION public.submit_citizen_proposal(UUID, UUID, TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_citizen_proposal(UUID, UUID, TEXT, TEXT, TEXT) TO authenticated;
