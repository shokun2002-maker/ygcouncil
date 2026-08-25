-- ====================================================================
-- 영광군의회 「열린소통 ON」 V4 Ask Vote WRITE Hardening & Results RPC
-- File: supabase/migrations/20260826020000_v4_ask_vote_write_hardening.sql
-- ====================================================================

-- 1. HARDENED ATOMIC VOTE SUBMISSION RPC FUNCTION
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
  v_clean_option_ids UUID[];
  v_opt_count INT;
  v_valid_opts INT;
BEGIN
  -- 사용자 ID 획득 (auth.uid() 필수)
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '인증된 사용자만 참여할 수 있습니다.';
  END IF;

  -- 1. DB 기준 군민인증 완료 여부 검증
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
    RAISE EXCEPTION '이미 이 의견수렴에 참여하셨습니다.';
  END IF;

  -- 4. 중복 option_id 제거 및 선택지 수 검증
  IF p_option_ids IS NOT NULL AND array_length(p_option_ids, 1) > 0 THEN
    SELECT array_agg(DISTINCT elem) INTO v_clean_option_ids
    FROM unnest(p_option_ids) AS elem;
  ELSE
    v_clean_option_ids := '{}';
  END IF;

  v_opt_count := array_length(v_clean_option_ids, 1);
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
    IF length(p_opinion_text) > 1000 THEN
      RAISE EXCEPTION '의견 내용은 최대 1,000자까지 입력 가능합니다.';
    END IF;
  END IF;

  IF p_comment_text IS NOT NULL AND length(p_comment_text) > 500 THEN
    RAISE EXCEPTION '한 줄 한마디는 최대 500자까지 입력 가능합니다.';
  END IF;

  -- 5. Cross-Ask 선택지 Mismatch 검증 (해당 ask_id 소속인지 확인)
  IF v_opt_count > 0 THEN
    SELECT COUNT(*) INTO v_valid_opts
    FROM public.ask_options
    WHERE tenant_id = p_tenant_id AND ask_id = p_ask_id AND id = ANY(v_clean_option_ids);

    IF v_valid_opts != v_opt_count THEN
      RAISE EXCEPTION '유효하지 않거나 해당 안건에 속하지 않는 선택지가 포함되어 있습니다.';
    END IF;
  END IF;

  -- 6. Atomic Submissions & Choices INSERT
  INSERT INTO public.ask_vote_submissions (
    tenant_id, ask_id, user_id, opinion_text, comment_text
  ) VALUES (
    p_tenant_id, p_ask_id, v_user_id, trim(p_opinion_text), trim(p_comment_text)
  ) RETURNING id INTO v_submission_id;

  IF v_opt_count > 0 THEN
    INSERT INTO public.ask_vote_choices (tenant_id, ask_id, submission_id, option_id)
    SELECT p_tenant_id, p_ask_id, v_submission_id, unnest(v_clean_option_ids);
  END IF;

  RETURN v_submission_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_ask_vote(UUID, UUID, UUID[], TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_ask_vote(UUID, UUID, UUID[], TEXT, TEXT) TO authenticated;


-- 2. SAFE RESULTS AGGREGATION RPC FUNCTION WITH RESULT VISIBILITY POLICY
CREATE OR REPLACE FUNCTION public.get_ask_vote_results(
  p_tenant_id UUID,
  p_ask_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_ask RECORD;
  v_has_voted BOOLEAN := false;
  v_total_participants INT := 0;
  v_options_result JSONB;
BEGIN
  v_user_id := (SELECT auth.uid());

  SELECT * INTO v_ask
  FROM public.asks
  WHERE id = p_ask_id AND tenant_id = p_tenant_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION '존재하지 않는 안건입니다.';
  END IF;

  IF v_user_id IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM public.ask_vote_submissions
      WHERE tenant_id = p_tenant_id AND ask_id = p_ask_id AND user_id = v_user_id
    ) INTO v_has_voted;
  END IF;

  -- Result Visibility 검증
  -- always: 누구나
  -- after-vote: 투표했거나 마감된 경우
  -- after-close: 마감된 경우
  IF v_ask.result_visibility = 'after-vote' THEN
    IF NOT v_has_voted AND (v_ask.end_at IS NULL OR v_ask.end_at > now()) THEN
      RETURN jsonb_build_object(
        'visible', false,
        'reason', 'after-vote',
        'has_voted', v_has_voted,
        'total_participants', 0,
        'options', '[]'::jsonb
      );
    END IF;
  ELSIF v_ask.result_visibility = 'after-close' THEN
    IF v_ask.end_at IS NOT NULL AND v_ask.end_at > now() THEN
      RETURN jsonb_build_object(
        'visible', false,
        'reason', 'after-close',
        'has_voted', v_has_voted,
        'total_participants', 0,
        'options', '[]'::jsonb
      );
    END IF;
  END IF;

  -- 총 참여자 수 집계
  SELECT COUNT(*) INTO v_total_participants
  FROM public.ask_vote_submissions
  WHERE tenant_id = p_tenant_id AND ask_id = p_ask_id;

  -- 선택지별 실제 표수 집계
  SELECT jsonb_agg(
    jsonb_build_object(
      'option_id', ao.id,
      'label', ao.label,
      'sort_order', ao.sort_order,
      'vote_count', COALESCE(vc.cnt, 0)
    ) ORDER BY ao.sort_order
  ) INTO v_options_result
  FROM public.ask_options ao
  LEFT JOIN (
    SELECT option_id, COUNT(*) as cnt
    FROM public.ask_vote_choices
    WHERE tenant_id = p_tenant_id AND ask_id = p_ask_id
    GROUP BY option_id
  ) vc ON ao.id = vc.option_id
  WHERE ao.tenant_id = p_tenant_id AND ao.ask_id = p_ask_id;

  RETURN jsonb_build_object(
    'visible', true,
    'has_voted', v_has_voted,
    'total_participants', v_total_participants,
    'options', COALESCE(v_options_result, '[]'::jsonb)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_ask_vote_results(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_ask_vote_results(UUID, UUID) TO PUBLIC, anon, authenticated;
