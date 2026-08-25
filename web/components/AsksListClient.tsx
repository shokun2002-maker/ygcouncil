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
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="filter-pills" id="ask-filter-pills" style={{ marginBottom: 0 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`pill-btn ${currentCategory === cat ? 'active' : ''}`}
                onClick={() => setCurrentCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ width: 'min(360px, 100%)' }}>
            <input
              type="text"
              className="search-input"
              placeholder="안건 제목 또는 내용 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--navy)', paddingBottom: '12px' }}>
        <div style={{ fontSize: '0.9375rem', color: 'var(--navy)', fontWeight: 700 }}>
          총 <strong style={{ color: 'var(--blue)' }}>{filteredAsks.length}</strong>건의 의견수렴 안건이 있습니다.
        </div>
        <span className="demo-tag-pill">※ 본 안건은 시연용 예시 데이터입니다.</span>
      </div>

      {filteredAsks.length > 0 ? (
        <div className="cards-grid">
          {filteredAsks.map((item) => (
            <AskCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-strong)' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>
            검색 결과가 없습니다.
          </p>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-sub)' }}>다른 검색어나 카테고리를 선택해 보세요.</p>
        </div>
      )}
    </>
  );
}
