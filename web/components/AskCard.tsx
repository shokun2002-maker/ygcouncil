'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Ask } from '../lib/types';
import Modal from './Modal';

interface AskCardProps {
  item: Ask;
}

export default function AskCard({ item }: AskCardProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <>
      <article className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0066CC', backgroundColor: '#F0F6FF', padding: '4px 10px', borderRadius: '6px' }}>
            {item.category}
          </span>
          <span className="badge-apple" style={{ backgroundColor: '#D1FAE5', color: '#059669' }}>
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
            참여 {item.participantCount}명 · ~{item.endDate}
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
              href={`/asks/${item.id}`}
              className="btn-apple btn-apple-primary"
              style={{ height: '36px', padding: '0 16px', fontSize: '0.8125rem' }}
            >
              의견 참여하기
            </Link>
          </div>
        </div>
      </article>

      <Modal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="공유하기"
        desc={`「${item.title}」 안건을 주변 군민들과 공유해 보세요.`}
        showShareActions={true}
      />
    </>
  );
}
