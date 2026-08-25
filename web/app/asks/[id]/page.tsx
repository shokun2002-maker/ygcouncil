'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getAskByIdClient } from '@/lib/repositories/ask-repository-client';
import { getOutcomeByIdClient } from '@/lib/repositories/outcome-repository-client';
import { Ask, Outcome } from '@/lib/types';
import Modal from '@/components/Modal';

export default function AskDetailPage() {
  const params = useParams();
  const askId = params?.id as string;

  const [ask, setAsk] = useState<Ask | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [opinionText, setOpinionText] = useState('');
  const [extraComment, setExtraComment] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!askId) return;
      setLoading(true);
      const aData = await getAskByIdClient(askId);
      setAsk(aData);

      const oData = await getOutcomeByIdClient('outcome-001');
      if (oData && oData.sourceAskId === askId) {
        setOutcome(oData);
      }
      setLoading(false);
    }
    loadData();
  }, [askId]);

  if (loading) {
    return (
      <main className="ask-detail-container">
        <div style={{ background: 'white', padding: '60px 24px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontSize: '1.125rem', color: 'var(--navy)' }}>안건 데이터를 불러오는 중입니다...</p>
        </div>
      </main>
    );
  }

  if (!ask) {
    return (
      <main className="ask-detail-container">
        <div style={{ background: 'white', padding: '60px 24px', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '12px' }}>존재하지 않는 의견수렴 안건입니다.</h2>
          <p style={{ color: 'var(--text-sub)', marginBottom: '24px' }}>요청하신 안건 정보를 찾을 수 없습니다.</p>
          <Link href="/asks" className="section-btn-action" style={{ display: 'inline-flex', background: 'var(--navy)' }}>
            의견수렴 목록 전체보기
          </Link>
        </div>
      </main>
    );
  }

  const handleSelectOption = (optId: string) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    ask.participantCount += 1;
    selectedOptions.forEach((val) => {
      const opt = ask.options.find((o) => o.id === val);
      if (opt) opt.votes += 1;
    });
    setHasVoted(true);
  };

  const totalVotesSum = ask.options.reduce((sum, opt) => sum + opt.votes, 0) || 1;

  return (
    <main className="ask-detail-container">
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
            <span className="demo-tag-pill">※ 시연용 예시 데이터</span>
          </div>

          <h1 className="ask-detail-title">{ask.title}</h1>

          <div className="ask-detail-info-bar">
            <span>📅 참여 기간: <strong>{ask.startDate} ~ {ask.endDate}</strong></span>
            <span>👥 현재 참여: <strong>{ask.participantCount}명</strong></span>
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

          {/* Survey Form / Results */}
          {!hasVoted ? (
            <div className="survey-section">
              <h3 className="survey-section-title">🗳️ 여러분의 생각은 어떠신가요?</h3>
              <form onSubmit={handleSubmit}>
                {ask.surveyType === 'yes-no' && (
                  <div>
                    <p className="survey-guide-text">안건에 대해 찬성 또는 반대를 선택해 주세요.</p>
                    <div className="yesno-grid">
                      <label
                        className={`survey-card-btn yesno-card agree-card ${
                          selectedOptions.includes('agree') ? 'selected' : ''
                        }`}
                        onClick={() => handleSelectOption('agree')}
                      >
                        <span className="yesno-icon">👍</span>
                        <span className="yesno-text">찬성합니다</span>
                      </label>
                      <label
                        className={`survey-card-btn yesno-card disagree-card ${
                          selectedOptions.includes('disagree') ? 'selected' : ''
                        }`}
                        onClick={() => handleSelectOption('disagree')}
                      >
                        <span className="yesno-icon">👎</span>
                        <span className="yesno-text">반대합니다</span>
                      </label>
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
                  <button type="submit" className="btn-submit-vote">
                    의견 제출하기 ➔
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="submitted-result-box">
              <div className="success-badge-header">
                <div className="success-icon-circle">✓</div>
                <h3 className="success-title">의견이 성공적으로 전달되었습니다.</h3>
                <p className="success-desc">
                  소중한 의견을 보내주셔서 감사합니다. 영광군의회가 귀기울여 듣겠습니다.
                </p>
              </div>

              {ask.options.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '16px' }}>
                    📊 현재 군민 의견 집계 현황
                  </h4>
                  <div className="result-progress-list">
                    {ask.options.map((opt) => {
                      const pct = Math.round((opt.votes / totalVotesSum) * 100) || 0;
                      const isSelected = selectedOptions.includes(opt.id);
                      return (
                        <div key={opt.id} className="result-progress-item">
                          <div className="result-item-header">
                            <span>
                              {opt.label}{' '}
                              {isSelected && <strong style={{ color: 'var(--blue)' }}>(내가 선택함)</strong>}
                            </span>
                            <span className="result-item-counts">
                              {pct}% ({opt.votes}표)
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
                <span>👥 현재 <strong>{ask.participantCount}명</strong>의 군민이 참여했습니다.</span>
                <span className="demo-tag-pill" style={{ marginLeft: '8px' }}>
                  ※ 현재 참여 수치는 시연용 데이터입니다.
                </span>
              </div>
            </div>
          )}

          {/* Related Outcome Box */}
          {outcome && (
            <div style={{ marginTop: '32px', padding: '20px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#D97706', marginBottom: '6px' }}>
                🏛️ 의견수렴 이후
              </h4>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-sub)', marginBottom: '12px' }}>
                군민 여러분이 보내주신 의견이 어떻게 검토되고 의정 성과로 추진되고 있는지 확인해 보세요.
              </p>
              <Link href={`/outcomes/${outcome.id}`} className="btn-cross-link btn-link-outcome">
                진행 과정 보기 ➔
              </Link>
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
    </main>
  );
}
