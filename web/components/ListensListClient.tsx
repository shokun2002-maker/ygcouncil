'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="filter-pills" id="listen-category-pills" style={{ marginBottom: 0 }}>
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

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              className="search-input"
              placeholder="제목, 내용, 작성자 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ width: '160px' }}>
            <select
              className="search-input"
              style={{ cursor: 'pointer' }}
              value={currentRegion}
              onChange={(e) => setCurrentRegion(e.target.value)}
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
              className="search-input"
              style={{ cursor: 'pointer' }}
              value={currentSort}
              onChange={(e) => setCurrentSort(e.target.value)}
            >
              <option value="latest">최신순</option>
              <option value="empathy">공감순</option>
              <option value="comments">의견많은순</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--teal)', paddingBottom: '12px' }}>
        <div style={{ fontSize: '0.9375rem', color: 'var(--navy)', fontWeight: 700 }}>
          총 <strong style={{ color: 'var(--teal)' }}>{filteredListens.length}</strong>건의 군민 이야기가 있습니다.
        </div>
        <span className="demo-tag-pill">※ 본 제안은 시연용 예시 데이터입니다.</span>
      </div>

      {filteredListens.length > 0 ? (
        <div className="cards-grid">
          {filteredListens.map((item) => (
            <ListenCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-strong)' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>
            등록된 이야기가 없습니다.
          </p>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-sub)' }}>첫 번째 군민 이야기를 직접 작성해 보세요.</p>
        </div>
      )}
    </>
  );
}
