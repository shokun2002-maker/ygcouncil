'use client';

import React from 'react';
import Link from 'next/link';
import { Outcome } from '../lib/types';

interface OutcomeCardProps {
  item: Outcome;
}

export default function OutcomeCard({ item }: OutcomeCardProps) {
  let sourceBadgeText = '군민 제안에서 시작';
  let sourceBg = '#E6F7F5';
  let sourceColor = '#00A896';

  if (item.sourceType === 'ask') {
    sourceBadgeText = '의회 의견수렴에서 시작';
    sourceBg = '#EBF5FF';
    sourceColor = '#0066CC';
  } else if (item.sourceType === 'listen-to-ask') {
    sourceBadgeText = '공론화 연결 사례';
    sourceBg = '#F3E8FF';
    sourceColor = '#7E22CE';
  }

  const pipelineSteps = item.steps ? item.steps.slice(0, 4) : [];

  return (
    <article className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: sourceColor, backgroundColor: sourceBg, padding: '4px 10px', borderRadius: '6px' }}>
          {sourceBadgeText}
        </span>
        <span className="badge-apple" style={{ backgroundColor: '#D1FAE5', color: '#059669' }}>
          {item.statusText || '추진완료'}
        </span>
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D1D1F', lineHeight: 1.35, letterSpacing: '-0.3px' }}>
        {item.title}
      </h3>

      <p style={{ fontSize: '0.9375rem', color: '#6E6E73', lineHeight: 1.6, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {item.summary}
      </p>

      {/* Mini Pipeline Steps */}
      {pipelineSteps.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F5F5F7', padding: '8px 14px', borderRadius: '10px', overflowX: 'auto' }}>
          {pipelineSteps.map((st, idx) => (
            <React.Fragment key={idx}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: st.status === 'completed' ? '#0066CC' : '#86868B', whiteSpace: 'nowrap' }}>
                {st.label}
              </span>
              {idx < pipelineSteps.length - 1 && <span style={{ fontSize: '0.75rem', color: '#C7C7CC' }}>·</span>}
            </React.Fragment>
          ))}
        </div>
      )}

      <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(0, 0, 0, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8125rem', color: '#86868B' }}>
          {item.region} · {item.outcomeDate}
        </span>
        <Link
          href={`/outcomes/${item.id}`}
          className="btn-apple btn-apple-primary"
          style={{ height: '36px', padding: '0 16px', fontSize: '0.8125rem', backgroundColor: '#0066CC' }}
        >
          과정 및 성과 보기
        </Link>
      </div>
    </article>
  );
}
