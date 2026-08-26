import React from 'react';
import Link from 'next/link';
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
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', color: '#1D1D1F' }}>
      {/* 1. Typography-First Hero Section */}
      <section className="hero-section">
        <div className="hero-inner">
          {/* Tier 1: Eyebrow / Intro */}
          <div className="hero-intro">
            <span
              style={{
                backgroundColor: '#F0F6FF',
                color: '#0066CC',
                fontSize: '0.875rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              영광군의회 열린소통 ON
            </span>
            <span style={{ fontSize: '1rem', color: '#6E6E73', fontWeight: 500, whiteSpace: 'nowrap' }}>
              여러분의 목소리가 영광의 내일을 바꿉니다
            </span>
          </div>

          {/* Tier 2: Super Large Typography Text CTA Links (Guaranteed 1 Line, No Arrows) */}
          <div className="hero-action-grid">
            <Link
              href="/asks"
              className="hero-action-link ask-cta"
              style={{ '--cta-accent-color': '#0066CC' } as React.CSSProperties}
            >
              묻습니다!
            </Link>

            <Link
              href="/listens"
              className="hero-action-link listen-cta"
              style={{ '--cta-accent-color': '#00A896' } as React.CSSProperties}
            >
              듣습니다!
            </Link>
          </div>

          {/* Tier 3: Hero Description (Max Width 760px) */}
          <p className="hero-description">
            묻고, 듣고, 함께 바꿉니다.<br />
            영광군민의 자유로운 제안과 참여가 실제 의정활동과 영광의 성과로 이어지는 열린 참여 플랫폼입니다.
          </p>
        </div>
      </section>

      {/* 2. Service Flow Section (Typography-Only, Unboxed 4-Step Process) */}
      <section
        style={{
          backgroundColor: '#F5F5F7',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          padding: '88px 24px',
        }}
      >
        <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto' }}>
          <div style={{ marginBottom: '56px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0066CC', textTransform: 'uppercase', letterSpacing: '1px' }}>
              참여 선순환 과정
            </span>
            <h2 style={{ fontSize: 'clamp(1.875rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#1D1D1F', marginTop: '6px', letterSpacing: '-0.03em' }}>
              이렇게 함께 바꿉니다
            </h2>
          </div>

          <div className="flow-grid">
            {/* Step 01 */}
            <div className="flow-step">
              <div className="flow-step-num">01</div>
              <h3 className="flow-step-title">제안합니다</h3>
              <p className="flow-step-desc">
                생활 속 불편과 정책 아이디어를 자유롭게 들려주세요.
              </p>
            </div>

            {/* Step 02 */}
            <div className="flow-step">
              <div className="flow-step-num">02</div>
              <h3 className="flow-step-title">함께 이야기합니다</h3>
              <p className="flow-step-desc">
                군민의 다양한 의견과 공감을 하나의 목소리로 모읍니다.
              </p>
            </div>

            {/* Step 03 */}
            <div className="flow-step">
              <div className="flow-step-num">03</div>
              <h3 className="flow-step-title">의회가 검토합니다</h3>
              <p className="flow-step-desc">
                의정활동과 정책에 반영해 실질적인 변화를 만듭니다.
              </p>
            </div>

            {/* Step 04 */}
            <div className="flow-step">
              <div className="flow-step-num">04</div>
              <h3 className="flow-step-title">결과를 공개합니다</h3>
              <p className="flow-step-desc">
                어떻게 달라졌는지 투명하게 보여드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 「묻습니다」 Section */}
      <section style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: '88px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
          <div>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0066CC', textTransform: 'uppercase', letterSpacing: '1px' }}>
              의견수렴 · 묻습니다
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#1D1D1F', marginTop: '4px', letterSpacing: '-0.03em' }}>
              지금, 군민의 의견을 기다립니다
            </h2>
          </div>
          <Link href="/asks" style={{ color: '#0066CC', fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}>
            전체 의견수렴 보기
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
          {asks.map((item) => (
            <AskCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 4. 「듣습니다」 Section */}
      <section style={{ backgroundColor: '#F5F5F7', borderTop: '1px solid rgba(0, 0, 0, 0.06)', borderBottom: '1px solid rgba(0, 0, 0, 0.06)', padding: '88px 24px' }}>
        <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0066CC', textTransform: 'uppercase', letterSpacing: '1px' }}>
                군민 제안 · 듣습니다
              </span>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#1D1D1F', marginTop: '4px', letterSpacing: '-0.03em' }}>
                영광의 일상에서 시작된 이야기
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Link href="/listens/write" className="btn-apple btn-apple-primary" style={{ height: '44px', padding: '0 20px', fontSize: '0.9375rem' }}>
                + 내 이야기 들려주기
              </Link>
              <Link href="/listens" style={{ color: '#0066CC', fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}>
                전체 제안 보기
              </Link>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            {listens.map((item) => (
              <ListenCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. 「함께 바꿨습니다」 Showcase Section */}
      <section style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: '88px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
          <div>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#00A896', textTransform: 'uppercase', letterSpacing: '1px' }}>
              의정 성과 · 함께 바꿨습니다
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#1D1D1F', marginTop: '4px', letterSpacing: '-0.03em' }}>
              참여는 실제 변화가 됩니다
            </h2>
          </div>
          <Link href="/outcomes" style={{ color: '#0066CC', fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}>
            전체 성과 보기
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
          {outcomes.map((item) => (
            <OutcomeCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 6. Utility Section (의정 생중계 / 11개 읍·면 소통지도) */}
      <section style={{ backgroundColor: '#F5F5F7', borderTop: '1px solid rgba(0, 0, 0, 0.06)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
          <div style={{ background: '#FFFFFF', padding: '36px 32px', borderRadius: '20px', border: '1px solid rgba(0, 0, 0, 0.06)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#DC2626', letterSpacing: '0.5px' }}>LIVE BROADCAST</span>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#1D1D1F' }}>의정 생중계 시청하기</h3>
            <p style={{ fontSize: '1rem', color: '#6E6E73', flex: 1, lineHeight: 1.6 }}>
              영광군의회의 본회의 및 상임위원회 회의 진행 상황을 실시간 생중계로 확인하세요.
            </p>
            <Link href="/asks" className="btn-apple btn-apple-secondary" style={{ alignSelf: 'flex-start' }}>
              생중계 바로가기
            </Link>
          </div>

          <div style={{ background: '#FFFFFF', padding: '36px 32px', borderRadius: '20px', border: '1px solid rgba(0, 0, 0, 0.06)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#00A896', letterSpacing: '0.5px' }}>COMMUNITY MAP</span>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#1D1D1F' }}>11개 읍·면 소통지도</h3>
            <p style={{ fontSize: '1rem', color: '#6E6E73', flex: 1, lineHeight: 1.6 }}>
              영광읍, 백수읍, 홍농읍 등 우리 동네 지역별 제안과 성과 현황을 지도에서 찾아보세요.
            </p>
            <Link href="/listens" className="btn-apple btn-apple-secondary" style={{ alignSelf: 'flex-start' }}>
              소통지도 보기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
