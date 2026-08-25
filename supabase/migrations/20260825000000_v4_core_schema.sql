-- ============================================================================
-- 영광군의회 「열린소통 ON」 STEP V4-2.1 Core DB Security & Integrity Hardening
-- Timestamp: 20260825000000
-- Target PostgreSQL: 15+ (Supabase)
-- ============================================================================

-- Schema Initializations
CREATE SCHEMA IF NOT EXISTS app_private;

-- ============================================================================
-- 1. TENANTS & REGIONS MASTER (WITH COMPOSITE KEYS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_tenant_id_composite UNIQUE (id)
);

COMMENT ON TABLE public.tenants IS '지방의회 플랫폼 Multi-tenant 식별 테이블';

CREATE TABLE IF NOT EXISTS public.regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_tenant_region_name UNIQUE (tenant_id, name),
  CONSTRAINT unique_tenant_region_composite UNIQUE (tenant_id, id)
);

COMMENT ON TABLE public.regions IS '의회별 행정구역 (예: 영광군 11개 읍면) 마스터';

-- ============================================================================
-- 2. USER PROFILES & MEMBERSHIPS & VERIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '군민',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS '전역 사용자 프로필 (공개 표시명 보관)';

CREATE TABLE IF NOT EXISTS public.tenant_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'council_staff', 'admin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_tenant_user_membership UNIQUE (tenant_id, user_id)
);

COMMENT ON TABLE public.tenant_memberships IS '의회별 사용자 권한 역할(RBAC) 테이블 (일반 사용자 직접 UPDATE 금지)';

CREATE TABLE IF NOT EXISTS public.resident_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  region_id UUID,
  identity_status TEXT NOT NULL DEFAULT 'pending' CHECK (identity_status IN ('pending', 'verified', 'failed')),
  residence_status TEXT NOT NULL DEFAULT 'pending' CHECK (residence_status IN ('pending', 'verified', 'rejected', 'expired')),
  identity_method TEXT,
  residence_method TEXT,
  provider_subject_hash TEXT,
  identity_verified_at TIMESTAMPTZ,
  residence_verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_tenant_user_verification UNIQUE (tenant_id, user_id),
  CONSTRAINT fk_verification_region_composite FOREIGN KEY (tenant_id, region_id) REFERENCES public.regions(tenant_id, id) ON DELETE SET NULL
);

COMMENT ON TABLE public.resident_verifications IS '본인확인(Identity) 및 거주지확인(Residence) 독립 검증 정보';

-- ============================================================================
-- 3. APP PRIVATE HELPER SECURITY DEFINER FUNCTIONS (HARDENED)
-- ============================================================================

CREATE OR REPLACE FUNCTION app_private.has_tenant_role(
  p_tenant_id UUID,
  p_roles TEXT[]
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.tenant_memberships
    WHERE tenant_id = p_tenant_id
      AND user_id = v_user_id
      AND is_active = true
      AND role = ANY(p_roles)
  );
END;
$$;

