-- ====================================================================
-- 영광군의회 「열린소통 ON」 V4 READ Security Hardening Corrective Migration
-- File: supabase/migrations/20260825011000_v4_read_security_hardening.sql
-- ====================================================================

-- 1. REVOKE EXPLICIT EXECUTE FROM ANON ON APP_PRIVATE SECURITY DEFINER FUNCTIONS
-- anon (익명 사용자)는 auth.uid()가 없으므로 관리자/군민인증 helper를 호출할 이유가 없음
REVOKE EXECUTE ON FUNCTION app_private.has_tenant_role(uuid, text[]) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION app_private.is_verified_resident(uuid) FROM anon, PUBLIC;

-- 2. ENSURE SUBMIT_ASK_VOTE RPC HAS NO PUBLIC/ANON EXECUTE PERMISSION
-- submit_ask_vote RPC 함수는 인증된 사용자(authenticated) 및 service_role만 실행할 수 있도록 검증
REVOKE EXECUTE ON FUNCTION public.submit_ask_vote(uuid, uuid, uuid[], text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_ask_vote(uuid, uuid, uuid[], text, text) TO authenticated;

-- 3. RE-TARGET STAFF/ADMIN MANAGEMENT POLICIES TO AUTHENTICATED USERS ONLY
-- 관리자 전용 helper(has_tenant_role)를 포함하는 RLS 정책을 authenticated 용으로 분리하여 anon 평가 시 permission error 원천 방지

DROP POLICY IF EXISTS "Staff admin manage asks" ON public.asks;
CREATE POLICY "Staff admin manage asks" ON public.asks
  FOR ALL
  TO authenticated
  USING (app_private.has_tenant_role(tenant_id, ARRAY['council_staff', 'admin']));

DROP POLICY IF EXISTS "Staff admin manage responses" ON public.official_responses;
CREATE POLICY "Staff admin manage responses" ON public.official_responses
  FOR ALL
  TO authenticated
  USING (app_private.has_tenant_role(tenant_id, ARRAY['council_staff', 'admin']));

DROP POLICY IF EXISTS "Staff admin manage proposals" ON public.proposals;
CREATE POLICY "Staff admin manage proposals" ON public.proposals
  FOR UPDATE
  TO authenticated
  USING (app_private.has_tenant_role(tenant_id, ARRAY['council_staff', 'admin']));

DROP POLICY IF EXISTS "Staff admin manage outcomes" ON public.outcomes;
CREATE POLICY "Staff admin manage outcomes" ON public.outcomes
  FOR ALL
  TO authenticated
  USING (app_private.has_tenant_role(tenant_id, ARRAY['council_staff', 'admin']));


-- 4. CONFIRM PUBLIC RLS POLICIES FOR ANONYMOUS / PUBLIC READ (PURE ROW CONDITIONS)
-- 공개 READ 정책은 helper 함수 호출 없이 순수 테이블 컬럼 조건으로만 동작하도록 보장

DROP POLICY IF EXISTS "Public read published asks" ON public.asks;
CREATE POLICY "Public read published asks" ON public.asks
  FOR SELECT
  TO PUBLIC
  USING (status IN ('published', 'active', 'closed', 'archived'));

DROP POLICY IF EXISTS "Public read official responses" ON public.official_responses;
CREATE POLICY "Public read official responses" ON public.official_responses
  FOR SELECT
  TO PUBLIC
  USING (is_current = true);

DROP POLICY IF EXISTS "Public read non-hidden proposals" ON public.proposals;
CREATE POLICY "Public read non-hidden proposals" ON public.proposals
  FOR SELECT
  TO PUBLIC
  USING (status != 'hidden' AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Public read outcomes" ON public.outcomes;
CREATE POLICY "Public read outcomes" ON public.outcomes
  FOR SELECT
  TO PUBLIC
  USING (true);
