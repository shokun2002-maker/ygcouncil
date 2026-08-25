'use client';

import React, { useState, useMemo } from 'react';
import { Ask } from '@/lib/types';
import AskCard from '@/components/AskCard';

const CATEGORIES = ['전체', '청년정책', '지역경제', '농업·농촌', '교통·안전', '복지·건강'];

interface AsksListClientProps {
  initialAsks: Ask[];
}

export default function AsksListClient({ initialAsks }: AsksListClientProps) {
  const [currentCategory, setCurrentCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAsks = useMemo(() => {
    return initialAsks.filter((item) => {
      const matchCat = currentCategory === '전체' || item.category === currentCategory;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [initialAsks, currentCategory, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Compact Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          backgroundColor: '#F5F5F7',
          padding: '16px 20px',
          borderRadius: '16px',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCurrentCategory(cat)}
                style={{
                  height: '36px',
                  padding: '0 16px',
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
                {cat}
              </button>
            );
          })}
        </div>

        <div style={{ width: 'min(320px, 100%)' }}>
          <input
            type="text"
            placeholder="안건 제목 또는 내용 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '40px',
              padding: '0 16px',
              borderRadius: '10px',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              backgroundColor: '#FFFFFF',
              fontSize: '0.875rem',
              color: '#1D1D1F',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Result Count Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#6E6E73', fontSize: '0.9375rem' }}>
        <div>
          총 <strong style={{ color: '#0066CC', fontWeight: 800 }}>{filteredAsks.length}</strong>건의 의견수렴 안건이 있습니다.
        </div>
        <span style={{ fontSize: '0.8125rem', color: '#86868B' }}>※ 시연용 데이터입니다</span>
      </div>

      {/* Grid List */}
      {filteredAsks.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredAsks.map((item) => (
            <AskCard key={item.id} item={item} />
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
            검색 결과가 없습니다.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6E6E73' }}>다른 검색어나 카테고리를 선택해 보세요.</p>
        </div>
      )}
    </div>
  );
}
