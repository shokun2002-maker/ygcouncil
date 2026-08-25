import React from 'react';
import { getOutcomes } from '@/lib/repositories/outcome-repository';
import OutcomesListClient from '@/components/OutcomesListClient';

export const revalidate = 0;

export default async function OutcomesListPage() {
  const outcomesData = await getOutcomes();

  return (
    <main className="content-area" style={{ gap: '32px', paddingTop: '36px' }}>
      {/* Subpage Banner Header */}
      <section className="subpage-banner outcome-banner">
        <div className="subpage-banner-container">
          <div className="subpage-title-badge">
            <span>🤝 묻고, 듣고, 함께 바꿉니다</span>
            <span className="demo-tag-pill" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              시연용
            </span>
          </div>
          <h1 className="subpage-main-title">함께 바꿨습니다.</h1>
          <p className="subpage-main-desc">
            군민의 목소리가 어떻게 의정활동과 영광의 변화로 이어졌는지 확인해 보세요.
          </p>
        </div>
      </section>

      <OutcomesListClient initialOutcomes={outcomesData} />
    </main>
  );
}
