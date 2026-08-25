-- ====================================================================
-- 영광군의회 「열린소통 ON」 V4 Demo Resident Verification RPC Migration
-- File: supabase/migrations/20260826010000_v4_demo_resident_verification.sql
-- ====================================================================

-- 1. DEMO IDENTITY VERIFICATION RPC (DEMO ONLY)
-- COMMENT: DEMO ONLY: MUST BE REVOKED OR REMOVED BEFORE PRODUCTION
CREATE OR REPLACE FUNCTION public.demo_verify_identity(
  p_tenant_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_tenant_active BOOLEAN;
BEGIN
  -- 사용자 ID 획득 (auth.uid() 필수)
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '로그인이 필요합니다.';
  END IF;

  -- Tenant 검증
  SELECT (status = 'active') INTO v_tenant_active
  FROM public.tenants
  WHERE id = p_tenant_id;

  IF v_tenant_active IS NOT TRUE THEN
    RAISE EXCEPTION '유효하지 않거나 비활성화된 의회(Tenant)입니다.';
  END IF;

  -- resident_verifications 레코드 UPSERT
  INSERT INTO public.resident_verifications (
    tenant_id,
    user_id,
    identity_status,
    identity_method,
    identity_verified_at,
    created_at,
    updated_at
  )
  VALUES (
    p_tenant_id,
    v_user_id,
    'verified',
    'DEMO_PASS',
    now(),
    now(),
    now()
  )
  ON CONFLICT (tenant_id, user_id) DO UPDATE
  SET
    identity_status = 'verified',
    identity_method = 'DEMO_PASS',
    identity_verified_at = now(),
    updated_at = now();

  RETURN jsonb_build_object(
    'success', true,
    'identity_status', 'verified',
    'identity_method', 'DEMO_PASS'
  );
END;
$$;

COMMENT ON FUNCTION public.demo_verify_identity(UUID) IS 'DEMO ONLY: MUST BE REVOKED OR REMOVED BEFORE PRODUCTION';


-- 2. REQUEST RESIDENCE VERIFICATION RPC
CREATE OR REPLACE FUNCTION public.request_residence_verification(
  p_tenant_id UUID,
  p_region_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_region_valid BOOLEAN;
  v_verification RECORD;
BEGIN
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '로그인이 필요합니다.';
  END IF;

  -- 1. 본인확인 완료 상태인지 검증
  SELECT * INTO v_verification
  FROM public.resident_verifications
  WHERE tenant_id = p_tenant_id AND user_id = v_user_id;

  IF v_verification IS NULL OR v_verification.identity_status != 'verified' THEN
    RAISE EXCEPTION '본인확인이 완료된 사용자만 거주지 확인을 신청할 수 있습니다.';
  END IF;

  -- 2. 읍면 Region 검증
  SELECT (status = 'active') INTO v_region_valid
  FROM public.regions
  WHERE tenant_id = p_tenant_id AND id = p_region_id;

  IF v_region_valid IS NOT TRUE THEN
    RAISE EXCEPTION '유효하지 않은 읍면(Region)입니다.';
  END IF;

  -- 3. 거주확인 신청 업데이트 (residence_status = 'pending')
  UPDATE public.resident_verifications
  SET
    region_id = p_region_id,
    residence_status = 'pending',
    residence_method = 'DOC_ADMIN_DEMO',
    updated_at = now()
  WHERE tenant_id = p_tenant_id AND user_id = v_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'residence_status', 'pending',
    'region_id', p_region_id
  );
END;
$$;


-- 3. REVIEW RESIDENCE VERIFICATION RPC (STAFF / ADMIN ONLY)
CREATE OR REPLACE FUNCTION public.review_residence_verification(
  p_tenant_id UUID,
  p_target_user_id UUID,
  p_decision TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_actor_user_id UUID;
  v_is_staff BOOLEAN;
  v_before_data JSONB;
  v_after_data JSONB;
  v_now TIMESTAMPTZ := now();
  v_expires_at TIMESTAMPTZ := now() + INTERVAL '1 year';
BEGIN
  v_actor_user_id := (SELECT auth.uid());
  IF v_actor_user_id IS NULL THEN
    RAISE EXCEPTION '로그인이 필요합니다.';
  END IF;

  -- Staff / Admin 권한 검증 (app_private.has_tenant_role)
  v_is_staff := app_private.has_tenant_role(p_tenant_id, ARRAY['council_staff', 'admin']);
  IF v_is_staff IS NOT TRUE THEN
    RAISE EXCEPTION '관리자 또는 의회 직원 권한이 필요합니다.';
  END IF;

  IF p_decision NOT IN ('approve', 'reject') THEN
    RAISE EXCEPTION 'p_decision은 approve 또는 reject 여야 합니다.';
  END IF;

  -- 기존 데이터 조회
  SELECT to_jsonb(rv.*) INTO v_before_data
  FROM public.resident_verifications rv
  WHERE tenant_id = p_tenant_id AND user_id = p_target_user_id;

  IF v_before_data IS NULL THEN
    RAISE EXCEPTION '해당 대상 사용자의 검증 신청 레코드가 존재하지 않습니다.';
  END IF;

  -- 승인 / 반려 처리
  IF p_decision = 'approve' THEN
    UPDATE public.resident_verifications
    SET
      residence_status = 'verified',
      residence_verified_at = v_now,
      expires_at = v_expires_at,
      updated_at = v_now
    WHERE tenant_id = p_tenant_id AND user_id = p_target_user_id;

    -- Audit Log 기록
    SELECT to_jsonb(rv.*) INTO v_after_data
    FROM public.resident_verifications rv
    WHERE tenant_id = p_tenant_id AND user_id = p_target_user_id;

    INSERT INTO public.audit_logs (
      tenant_id,
      actor_user_id,
      action,
      target_table,
      target_id,
      before_data,
      after_data,
      created_at
    )
    VALUES (
      p_tenant_id,
      v_actor_user_id,
      'RESIDENCE_VERIFICATION_APPROVED',
      'resident_verifications',
      (v_before_data->>'id')::uuid,
      v_before_data,
      jsonb_build_object('decision', 'approve', 'reason', p_reason, 'expires_at', v_expires_at),
      v_now
    );

  ELSIF p_decision = 'reject' THEN
    UPDATE public.resident_verifications
    SET
      residence_status = 'rejected',
      updated_at = v_now
    WHERE tenant_id = p_tenant_id AND user_id = p_target_user_id;

    -- Audit Log 기록
    INSERT INTO public.audit_logs (
      tenant_id,
      actor_user_id,
      action,
      target_table,
      target_id,
      before_data,
      after_data,
      created_at
    )
    VALUES (
      p_tenant_id,
      v_actor_user_id,
      'RESIDENCE_VERIFICATION_REJECTED',
      'resident_verifications',
      (v_before_data->>'id')::uuid,
      v_before_data,
      jsonb_build_object('decision', 'reject', 'reason', p_reason),
      v_now
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'decision', p_decision,
    'target_user_id', p_target_user_id
  );
END;
$$;


-- 4. STRICT PERMISSIONS
REVOKE ALL ON FUNCTION public.demo_verify_identity(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.demo_verify_identity(UUID) TO authenticated;

REVOKE ALL ON FUNCTION public.request_residence_verification(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.request_residence_verification(UUID, UUID) TO authenticated;

REVOKE ALL ON FUNCTION public.review_residence_verification(UUID, UUID, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_residence_verification(UUID, UUID, TEXT, TEXT) TO authenticated;
