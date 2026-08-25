import React from 'react';
import Link from 'next/link';
import { Outcome } from '../lib/types';

interface OutcomeCardProps {
  item: Outcome;
}

export default function OutcomeCard({ item }: OutcomeCardProps) {
  let sourceBadgeText = '군민 제안에서 시작';
  let sourceBadgeClass = 'source-listen';

  if (item.sourceType === 'ask') {
    sourceBadgeText = '의회 의견수렴에서 시작';
    sourceBadgeClass = 'source-ask';
  } else if (item.sourceType === 'listen-to-ask') {
    sourceBadgeText = '공론화 연결 사례';
    sourceBadgeClass = 'source-listen-to-ask';
  }

  const pipelineSteps = item.steps ? item.steps.slice(0, 4) : [];

  return (
    <article className="content-card">
      <div className="card-meta-top">
        <span className="card-category">{item.region} · {item.category}</span>
        <span className={`source-type-badge ${sourceBadgeClass}`}>{sourceBadgeText}</span>
      </div>
      <h3 className="card-title">{item.title}</h3>
      <p className="card-body-text">{item.summary}</p>
      
      {pipelineSteps.length > 0 && (
        <div className="outcome-pipeline-bar">
          {pipelineSteps.map((st, idx) => (
            <React.Fragment key={idx}>
              <span className={`pipeline-step ${st.status === 'completed' ? 'active' : ''}`}>
                {st.status === 'completed' ? '✓' : '●'} {st.label}
              </span>
              {idx < pipelineSteps.length - 1 && <span className="pipeline-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="card-footer">
        <span>🏁 {item.statusText} ({item.outcomeDate})</span>
        <Link
          href={`/outcomes/${item.id}`}
          className="btn-card-action"
          style={{ background: 'var(--navy)', color: 'white' }}
        >
          과정 보기 →
        </Link>
      </div>
    </article>
  );
}
