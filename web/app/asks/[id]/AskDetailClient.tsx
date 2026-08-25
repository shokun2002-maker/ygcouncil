'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Ask } from '@/lib/types';
import { UserSessionProfile } from '@/lib/auth/types';
import { AskVoteResults } from '@/lib/repositories/ask-vote-repository';
import { createClient } from '@/lib/supabase/client';
import { YGCOUNCIL_TENANT_ID } from '@/lib/config/tenant';
import Modal from '@/components/Modal';

interface AskDetailClientProps {
  ask: Ask;
  currentUser: UserSessionProfile | null;
  initialHasVoted: boolean;
  initialResults: AskVoteResults;
}

export default function AskDetailClient({
  ask,
  currentUser,
  initialHasVoted,
  initialResults,
}: AskDetailClientProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [opinionText, setOpinionText] = useState('');
  const [extraComment, setExtraComment] = useState('');

  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [results, setResults] = useState<AskVoteResults>(initialResults);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleSelectOption = (optId: string) => {
    if (hasVoted) return;

    if (ask.surveyType === 'yes-no' || ask.surveyType === 'single') {
      setSelectedOptions([optId]);
    } else if (ask.surveyType === 'multiple') {
      const max = ask.maxSelectCount || 2;
      if (selectedOptions.includes(optId)) {
        setSelectedOptions(selectedOptions.filter((id) => id !== optId));
      } else {
        if (selectedOptions.length >= max) {
          alert(`⚠️ 이 안건은 최대 ${max}개까지 선택 가능합니다.`);
          return;
        }
        setSelectedOptions([...selectedOptions, optId]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert('🔒 투표 참여는 카카오 로그인이 필요합니다.');
      return;
    }

    if (!currentUser.isVerifiedResident) {
      alert('🪪 투표 참여는 영광군민 인증이 완료된 계정만 가능합니다.\n[군민인증 신청하기] 화면으로 이동합니다.');
      window.location.href = '/verification';
      return;
    }

    if (ask.surveyType === 'opinion') {
      if (!opinionText.trim()) {
        alert('⚠️ 의견 내용을 입력해 주세요.');
        return;
      }
    } else {
      if (selectedOptions.length === 0) {
        alert('⚠️ 수렴 항목을 최소 1개 이상 선택해 주세요.');
        return;
      }
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data: submissionId, error } = await supabase.rpc('submit_ask_vote', {
        p_tenant_id: YGCOUNCIL_TENANT_ID,
        p_ask_id: ask.id,
        p_option_ids: selectedOptions,
        p_opinion_text: opinionText.trim() || undefined,
        p_comment_text: extraComment.trim() || undefined,
      });

      if (error) {
        console.error('Vote submission error:', error);
        if (error.message.includes('이미 이 의견수렴에 참여')) {
          alert('⚠️ 이미 이 의견수렴에 참여하셨습니다.');
        } else {
          alert(`투표 제출 실패: ${error.message}`);
        }
      } else {
        alert('의견이 성공적으로 전달되었습니다. 감사합니다!');
        setHasVoted(true);
        // 집계 재조회
        const { data: newResults } = await supabase.rpc('get_ask_vote_results', {
          p_tenant_id: YGCOUNCIL_TENANT_ID,
          p_ask_id: ask.id,
        });

        if (newResults) {
          const res = newResults as any;
          setResults({
            visible: res.visible ?? true,
            reason: res.reason,
            hasVoted: true,
            totalParticipants: res.total_participants ?? 0,
            options: (res.options || []).map((o: any) => ({
              optionId: o.option_id,
              label: o.label,
              sortOrder: o.sort_order,
              voteCount: o.vote_count ?? 0,
            })),
          });
        }
      }
    } catch (err: any) {
      alert('투표 처리 중 오류가 발생했습니다: ' + err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalVotesSum = results.options.reduce((sum, opt) => sum + opt.voteCount, 0) || 1;

  return (
    <>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/asks" className="btn-share" style={{ fontSize: '0.9375rem', fontWeight: 700 }}>
          ← 전체 목록으로 돌아가기
        </Link>
        <button className="btn-share" onClick={() => setIsShareModalOpen(true)}>
          ↗ 공유
        </button>
      </div>

      <article className="ask-detail-card">
        {/* Header */}
        <div className="ask-detail-header">
          <div className="ask-detail-meta">
            <span className="section-tag ask-tag">묻습니다</span>
            <span className="card-category">{ask.category}</span>
            <span className="badge-status status-active">{ask.statusText}</span>
          </div>

          <h1 className="ask-detail-title">{ask.title}</h1>

          <div className="ask-detail-info-bar">
            <span>📅 참여 기간: <strong>{ask.startDate} ~ {ask.endDate}</strong></span>
            <span>👥 실 참여자: <strong>{results.totalParticipants}명</strong></span>
            <span>📍 대상 지역: <strong>{ask.region}</strong></span>
          </div>
        </div>

        {/* Content */}
        <div className="ask-detail-body">
          {ask.background && (
            <div className="ask-bg-box">
              <h3>💡 추진 배경 및 추진 경과</h3>
              <p>{ask.background}</p>
            </div>
          )}

          <div className="ask-desc-box">
            <h3>📋 안건 상세 내용</h3>
            <p>{ask.description}</p>
          </div>

          {/* 권한 안내 Banner */}
          {!currentUser ? (
            <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ color: '#92400E', fontSize: '0.9375rem' }}>🔒 의견수렴 참여는 군민인증이 필요합니다.</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#B45309' }}>카카오 간편 로그인 후 영광군민 인증을 완료하시면 투표에 참여하실 수 있습니다.</p>
              </div>
              <Link href="/" style={{ background: '#FEE500', color: '#191919', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                카카오 로그인
              </Link>
            </div>
          ) : !currentUser.isVerifiedResident ? (
            <div style={{ background: '#EFF6FF', border: '1px solid #93C5FD', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ color: '#1E40AF', fontSize: '0.9375rem' }}>🪪 투표 참여를 위해 영광군민 인증이 필요합니다.</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#1E3A8A' }}>현재 카카오 로그인 상태({currentUser.displayName})이나 군민 미인증 상태입니다.</p>
              </div>
              <Link href="/verification" style={{ background: '#2563EB', color: 'white', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                군민인증 신청 ➔
              </Link>
            </div>
          ) : null}

          {/* Survey Form / Results */}
          {!hasVoted ? (
            <div className="survey-section">
              <h3 className="survey-section-title">🗳️ 여러분의 생각은 어떠신가요?</h3>
              <form onSubmit={handleSubmit}>
                {ask.surveyType === 'yes-no' && (
                  <div>
                    <p className="survey-guide-text">안건에 대해 찬성 또는 반대를 선택해 주세요.</p>
                    <div className="yesno-grid">
                      {ask.options.map((opt) => (
                        <label
                          key={opt.id}
                          className={`survey-card-btn yesno-card ${
                            selectedOptions.includes(opt.id) ? 'selected' : ''
                          }`}
                          onClick={() => handleSelectOption(opt.id)}
                        >
                          <span className="yesno-icon">{opt.label.includes('찬성') ? '👍' : '👎'}</span>
                          <span className="yesno-text">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {(ask.surveyType === 'single' || ask.surveyType === 'multiple') && (
                  <div>
                    <p className="survey-guide-text">
                      {ask.surveyType === 'single'
                        ? '다음 항목 중 가장 적절한 하나를 선택해 주세요.'
                        : `필요하다고 생각하는 항목을 선택해 주세요. (최대 ${ask.maxSelectCount || 2}개)`}
                    </p>
                    <div className="option-cards-group">
                      {ask.options.map((opt) => (
                        <label
                          key={opt.id}
                          className={`survey-card-btn ${
                            selectedOptions.includes(opt.id) ? 'selected' : ''
                          }`}
                          onClick={() => handleSelectOption(opt.id)}
                        >
                          <span className="card-check-icon">✓</span>
                          <span className="survey-card-label">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {ask.surveyType === 'opinion' && (
                  <div>
                    <p className="survey-guide-text">
                      영광군의회에 전달하고자 하는 의견을 자유롭게 작성해 주세요. (최대 1000자)
                    </p>
                    <div className="opinion-textarea-wrapper">
                      <textarea
                        className="survey-textarea"
                        maxLength={1000}
                        placeholder="영광군 정책 및 의정활동에 바라는 점을 작성해 주세요."
                        value={opinionText}
                        onChange={(e) => setOpinionText(e.target.value)}
                      />
                      <div className="textarea-char-counter">{opinionText.length} / 1000자</div>
                    </div>
                  </div>
                )}

                {ask.allowComment && ask.surveyType !== 'opinion' && (
                  <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px dashed var(--border)' }}>
                    <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '8px' }}>
                      💬 의견을 조금 더 들려주세요 (선택사항)
                    </h4>
                    <div className="opinion-textarea-wrapper" style={{ marginBottom: 0 }}>
                      <textarea
                        className="survey-textarea"
                        style={{ minHeight: '90px' }}
                        maxLength={500}
                        placeholder="선택하신 이유나 추가로 전하고 싶은 구체적인 의견을 남겨주세요."
                        value={extraComment}
                        onChange={(e) => setExtraComment(e.target.value)}
                      />
                      <div className="textarea-char-counter">{extraComment.length} / 500자</div>
                    </div>
                  </div>
                )}

                <div className="submit-action-bar">
                  <button
                    type="submit"
                    className="btn-submit-vote"
                    disabled={isSubmitting || !currentUser?.isVerifiedResident}
                    style={{
                      opacity: !currentUser?.isVerifiedResident ? 0.6 : 1,
                      cursor: !currentUser?.isVerifiedResident ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSubmitting ? '제출 중...' : '의견 제출하기 ➔'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="submitted-result-box">
              <div className="success-badge-header">
                <div className="success-icon-circle">✓</div>
                <h3 className="success-title">의견수렴 참여가 완료되었습니다.</h3>
                <p className="success-desc">
                  소중한 의견을 보내주셔서 감사합니다. 영광군의회가 귀기울여 듣겠습니다.
                </p>
              </div>

              {results.visible && results.options.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '16px' }}>
                    📊 DB 실시간 군민 의견 집계 현황
                  </h4>
                  <div className="result-progress-list">
                    {results.options.map((opt) => {
                      const pct = Math.round((opt.voteCount / totalVotesSum) * 100) || 0;
                      const isSelected = selectedOptions.includes(opt.optionId);
                      return (
                        <div key={opt.optionId} className="result-progress-item">
                          <div className="result-item-header">
                            <span>
                              {opt.label}{' '}
                              {isSelected && <strong style={{ color: 'var(--blue)' }}>(내가 선택함)</strong>}
                            </span>
                            <span className="result-item-counts">
                              {pct}% ({opt.voteCount}표)
                            </span>
                          </div>
                          <div className="result-bar-track">
                            <div className="result-bar-fill" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ background: 'var(--bg-light)', padding: '14px 18px', borderRadius: 'var(--radius-sm)', marginBottom: '28px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-sub)' }}>
                <span>👥 실제 영광군민 <strong>{results.totalParticipants}명</strong>의 군민이 참여했습니다.</span>
              </div>
            </div>
          )}
        </div>
      </article>

      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="공유하기"
        desc={`「${ask.title}」 안건의 의견수렴 현황을 주변 군민들과 공유해 보세요.`}
        showShareActions={true}
      />
    </>
  );
}
