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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Compact Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          backgroundColor: '#F5F5F7',
          padding: '16px 20px',
          borderRadius: '16px',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        {[
          { key: '전체', label: '전체 성과' },
          { key: 'listen-to-ask', label: '공론화 연결 사례' },
          { key: 'listen', label: '군민 제안 시작' },
          { key: 'ask', label: '의회 의견수렴 시작' },
        ].map((btn) => {
          const isActive = currentType === btn.key;
          return (
            <button
              key={btn.key}
              type="button"
              onClick={() => setCurrentType(btn.key)}
              style={{
                height: '38px',
                padding: '0 18px',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#FFFFFF' : '#1D1D1F',
                backgroundColor: isActive ? '#0066CC' : '#FFFFFF',
                border: isActive ? 'none' : '1px solid rgba(0, 0, 0, 0.08)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Count Result Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#6E6E73', fontSize: '0.9375rem' }}>
        <div>
          총 <strong style={{ color: '#0066CC', fontWeight: 800 }}>{filteredOutcomes.length}</strong>건의 의정 성과가 있습니다.
        </div>
        <span style={{ fontSize: '0.8125rem', color: '#86868B' }}>※ 시연용 성과 예시입니다</span>
      </div>

      {/* Grid List */}
      {filteredOutcomes.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredOutcomes.map((item) => (
            <OutcomeCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '64px 20px',
            backgroundColor: '#F5F5F7',
            borderRadius: '20px',
            border: '1px dashed rgba(0,0,0,0.12)',
          }}
        >
          <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1D1D1F', marginBottom: '8px' }}>
            등록된 성과 사례가 없습니다.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6E6E73' }}>다른 카테고리를 선택해 보세요.</p>
        </div>
      )}
    </div>
  );
}
