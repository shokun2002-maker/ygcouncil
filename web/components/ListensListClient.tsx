'use client';

import React, { useState, useMemo } from 'react';
import { Proposal } from '@/lib/types';
import ListenCard from '@/components/ListenCard';

const CATEGORIES = ['전체', '생활환경', '교통', '복지', '청년', '교육', '문화·관광', '농업', '지역경제', '기타'];

const REGIONS = [
  '영광군 전체',
  '영광읍',
  '백수읍',
  '홍농읍',
  '대마면',
  '묘량면',
  '불갑면',
  '군서면',
  '군남면',
  '염산면',
  '법성면',
  '낙월면',
];

interface ListensListClientProps {
  initialProposals: Proposal[];
}

export default function ListensListClient({ initialProposals }: ListensListClientProps) {
  const [currentCategory, setCurrentCategory] = useState('전체');
  const [currentRegion, setCurrentRegion] = useState('영광군 전체');
  const [currentSort, setCurrentSort] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListens = useMemo(() => {
    return initialProposals.filter((item) => {
      const matchCat = currentCategory === '전체' || item.category === currentCategory;
      const matchReg = currentRegion === '영광군 전체' || item.region === currentRegion;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.authorDisplay.toLowerCase().includes(q);
      return matchCat && matchReg && matchQuery;
    }).sort((a, b) => {
      if (currentSort === 'empathy') return b.empathyCount - a.empathyCount;
      if (currentSort === 'comments') return b.commentCount - a.commentCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [initialProposals, currentCategory, currentRegion, currentSort, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Compact Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          backgroundColor: '#F5F5F7',
          padding: '20px 24px',
          borderRadius: '16px',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Category Pills */}
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
                  backgroundColor: isActive ? '#00A896' : '#FFFFFF',
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

        {/* Search, Region & Sort Filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="제목, 내용 검색..."
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

          <div style={{ width: '160px' }}>
            <select
              value={currentRegion}
              onChange={(e) => setCurrentRegion(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                borderRadius: '10px',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                backgroundColor: '#FFFFFF',
                fontSize: '0.875rem',
                color: '#1D1D1F',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {REGIONS.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>

          <div style={{ width: '140px' }}>
            <select
              value={currentSort}
              onChange={(e) => setCurrentSort(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                borderRadius: '10px',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                backgroundColor: '#FFFFFF',
                fontSize: '0.875rem',
                color: '#1D1D1F',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="latest">최신순</option>
              <option value="empathy">공감순</option>
              <option value="comments">의견많은순</option>
            </select>
          </div>
        </div>
      </div>

      {/* Count Result Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#6E6E73', fontSize: '0.9375rem' }}>
        <div>
          총 <strong style={{ color: '#00A896', fontWeight: 800 }}>{filteredListens.length}</strong>건의 군민 이야기가 있습니다.
        </div>
        <span style={{ fontSize: '0.8125rem', color: '#86868B' }}>※ 시연용 데이터입니다</span>
      </div>

      {/* Grid List */}
      {filteredListens.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredListens.map((item) => (
            <ListenCard key={item.id} item={item} />
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
            등록된 이야기가 없습니다.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6E6E73' }}>첫 번째 군민 이야기를 직접 작성해 보세요.</p>
        </div>
      )}
    </div>
  );
}
