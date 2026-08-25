import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicOutcomeById } from '@/lib/repositories/outcome-repository';

interface OutcomeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OutcomeDetailPage({ params }: OutcomeDetailPageProps) {
  const { id: outcomeId } = await params;
  const outcome = await getPublicOutcomeById(outcomeId);

  if (!outcome) {
    notFound();
  }

  return (
    <main className="ask-detail-container">
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/outcomes" className="btn-share" style={{ fontSize: '0.9375rem', fontWeight: 700 }}>
          ← 전체 성과 목록으로 돌아가기
        </Link>
      </div>

      <article className="ask-detail-card">
        {/* Header */}
        <div className="ask-detail-header">
          <div className="ask-detail-meta">
            <span className="section-tag changed-tag">함께 바꿨습니다</span>
            <span className="card-category">{outcome.category}</span>
            <span className="card-category">{outcome.regionName}</span>
            <span className="badge-status status-done">{outcome.status === 'published' ? '추진완료' : '진행중'}</span>
          </div>

          <h1 className="ask-detail-title">{outcome.title}</h1>

          <div className="ask-detail-info-bar">
            <span>🏁 완료 및 공개일: <strong>{outcome.outcomeAt}</strong></span>
          </div>
        </div>

        {/* Origin Highlight Box */}
        <div className="outcome-origin-box">
          <div className="outcome-origin-title">
            <span>🌱 이 변화는 이렇게 시작되었습니다</span>
          </div>
          <p className="outcome-origin-desc">
            군민 여러분의 참여와 의정 활동이 하나로 모여 만들어낸 소중한 성과입니다.
          </p>

          {/* Cross-linking Action Buttons */}
          <div className="cross-link-group">
            {outcome.sourceProposalId && (
              <Link href={`/listens/${outcome.sourceProposalId}`} className="btn-cross-link btn-link-listen">
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
      </article>
    </main>
  );
}
