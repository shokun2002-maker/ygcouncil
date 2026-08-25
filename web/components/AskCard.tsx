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
      <article className="content-card">
        <div className="card-meta-top">
          <span className="card-category">{item.category}</span>
          <span className="badge-status status-active">{item.statusText}</span>
        </div>
        <h3 className="card-title">{item.title}</h3>
        <p className="card-body-text">{item.summary}</p>
        <div className="card-footer">
          <span>👥 참여 {item.participantCount}명 · ~{item.endDate}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-share" onClick={() => setIsShareOpen(true)}>
              ↗ 공유
            </button>
            <Link href={`/asks/${item.id}`} className="btn-card-action">
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
