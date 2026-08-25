'use client';

import React, { useState, useMemo } from 'react';
import { Outcome } from '@/lib/types';
import OutcomeCard from '@/components/OutcomeCard';

interface OutcomesListClientProps {
  initialOutcomes: Outcome[];
}

export default function OutcomesListClient({ initialOutcomes }: OutcomesListClientProps) {
  const [currentType, setCurrentType] = useState('전체');

  const filteredOutcomes = useMemo(() => {
    if (currentType === '전체') return initialOutcomes;
    return initialOutcomes.filter((item) => item.sourceType === currentType);
  }, [initialOutcomes, currentType]);

  return (
    <>
      <div className="filter-pills" style={{ marginBottom: 0 }}>
        <button
          className={`pill-btn ${currentType === '전체' ? 'active' : ''}`}
          onClick={() => setCurrentType('전체')}
        >
          전체 성과
        </button>
        <button
          className={`pill-btn ${currentType === 'listen-to-ask' ? 'active' : ''}`}
          onClick={() => setCurrentType('listen-to-ask')}
        >
          🔥 공론화 연결
        </button>
        <button
          className={`pill-btn ${currentType === 'listen' ? 'active' : ''}`}
          onClick={() => setCurrentType('listen')}
        >
          💬 군민 제안에서 시작
        </button>
        <button
          className={`pill-btn ${currentType === 'ask' ? 'active' : ''}`}
          onClick={() => setCurrentType('ask')}
        >
          🙋‍♂️ 의회 의견수렴에서 시작
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--navy)', paddingBottom: '12px' }}>
        <div style={{ fontSize: '0.9375rem', color: 'var(--navy)', fontWeight: 700 }}>
          총 <strong style={{ color: 'var(--blue)' }}>{filteredOutcomes.length}</strong>건의 의정 성과가 있습니다.
        </div>
        <span className="demo-tag-pill">※ 본 페이지 데이터는 서비스 시연을 위한 예시입니다.</span>
      </div>

      {filteredOutcomes.length > 0 ? (
        <div className="cards-grid">
          {filteredOutcomes.map((item) => (
            <OutcomeCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-strong)' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>
            선택한 필터의 성과 데이터가 없습니다.
          </p>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-sub)' }}>다른 필터를 선택해 보세요.</p>
        </div>
      )}
    </>
  );
}
