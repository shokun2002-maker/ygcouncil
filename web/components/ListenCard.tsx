'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Proposal } from '../lib/types';
import Modal from './Modal';

interface ListenCardProps {
  item: Proposal;
}

export default function ListenCard({ item }: ListenCardProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  let statusBg = '#FEF3C7';
  let statusColor = '#D97706';
  if (item.status === 'done' || item.statusText.includes('반영') || item.statusText.includes('완료')) {
    statusBg = '#D1FAE5';
    statusColor = '#059669';
  } else if (item.status === 'visit' || item.statusText.includes('현장')) {
    statusBg = '#E0F2FE';
    statusColor = '#0284C7';
  }

  return (
    <>
      <article className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#00A896', backgroundColor: '#E6F7F5', padding: '4px 10px', borderRadius: '6px' }}>
            {item.region} · {item.category}
          </span>
          <span className="badge-apple" style={{ backgroundColor: statusBg, color: statusColor }}>
            {item.statusText}
          </span>
        </div>

        <h3 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#1D1D1F', lineHeight: 1.35, letterSpacing: '-0.3px' }}>
          {item.title}
        </h3>

        <p style={{ fontSize: '0.9375rem', color: '#6E6E73', lineHeight: 1.6, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.summary}
        </p>

        <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(0, 0, 0, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '0.8125rem', color: '#86868B', fontWeight: 500 }}>
            공감 {item.empathyCount}명 · 의견 {item.commentCount}개
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn-apple btn-apple-secondary"
              onClick={() => setIsShareOpen(true)}
              style={{ height: '36px', padding: '0 12px', fontSize: '0.8125rem' }}
            >
              공유
            </button>
            <Link
              href={`/listens/${item.id}`}
              className="btn-apple"
              style={{ height: '36px', padding: '0 16px', fontSize: '0.8125rem', backgroundColor: '#E6F7F5', color: '#00A896', fontWeight: 700 }}
            >
              이야기 보기
            </Link>
          </div>
        </div>
      </article>

      <Modal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="공유하기"
        desc={`「${item.title}」 제안을 주변 군민들과 공유해 보세요.`}
        showShareActions={true}
      />
    </>
  );
}