CREATE OR REPLACE FUNCTION app_private.is_verified_resident(
  p_tenant_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.resident_verifications
    WHERE tenant_id = p_tenant_id
      AND user_id = v_user_id
      AND identity_status = 'verified'
      AND residence_status = 'verified'
      AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$;

-- Revoke Public Access to Helper Functions
REVOKE ALL ON FUNCTION app_private.has_tenant_role(UUID, TEXT[]) FROM PUBLIC;
REVOKE ALL ON FUNCTION app_private.is_verified_resident(UUID) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION app_private.has_tenant_role(UUID, TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION app_private.is_verified_resident(UUID) TO authenticated;

-- ============================================================================
-- 4. 묻습니다 (ASKS & MULTI-SELECT SUBMISSIONS WITH COMPOSITE FKS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.asks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT,
  background TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'active', 'closed', 'archived')),
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  survey_type TEXT NOT NULL CHECK (survey_type IN ('yes-no', 'single', 'multiple', 'opinion')),
  max_select_count INTEGER NOT NULL DEFAULT 1,
  allow_comment BOOLEAN NOT NULL DEFAULT true,
  region_id UUID,
  result_visibility TEXT NOT NULL DEFAULT 'after-vote' CHECK (result_visibility IN ('after-vote', 'always', 'after-close')),
  featured BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  CONSTRAINT unique_tenant_ask_composite UNIQUE (tenant_id, id),
  CONSTRAINT fk_ask_region_composite FOREIGN KEY (tenant_id, region_id) REFERENCES public.regions(tenant_id, id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.ask_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  ask_id UUID NOT NULL,
  label TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_ask_option_order UNIQUE (ask_id, display_order),
  CONSTRAINT unique_tenant_ask_option_composite UNIQUE (tenant_id, ask_id, id),
  CONSTRAINT fk_ask_option_ask_composite FOREIGN KEY (tenant_id, ask_id) REFERENCES public.asks(tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.ask_vote_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  ask_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  opinion_text TEXT,
  comment_text TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_ask_user_submission UNIQUE (ask_id, user_id),
  CONSTRAINT unique_tenant_ask_submission_composite UNIQUE (tenant_id, ask_id, id),
  CONSTRAINT fk_submission_ask_composite FOREIGN KEY (tenant_id, ask_id) REFERENCES public.asks(tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.ask_vote_choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  ask_id UUID NOT NULL,
  submission_id UUID NOT NULL,
  option_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_submission_option_choice UNIQUE (submission_id, option_id),
  CONSTRAINT fk_choice_submission_composite FOREIGN KEY (tenant_id, ask_id, submission_id) REFERENCES public.ask_vote_submissions(tenant_id, ask_id, id) ON DELETE CASCADE,
  CONSTRAINT fk_choice_option_composite FOREIGN KEY (tenant_id, ask_id, option_id) REFERENCES public.ask_options(tenant_id, ask_id, id) ON DELETE CASCADE
);

COMMENT ON TABLE public.ask_vote_choices IS 'Cross-Ask Option Mismatch를 Composite FK로 원천 차단한 선택지 관계';

-- ============================================================================
-- 5. 듣습니다 (PROPOSALS, EMPATHY, COMMENTS, TIMELINE, LINKS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  region_id UUID NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'review', 'discussion_review', 'consultation', 'council_review', 'agency_coordination', 'reflected', 'completed', 'hidden')),
  public_discussion_eligible BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT unique_tenant_proposal_composite UNIQUE (tenant_id, id),
  CONSTRAINT fk_proposal_region_composite FOREIGN KEY (tenant_id, region_id) REFERENCES public.regions(tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.proposal_empathy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  proposal_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_proposal_user_empathy UNIQUE (proposal_id, user_id),
  CONSTRAINT fk_empathy_proposal_composite FOREIGN KEY (tenant_id, proposal_id) REFERENCES public.proposals(tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.proposal_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  proposal_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  hidden_at TIMESTAMPTZ,
  hidden_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  CONSTRAINT fk_comment_proposal_composite FOREIGN KEY (tenant_id, proposal_id) REFERENCES public.proposals(tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.proposal_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  proposal_id UUID NOT NULL,
  label TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'current', 'pending')),
  occurred_at TIMESTAMPTZ,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_timeline_proposal_composite FOREIGN KEY (tenant_id, proposal_id) REFERENCES public.proposals(tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.official_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  proposal_id UUID NOT NULL,
  department TEXT NOT NULL,
  content TEXT NOT NULL,
  is_current BOOLEAN NOT NULL DEFAULT true,
  responded_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  responded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_response_proposal_composite FOREIGN KEY (tenant_id, proposal_id) REFERENCES public.proposals(tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.proposal_ask_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  proposal_id UUID NOT NULL,
  ask_id UUID NOT NULL,
  link_type TEXT NOT NULL DEFAULT 'public_discussion',
  created_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_proposal_ask_link UNIQUE (proposal_id, ask_id),
  CONSTRAINT fk_link_proposal_composite FOREIGN KEY (tenant_id, proposal_id) REFERENCES public.proposals(tenant_id, id) ON DELETE CASCADE,
  CONSTRAINT fk_link_ask_composite FOREIGN KEY (tenant_id, ask_id) REFERENCES public.asks(tenant_id, id) ON DELETE CASCADE
);

-- ============================================================================
-- 6. 함께 바꿨습니다 (OUTCOMES & RELATIONS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  result TEXT NOT NULL,
  category TEXT NOT NULL,
  region_id UUID,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'active')),
  featured BOOLEAN NOT NULL DEFAULT false,
  started_at DATE,
  outcome_at DATE,
  created_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_tenant_outcome_composite UNIQUE (tenant_id, id),
  CONSTRAINT fk_outcome_region_composite FOREIGN KEY (tenant_id, region_id) REFERENCES public.regions(tenant_id, id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.outcome_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  outcome_id UUID NOT NULL,
  label TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'current', 'pending')),
  occurred_at TIMESTAMPTZ,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_step_outcome_composite FOREIGN KEY (tenant_id, outcome_id) REFERENCES public.outcomes(tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.outcome_proposals (
  outcome_id UUID NOT NULL REFERENCES public.outcomes(id) ON DELETE CASCADE,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  PRIMARY KEY (outcome_id, proposal_id)
);

CREATE TABLE IF NOT EXISTS public.outcome_asks (
  outcome_id UUID NOT NULL REFERENCES public.outcomes(id) ON DELETE CASCADE,
  ask_id UUID NOT NULL REFERENCES public.asks(id) ON DELETE CASCADE,
  PRIMARY KEY (outcome_id, ask_id)
);

-- ============================================================================
-- 7. AUDIT LOGS (RESTRICTED ACCESS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  actor_user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_table TEXT NOT NULL,
  target_id UUID,
  before_data JSONB,
  after_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 8. ATOMIC VOTE SUBMISSION RPC FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.submit_ask_vote(
  p_tenant_id UUID,
  p_ask_id UUID,
  p_option_ids UUID[],
  p_opinion_text TEXT DEFAULT NULL,
  p_comment_text TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_ask RECORD;
  v_submission_id UUID;
  v_opt_count INT;
  v_valid_opts INT;
BEGIN
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '인증된 사용자만 참여할 수 있습니다.';
  END IF;

  -- 1. 인증 군민 여부 검증
  IF NOT app_private.is_verified_resident(p_tenant_id) THEN
    RAISE EXCEPTION '영광군민 인증이 완료된 사용자만 투표에 참여할 수 있습니다.';
  END IF;

  -- 2. 안건 조회 및 상태/기간 검증
  SELECT * INTO v_ask
  FROM public.asks
  WHERE id = p_ask_id AND tenant_id = p_tenant_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION '존재하지 않는 안건입니다.';
  END IF;

  IF v_ask.status NOT IN ('published', 'active') THEN
    RAISE EXCEPTION '현재 참여할 수 없는 안건 상태입니다.';
  END IF;

  IF v_ask.start_at IS NOT NULL AND v_ask.start_at > now() THEN
    RAISE EXCEPTION '아직 의견수렴 기간이 시작되지 않았습니다.';
  END IF;

  IF v_ask.end_at IS NOT NULL AND v_ask.end_at < now() THEN
    RAISE EXCEPTION '의견수렴 기간이 종료되었습니다.';
  END IF;

  -- 3. 1인 1참여 중복 검증
  IF EXISTS (SELECT 1 FROM public.ask_vote_submissions WHERE ask_id = p_ask_id AND user_id = v_user_id) THEN
    RAISE EXCEPTION '이미 해당 안건에 참여하셨습니다.';
  END IF;

  -- 4. 설문 유형별 유효성 검증
  v_opt_count := array_length(p_option_ids, 1);
  IF v_opt_count IS NULL THEN v_opt_count := 0; END IF;

  IF v_ask.survey_type IN ('yes-no', 'single') THEN
    IF v_opt_count != 1 THEN
      RAISE EXCEPTION '해당 안건은 정확히 1개의 선택지를 선택해야 합니다.';
    END IF;
  ELSIF v_ask.survey_type = 'multiple' THEN
    IF v_opt_count < 1 OR v_opt_count > v_ask.max_select_count THEN
      RAISE EXCEPTION '선택 항목 수는 1개 이상 %개 이하이어야 합니다.', v_ask.max_select_count;
    END IF;
  ELSIF v_ask.survey_type = 'opinion' THEN
    IF p_opinion_text IS NULL OR trim(p_opinion_text) = '' THEN
      RAISE EXCEPTION '의견 내용을 작성해야 합니다.';
    END IF;
  END IF;

  -- 5. 선택지 Mismatch 검증
  IF v_opt_count > 0 THEN
    SELECT COUNT(*) INTO v_valid_opts
    FROM public.ask_options
    WHERE tenant_id = p_tenant_id AND ask_id = p_ask_id AND id = ANY(p_option_ids);

    IF v_valid_opts != v_opt_count THEN
      RAISE EXCEPTION '유효하지 않거나 해당 안건에 속하지 않는 선택지가 포함되어 있습니다.';
    END IF;
  END IF;

  -- 6. Atomic Submissions & Choices INSERT
  INSERT INTO public.ask_vote_submissions (
    tenant_id, ask_id, user_id, opinion_text, comment_text
  ) VALUES (
    p_tenant_id, p_ask_id, v_user_id, p_opinion_text, p_comment_text
  ) RETURNING id INTO v_submission_id;

  IF v_opt_count > 0 THEN
    INSERT INTO public.ask_vote_choices (tenant_id, ask_id, submission_id, option_id)
    SELECT p_tenant_id, p_ask_id, v_submission_id, unnest(p_option_ids);
  END IF;

  RETURN v_submission_id;
END;
$$;

-- Revoke Public Access to Atomic RPC
REVOKE ALL ON FUNCTION public.submit_ask_vote(UUID, UUID, UUID[], TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_ask_vote(UUID, UUID, UUID[], TEXT, TEXT) TO authenticated;

-- ============================================================================
-- 9. INDEXES & TRIGGER FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_tenant_memberships_updated_at BEFORE UPDATE ON public.tenant_memberships FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_resident_verifications_updated_at BEFORE UPDATE ON public.resident_verifications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_asks_updated_at BEFORE UPDATE ON public.asks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_proposals_updated_at BEFORE UPDATE ON public.proposals FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_proposal_comments_updated_at BEFORE UPDATE ON public.proposal_comments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_official_responses_updated_at BEFORE UPDATE ON public.official_responses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_outcomes_updated_at BEFORE UPDATE ON public.outcomes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Composite Indexes
CREATE INDEX IF NOT EXISTS idx_regions_tenant_sort ON public.regions(tenant_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_memberships_tenant_user ON public.tenant_memberships(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_asks_tenant_status ON public.asks(tenant_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_ask_user ON public.ask_vote_submissions(ask_id, user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_tenant_status ON public.proposals(tenant_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_proposals_region ON public.proposals(region_id);
CREATE INDEX IF NOT EXISTS idx_empathy_proposal_user ON public.proposal_empathy(proposal_id, user_id);
CREATE INDEX IF NOT EXISTS idx_outcomes_tenant_status ON public.outcomes(tenant_id, status, created_at DESC);

-- ============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES & TABLE PRIVILEGES
-- ============================================================================

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resident_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ask_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ask_vote_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ask_vote_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_empathy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.official_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_ask_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outcome_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outcome_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outcome_asks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Revoke Direct Public Writes on Sensitive Control Tables
REVOKE INSERT, UPDATE, DELETE ON public.resident_verifications FROM PUBLIC, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.tenant_memberships FROM PUBLIC, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.ask_vote_submissions FROM PUBLIC, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.ask_vote_choices FROM PUBLIC, authenticated;

-- Public READ Policies
CREATE POLICY "Public read active tenants" ON public.tenants FOR SELECT USING (status = 'active');
CREATE POLICY "Public read active regions" ON public.regions FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated read profiles" ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users read own verifications" ON public.resident_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own memberships" ON public.tenant_memberships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public read published asks" ON public.asks FOR SELECT USING (status IN ('published', 'active', 'closed', 'archived'));
CREATE POLICY "Public read ask options" ON public.ask_options FOR SELECT USING (true);
CREATE POLICY "Users read own submissions" ON public.ask_vote_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public read non-hidden proposals" ON public.proposals FOR SELECT USING (status != 'hidden' AND deleted_at IS NULL);
CREATE POLICY "Public read proposal empathy" ON public.proposal_empathy FOR SELECT USING (true);
CREATE POLICY "Public read non-deleted comments" ON public.proposal_comments FOR SELECT USING (deleted_at IS NULL AND hidden_at IS NULL);
CREATE POLICY "Public read proposal timeline" ON public.proposal_timeline FOR SELECT USING (true);
CREATE POLICY "Public read official responses" ON public.official_responses FOR SELECT USING (is_current = true);
CREATE POLICY "Public read proposal ask links" ON public.proposal_ask_links FOR SELECT USING (true);
CREATE POLICY "Public read outcomes" ON public.outcomes FOR SELECT USING (true);
CREATE POLICY "Public read outcome steps" ON public.outcome_steps FOR SELECT USING (true);
CREATE POLICY "Public read outcome proposals" ON public.outcome_proposals FOR SELECT USING (true);
CREATE POLICY "Public read outcome asks" ON public.outcome_asks FOR SELECT USING (true);

-- Verified Resident WRITE Policies
CREATE POLICY "Verified resident create proposal" ON public.proposals FOR INSERT WITH CHECK (
  auth.uid() = user_id AND app_private.is_verified_resident(tenant_id)
);
CREATE POLICY "Verified resident toggle empathy" ON public.proposal_empathy FOR ALL USING (
  auth.uid() = user_id AND app_private.is_verified_resident(tenant_id)
);
CREATE POLICY "Verified resident add comment" ON public.proposal_comments FOR INSERT WITH CHECK (
  auth.uid() = user_id AND app_private.is_verified_resident(tenant_id)
);
CREATE POLICY "Users soft delete own comment" ON public.proposal_comments FOR UPDATE USING (
  auth.uid() = user_id
);

-- Staff & Admin Policies
CREATE POLICY "Staff admin manage asks" ON public.asks FOR ALL USING (
  app_private.has_tenant_role(tenant_id, ARRAY['council_staff', 'admin'])
);
CREATE POLICY "Staff admin manage proposals" ON public.proposals FOR UPDATE USING (
  app_private.has_tenant_role(tenant_id, ARRAY['council_staff', 'admin'])
);
CREATE POLICY "Staff admin manage responses" ON public.official_responses FOR ALL USING (
  app_private.has_tenant_role(tenant_id, ARRAY['council_staff', 'admin'])
);
CREATE POLICY "Staff admin manage outcomes" ON public.outcomes FOR ALL USING (
  app_private.has_tenant_role(tenant_id, ARRAY['council_staff', 'admin'])
);
CREATE POLICY "Admin view audit logs" ON public.audit_logs FOR SELECT USING (
  app_private.has_tenant_role(tenant_id, ARRAY['admin'])
);
