import React from 'react';
import { getAsks } from '@/lib/repositories/ask-repository';
import AsksListClient from '@/components/AsksListClient';

export const revalidate = 0;

export default async function AsksListPage() {
  const asksData = await getAsks();

  return (
    <main className="content-area" style={{ gap: '32px', paddingTop: '36px' }}>
      {/* Subpage Banner Header */}
      <section className="subpage-banner ask-banner">
        <div className="subpage-banner-container">
          <div className="subpage-title-badge">
            <span>🗳️ 영광군의회 ➔ 군민</span>
            <span className="demo-tag-pill" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              시연용
            </span>
          </div>
          <h1 className="subpage-main-title">지금, 군민에게 묻습니다.</h1>
          <p className="subpage-main-desc">
            영광군의 주요 정책, 조례, 예산 및 지역 현안에 대해 군민 여러분의 의견을 청취합니다.
          </p>
        </div>
      </section>

      <AsksListClient initialAsks={asksData} />
    </main>
  );
}
