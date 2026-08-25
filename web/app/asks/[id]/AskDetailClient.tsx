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
      {/* Top Back & Action Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <Link
          href="/asks"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#6E6E73',
            fontSize: '0.9375rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          ← 목록으로 돌아가기
        </Link>
        <button
          type="button"
          className="btn-apple btn-apple-secondary"
          onClick={() => setIsShareModalOpen(true)}
          style={{ height: '36px', padding: '0 14px', fontSize: '0.875rem' }}
        >
          공유하기
        </button>
      </div>

      {/* Main Question Article */}
      <article style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Question Header */}
        <header style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0066CC', backgroundColor: '#F0F6FF', padding: '4px 10px', borderRadius: '6px' }}>
              의견수렴 · {ask.category}
            </span>
            <span className="badge-apple" style={{ backgroundColor: '#D1FAE5', color: '#059669' }}>
              {ask.statusText}
            </span>
            <span style={{ fontSize: '0.8125rem', color: '#86868B' }}>
              ※ 시연용 안건
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              lineHeight: 1.25,
              letterSpacing: '-0.5px',
              color: '#1D1D1F',
            }}
          >
            {ask.title}
          </h1>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              fontSize: '0.875rem',
              color: '#6E6E73',
              paddingTop: '12px',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <span>📅 기간: <strong style={{ color: '#1D1D1F' }}>{ask.startDate} ~ {ask.endDate}</strong></span>
            <span>👥 참여자: <strong style={{ color: '#0066CC' }}>{results.totalParticipants}명</strong></span>
            <span>📍 대상: <strong style={{ color: '#1D1D1F' }}>{ask.region}</strong></span>
          </div>
        </header>

        {/* Question Description Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {ask.background && (
            <div
              style={{
                backgroundColor: '#F5F5F7',
                padding: '24px 28px',
                borderRadius: '16px',
                border: '1px solid rgba(0, 0, 0, 0.06)',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1D1D1F', marginBottom: '8px' }}>
                💡 추진 배경 및 경과
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#6E6E73', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                {ask.background}
              </p>
            </div>
          )}

          <div style={{ fontSize: '1.0625rem', color: '#1D1D1F', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {ask.description}
          </div>
        </div>

        {/* Authorization Guidance Banners */}
        {!currentUser ? (
          <div
            style={{
              backgroundColor: '#FFFBEB',
              border: '1px solid #FCD34D',
              borderRadius: '16px',
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <strong style={{ color: '#92400E', fontSize: '0.9375rem' }}>🔒 의견수렴 참여는 군민인증이 필요합니다</strong>
              <p style={{ color: '#B45309', fontSize: '0.875rem', marginTop: '4px' }}>
                카카오 간편 로그인 후 영광군민 인증을 완료하시면 투표에 참여하실 수 있습니다.
              </p>
            </div>
            <Link href="/" className="btn-apple" style={{ backgroundColor: '#FEE500', color: '#191919', height: '40px', padding: '0 16px', fontSize: '0.875rem' }}>
              카카오 로그인
            </Link>
          </div>
        ) : !currentUser.isVerifiedResident ? (
          <div
            style={{
              backgroundColor: '#F0F6FF',
              border: '1px solid #93C5FD',
              borderRadius: '16px',
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <strong style={{ color: '#1E40AF', fontSize: '0.9375rem' }}>🪪 투표 참여를 위해 영광군민 인증이 필요합니다</strong>
              <p style={{ color: '#1E3A8A', fontSize: '0.875rem', marginTop: '4px' }}>
                현재 카카오 로그인 상태({currentUser.displayName})이나 군민 미인증 상태입니다.
              </p>
            </div>
            <Link href="/verification" className="btn-apple btn-apple-primary" style={{ height: '40px', padding: '0 16px', fontSize: '0.875rem' }}>
              군민인증 신청 ➔
            </Link>
          </div>
        ) : null}

        {/* Apple-style Vote Container */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '24px',
            padding: '36px 32px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          }}
        >
          {!hasVoted ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D1D1F' }}>
                  🗳️ 군민 의견 투표
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6E6E73' }}>
                  {ask.surveyType === 'yes-no' && '안건에 대해 찬성 또는 반대를 선택해 주세요.'}
                  {ask.surveyType === 'single' && '다음 항목 중 가장 적절한 한 가지를 선택해 주세요.'}
                  {ask.surveyType === 'multiple' && `필요하다고 생각하는 항목을 선택해 주세요. (최대 ${ask.maxSelectCount || 2}개)`}
                  {ask.surveyType === 'opinion' && '영광군의회에 전달하고자 하는 의견을 작성해 주세요.'}
                </p>
              </div>

              {/* surveyType: yes-no */}
              {ask.surveyType === 'yes-no' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                  {ask.options.map((opt) => {
                    const isSelected = selectedOptions.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        style={{
                          height: '64px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          borderRadius: '14px',
                          border: isSelected ? '2px solid #0066CC' : '1px solid rgba(0, 0, 0, 0.12)',
                          backgroundColor: isSelected ? '#F0F6FF' : '#FFFFFF',
                          color: isSelected ? '#0066CC' : '#1D1D1F',
                          fontSize: '1.0625rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 150ms ease',
                        }}
                      >
                        <span>{opt.label.includes('찬성') ? '👍' : '👎'}</span>
                        <span>{opt.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* surveyType: single / multiple */}
              {(ask.surveyType === 'single' || ask.surveyType === 'multiple') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {ask.options.map((opt) => {
                    const isSelected = selectedOptions.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        style={{
                          minHeight: '56px',
                          padding: '16px 20px',
                          borderRadius: '14px',
                          border: isSelected ? '2px solid #0066CC' : '1px solid rgba(0, 0, 0, 0.12)',
                          backgroundColor: isSelected ? '#F0F6FF' : '#FFFFFF',
                          color: isSelected ? '#0066CC' : '#1D1D1F',
                          fontSize: '0.9375rem',
                          fontWeight: isSelected ? 700 : 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          cursor: 'pointer',
                          transition: 'all 150ms ease',
                        }}
                      >
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: ask.surveyType === 'single' ? '50%' : '6px',
                            border: isSelected ? '6px solid #0066CC' : '2px solid #C7C7CC',
                            backgroundColor: '#FFFFFF',
                            boxSizing: 'border-box',
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ lineHeight: 1.4 }}>{opt.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* surveyType: opinion */}
              {ask.surveyType === 'opinion' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <textarea
                    rows={5}
                    maxLength={1000}
                    placeholder="영광군 정책 및 의정활동에 바라는 점을 자유롭게 작성해 주세요."
                    value={opinionText}
                    onChange={(e) => setOpinionText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '14px',
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      fontSize: '0.9375rem',
                      lineHeight: 1.6,
                      color: '#1D1D1F',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ textAlign: 'right', fontSize: '0.8125rem', color: '#86868B' }}>
                    {opinionText.length} / 1000자
                  </div>
                </div>
              )}

              {/* allowComment (선택 한 줄 의견) */}
              {ask.allowComment && ask.surveyType !== 'opinion' && (
                <div style={{ paddingTop: '20px', borderTop: '1px dashed rgba(0, 0, 0, 0.12)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1D1D1F' }}>
                    💬 의견을 조금 더 들려주세요 (선택사항)
                  </label>
                  <textarea
                    rows={3}
                    maxLength={500}
                    placeholder="선택하신 이유나 추가로 전하고 싶은 구체적인 의견을 남겨주세요."
                    value={extraComment}
                    onChange={(e) => setExtraComment(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                      color: '#1D1D1F',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ textAlign: 'right', fontSize: '0.8125rem', color: '#86868B' }}>
                    {extraComment.length} / 500자
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  type="submit"
                  className="btn-apple btn-apple-primary"
                  disabled={isSubmitting || !currentUser?.isVerifiedResident}
                  style={{
                    width: '100%',
                    height: '52px',
                    fontSize: '1rem',
                    opacity: !currentUser?.isVerifiedResident ? 0.5 : 1,
                    cursor: !currentUser?.isVerifiedResident ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? '의견 보내는 중...' : '의견 제출하기 ➔'}
                </button>
              </div>
            </form>
          ) : (
            /* Results View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ textAlign: 'center', padding: '24px 16px', backgroundColor: '#F0F6FF', borderRadius: '16px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✓</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0066CC', marginBottom: '6px' }}>
                  의견수렴 참여가 완료되었습니다.
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6E6E73' }}>
                  소중한 의견을 보내주셔서 감사합니다. 영광군의회가 귀기울여 듣겠습니다.
                </p>
              </div>

              {results.visible && results.options.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1D1D1F' }}>
                    📊 실시간 군민 의견 집계 현황
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {results.options.map((opt) => {
                      const pct = Math.round((opt.voteCount / totalVotesSum) * 100) || 0;
                      const isSelected = selectedOptions.includes(opt.optionId);
                      return (
                        <div key={opt.optionId} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', color: '#1D1D1F' }}>
                            <span>
                              {opt.label}{' '}
                              {isSelected && <strong style={{ color: '#0066CC' }}>(내가 선택함)</strong>}
                            </span>
                            <span style={{ fontWeight: 700, color: '#0066CC' }}>
                              {pct}% ({opt.voteCount}표)
                            </span>
                          </div>
                          {/* Apple Progress Bar */}
                          <div style={{ width: '100%', height: '8px', backgroundColor: '#F5F5F7', borderRadius: '999px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${pct}%`,
                                height: '100%',
                                backgroundColor: '#0066CC',
                                borderRadius: '999px',
                                transition: 'width 300ms ease',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#86868B', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                👥 실제 영광군민 <strong>{results.totalParticipants}명</strong>의 군민이 참여했습니다.
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
