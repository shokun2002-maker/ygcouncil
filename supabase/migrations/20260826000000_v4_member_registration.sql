-- ====================================================================
-- 영광군의회 「열린소통 ON」 V4 Member Registration RPC Migration
-- File: supabase/migrations/20260826000000_v4_member_registration.sql
-- ====================================================================

-- 1. CREATE SAFE MEMBER REGISTRATION RPC FUNCTION
CREATE OR REPLACE FUNCTION public.ensure_member_registration(
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
  v_raw_meta JSONB;
  v_display_name TEXT;
  v_profile_exists BOOLEAN;
  v_existing_role TEXT;
BEGIN
  -- 1. 사용자 ID 획득 (외부 파라미터로 받지 않음! auth.uid() 사용)
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '로그인이 필요합니다.';
  END IF;

  -- 2. Tenant 검증 (영광군의회 active 확인)
  SELECT (status = 'active') INTO v_tenant_active
  FROM public.tenants
  WHERE id = p_tenant_id;

  IF v_tenant_active IS NOT TRUE THEN
    RAISE EXCEPTION '유효하지 않거나 비활성화된 의회(Tenant)입니다.';
  END IF;

  -- 3. Profile 자동 생성 (없을 경우 idempotent 생성)
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE user_id = v_user_id) INTO v_profile_exists;

  IF NOT v_profile_exists THEN
    -- auth.users metadata에서 닉네임/이름 추출
    SELECT raw_user_meta_data INTO v_raw_meta
    FROM auth.users
    WHERE id = v_user_id;

    v_display_name := COALESCE(
      v_raw_meta->>'name',
      v_raw_meta->>'full_name',
      v_raw_meta->>'nickname',
      '카카오 사용자'
    );

    INSERT INTO public.profiles (user_id, display_name, created_at, updated_at)
    VALUES (v_user_id, v_display_name, now(), now())
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  -- 4. Tenant Membership 자동 생성 (role = 'member' 고정, 기존 role 보존)
  SELECT role INTO v_existing_role
  FROM public.tenant_memberships
  WHERE tenant_id = p_tenant_id AND user_id = v_user_id;

  IF v_existing_role IS NULL THEN
    INSERT INTO public.tenant_memberships (tenant_id, user_id, role, is_active, created_at, updated_at)
    VALUES (p_tenant_id, v_user_id, 'member', true, now(), now())
    ON CONFLICT (tenant_id, user_id) DO NOTHING;

    v_existing_role := 'member';
  END IF;

  -- 5. 결과 리턴 (권한상승 없음, verified_resident 자동부여 절대 없음)
  RETURN jsonb_build_object(
    'registered', true,
    'user_id', v_user_id,
    'tenant_id', p_tenant_id,
    'role', v_existing_role
  );
END;
$$;

-- 2. STRICT PERMISSION MANAGEMENT
-- anon 및 PUBLIC 은 RPC 호출 불가능, authenticated 사용자만 실행 가능
REVOKE ALL ON FUNCTION public.ensure_member_registration(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ensure_member_registration(UUID) TO authenticated;
