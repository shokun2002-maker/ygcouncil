import React from 'react';
import Link from 'next/link';
import { getProposals } from '@/lib/repositories/listen-repository';
import ListensListClient from '@/components/ListensListClient';

export const revalidate = 0;

export default async function ListensListPage() {
  const proposalData = await getProposals();

  return (
    <main className="content-area" style={{ gap: '32px', paddingTop: '36px' }}>
      {/* Subpage Banner Header */}
      <section className="subpage-banner listen-banner">
        <div className="subpage-banner-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="subpage-title-badge">
                <span>💬 군민 ➔ 영광군의회</span>
                <span className="demo-tag-pill" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  시연용
                </span>
              </div>
              <h1 className="subpage-main-title">군민의 이야기를 듣습니다.</h1>
              <p className="subpage-main-desc">
                생활 속 불편사항, 정책 아이디어, 지역 발전을 위한 제안을 영광군의회에 자유롭게 들려주세요.
              </p>
            </div>
            <Link href="/listens/write" className="section-btn-action" style={{ background: 'var(--teal)', minHeight: '52px' }}>
              + 내 이야기 들려주기
            </Link>
          </div>
        </div>
      </section>

      <ListensListClient initialProposals={proposalData} />
    </main>
  );
}
