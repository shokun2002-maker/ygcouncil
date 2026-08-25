'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getOutcomeByIdClient } from '@/lib/repositories/outcome-repository-client';
import { Outcome } from '@/lib/types';
import Modal from '@/components/Modal';

export default function OutcomeDetailPage() {
  const params = useParams();
  const outcomeId = params?.id as string;

  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!outcomeId) return;
      setLoading(true);
      const oData = await getOutcomeByIdClient(outcomeId);
      setOutcome(oData);
      setLoading(false);
    }
    loadData();
  }, [outcomeId]);

  if (loading) {
    return (
      <main className="ask-detail-container">
        <div style={{ background: 'white', padding: '60px 24px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontSize: '1.125rem', color: 'var(--navy)' }}>성과 데이터를 불러오는 중입니다...</p>
        </div>
      </main>
    );
  }

  if (!outcome) {
    return (
      <main className="ask-detail-container">
        <div style={{ background: 'white', padding: '60px 24px', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '12px' }}>존재하지 않는 의정 성과 안건입니다.</h2>
          <p style={{ color: 'var(--text-sub)', marginBottom: '24px' }}>요청하신 성과 정보를 찾을 수 없습니다.</p>
          <Link href="/outcomes" className="section-btn-action" style={{ display: 'inline-flex', background: 'var(--navy)' }}>
            전체 성과 목록보기
          </Link>
        </div>
      </main>
    );
  }

  let sourceLabel = '군민의 제안에서 시작되었습니다.';
  let badgeClass = 'source-listen';
  let badgeText = '군민 제안에서 시작';

  if (outcome.sourceType === 'ask') {
    sourceLabel = '영광군의회의 의견수렴에서 시작되었습니다.';
    badgeClass = 'source-ask';
    badgeText = '의회 의견수렴에서 시작';
  } else if (outcome.sourceType === 'listen-to-ask') {
    sourceLabel = '군민 제안이 의회 의견수렴(공론화)으로 이어졌습니다.';
    badgeClass = 'source-listen-to-ask';
    badgeText = '공론화 연결 사례';
  }

  return (
    <main className="ask-detail-container">
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/outcomes" className="btn-share" style={{ fontSize: '0.9375rem', fontWeight: 700 }}>
          ← 전체 성과 목록으로 돌아가기
        </Link>
        <button className="btn-share" onClick={() => setIsShareModalOpen(true)}>
          ↗ 공유
        </button>
      </div>

      <article className="ask-detail-card">
        {/* Header */}
        <div className="ask-detail-header">
          <div className="ask-detail-meta">
            <span className="section-tag changed-tag">함께 바꿨습니다</span>
            <span className="card-category">{outcome.category}</span>
            <span className="card-category">{outcome.region}</span>
            <span className={`source-type-badge ${badgeClass}`}>{badgeText}</span>
            <span className="badge-status status-done">{outcome.statusText}</span>
            <span className="demo-tag-pill">※ 시연용 예시 데이터</span>
          </div>

          <h1 className="ask-detail-title">{outcome.title}</h1>

          <div className="ask-detail-info-bar">
            <span>📅 추진 기간: <strong>{outcome.startedAt} ~ {outcome.updatedAt}</strong></span>
            <span>🏁 완료일: <strong>{outcome.outcomeDate}</strong></span>
          </div>
        </div>

        {/* Origin Highlight Box */}
        <div className="outcome-origin-box">
          <div className="outcome-origin-title">
            <span>🌱 이 변화는 이렇게 시작되었습니다</span>
          </div>
          <p className="outcome-origin-desc">{sourceLabel}</p>

          {/* Cross-linking Action Buttons */}
          <div className="cross-link-group">
            {outcome.sourceListenId && (
              <Link href={`/listens/${outcome.sourceListenId}`} className="btn-cross-link btn-link-listen">
                💬 처음 제안 보기 ➔
              </Link>
            )}
            {outcome.sourceAskId && (
              <Link href={`/asks/${outcome.sourceAskId}`} className="btn-cross-link btn-link-ask">
                🙋‍♂️ 군민 의견수렴 보기 ➔
              </Link>
            )}
          </div>
        </div>

        {/* Summary & Result */}
        <div style={{ marginBottom: '32px', fontSize: '1.0625rem', color: 'var(--text)', lineHeight: 1.8 }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '12px' }}>
            📋 개요 및 주요 성과 내용
          </h3>
          <p style={{ marginBottom: '16px', fontWeight: 600, color: 'var(--text-sub)' }}>
            {outcome.summary}
          </p>
          <div style={{ background: 'var(--bg-light)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '8px' }}>
              🏛️ 의회 처리 및 예산 반영 결과
            </h4>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text)', lineHeight: 1.65 }}>
              {outcome.result}
            </p>
          </div>
        </div>

        {/* Timeline Steps */}
        {outcome.steps && outcome.steps.length > 0 && (
          <div className="timeline-container">
            <div className="timeline-title">
              <span>🗺️ 함께 만들어온 과정</span>
            </div>
            <div className="timeline-list">
              {outcome.steps.map((st, idx) => (
                <div
                  key={idx}
                  className={`timeline-step-item ${
                    st.status === 'completed'
                      ? 'completed'
                      : st.status === 'current'
                      ? 'current'
                      : ''
                  }`}
                >
                  <div className="timeline-step-icon">
                    {st.status === 'completed' ? '✓' : st.status === 'current' ? '●' : '○'}
                  </div>
                  <div className="timeline-step-content">
                    <span className="timeline-step-label">{st.label}</span>
                    <span className="timeline-step-date">{st.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>

      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="공유하기"
        desc={`「${outcome.title}」 성과를 주변 군민들과 공유해 보세요.`}
        showShareActions={true}
      />
    </main>
  );
}
