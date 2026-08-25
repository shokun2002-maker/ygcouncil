import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAsks } from '@/lib/repositories/ask-repository';
import { getProposals } from '@/lib/repositories/listen-repository';
import { getOutcomes } from '@/lib/repositories/outcome-repository';
import AskCard from '@/components/AskCard';
import ListenCard from '@/components/ListenCard';
import OutcomeCard from '@/components/OutcomeCard';

export const revalidate = 0;

export default async function HomePage() {
  const asksData = await getAsks();
  const listensData = await getProposals();
  const outcomesData = await getOutcomes();

  const asks = asksData.slice(0, 3);
  const listens = listensData.slice(0, 3);
  const outcomes = outcomesData.slice(0, 3);

  return (
    <main className="content-area">
      {/* Hero Section */}
      <section className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="live-dot">●</span>
            <span>군민과 영광군의회의 소통 창구</span>
          </div>

          <h1 className="hero-slogan">묻고, 듣고, 함께 바꿉니다.</h1>

          <div className="hero-pillars">
            <div className="pillar-item pillar-ask">
              <span className="pillar-tag">영광군의회 ➔ 군민</span>
              <h2 className="pillar-title">묻습니다.</h2>
              <p className="pillar-desc">
                주요 정책, 조례, 예산 및 지역 현안에 대해 영광군의회가 군민의 의견을 직접 묻습니다.
              </p>
            </div>

            <div className="pillar-item pillar-listen">
              <span className="pillar-tag">군민 ➔ 영광군의회</span>
              <h2 className="pillar-title">듣습니다.</h2>
              <p className="pillar-desc">
                생활 속 불편사항, 정책 아이디어, 지역 개선 건의를 영광군의회에 직접 제안해 주세요.
              </p>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="building-image-container">
            <Image
              src="/council-building.jpg"
              alt="영광군의회 청사 전경"
              width={600}
              height={400}
              priority
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
          </div>
        </div>
      </section>

      {/* Auxiliary Stream / Map Buttons */}
      <section style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Link
          href="/asks"
          className="section-btn-action"
          style={{ background: 'var(--red)', color: 'white', flex: '1', justifyContent: 'center', minHeight: '48px' }}
        >
          🔴 의정 생중계 시청하기
        </Link>
        <Link
          href="/listens"
          className="section-btn-action"
          style={{ background: 'var(--teal)', color: 'white', flex: '1', justifyContent: 'center', minHeight: '48px' }}
        >
          🗺️ 11개 읍·면 소통지도 보기
        </Link>
      </section>

      {/* 묻습니다 Section */}
      <section className="ask-section" id="ask">
        <div className="section-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="section-tag ask-tag">묻습니다</span>
              <span className="demo-tag-pill">시연용 의견수렴 안건</span>
            </div>
            <h2 className="section-title">지금, 군민에게 묻습니다</h2>
          </div>
          <Link href="/asks" className="section-btn-action" style={{ background: 'var(--navy)' }}>
            전체 의견수렴 보기 →
          </Link>
        </div>

        <div className="cards-grid">
          {asks.map((item) => (
            <AskCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 듣습니다 Section */}
      <section className="listen-section" id="listen">
        <div className="section-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="section-tag listen-tag">듣습니다</span>
              <span className="demo-tag-pill">시연용 군민 제안</span>
            </div>
            <h2 className="section-title">군민의 이야기를 듣습니다</h2>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/listens/write" className="section-btn-action" style={{ background: 'var(--teal)' }}>
              + 이야기 남기기
            </Link>
            <Link href="/listens" className="section-btn-action" style={{ background: 'var(--navy)' }}>
              전체 이야기 보기 →
            </Link>
          </div>
        </div>

        <div className="cards-grid">
          {listens.map((item) => (
            <ListenCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 함께 바꿨습니다 Section */}
      <section className="changed-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="section-tag changed-tag">함께 바꿨습니다</span>
              <span className="demo-tag-pill">시연용 성과 예시</span>
            </div>
            <h2 className="section-title" style={{ marginTop: '4px' }}>
              군민의 목소리가 영광의 변화로 이어지고 있습니다
            </h2>
          </div>
          <Link href="/outcomes" className="section-btn-action" style={{ background: 'var(--navy)' }}>
            전체 성과 보기 →
          </Link>
        </div>

        <div className="cards-grid">
          {outcomes.map((item) => (
            <OutcomeCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
