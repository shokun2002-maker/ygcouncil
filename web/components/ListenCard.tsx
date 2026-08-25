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

  let statusBadgeClass = 'status-review';
  if (item.status === 'done' || item.statusText.includes('반영') || item.statusText.includes('완료')) {
    statusBadgeClass = 'status-done';
  } else if (item.status === 'visit' || item.statusText.includes('현장')) {
    statusBadgeClass = 'status-visit';
  }

  return (
    <>
      <article className="content-card">
        <div className="card-meta-top">
          <span className="card-category">{item.region} · {item.category}</span>
          <span className={`badge-status ${statusBadgeClass}`}>{item.statusText}</span>
        </div>
        <h3 className="card-title">{item.title}</h3>
        <p className="card-body-text">{item.summary}</p>
        <div className="card-footer">
          <span>♡ 공감 {item.empathyCount} · 💬 의견 {item.commentCount}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-share" onClick={() => setIsShareOpen(true)}>
              ↗ 공유
            </button>
            <Link
              href={`/listens/${item.id}`}
              className="btn-card-action"
              style={{ background: 'var(--teal-light)', color: 'var(--teal)' }}
            >
              자세히 보기
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
