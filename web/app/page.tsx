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
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', color: '#1D1D1F' }}>
      {/* 1. Large Hero Section */}
      <section
        style={{
          maxWidth: 'var(--container-wide)',
          margin: '0 auto',
          padding: '80px 24px 64px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                backgroundColor: '#F0F6FF',
                color: '#0066CC',
                fontSize: '0.8125rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '6px',
              }}
            >
              영광군의회 열린소통 ON
            </span>
            <span style={{ fontSize: '0.8125rem', color: '#86868B' }}>
              ※ 시연용 예시 데이터 적용 중
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.18,
              letterSpacing: '-1px',
              color: '#1D1D1F',
            }}
          >
            군민의 목소리가<br />
            <span style={{ color: '#0066CC' }}>의회의 변화</span>가 됩니다.
          </h1>

          <p
            style={{
              fontSize: '1.125rem',
              color: '#6E6E73',
              lineHeight: 1.6,
              maxWidth: '540px',
              fontWeight: 400,
            }}
          >
            묻고, 듣고, 함께 바꿉니다. 영광군민의 자유로운 제안과 투표 참여가 실제 의정활동과 영광의 성과로 이어지는 열린 참여 플랫폼입니다.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '12px' }}>
            <Link href="/listens/write" className="btn-apple btn-apple-primary">
              내 이야기 들려주기 ➔
            </Link>
            <Link href="/asks" className="btn-apple btn-apple-secondary">
              지금 의견수렴 참여하기
            </Link>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div style={{ position: 'relative', width: '100%', borderRadius: '28px', overflow: 'hidden', border: '1px solid rgba(0, 0, 0, 0.08)', boxShadow: '0 12px 36px rgba(0,0,0,0.06)' }}>
          <Image
            src="/council-building.jpg"
            alt="영광군의회 청사 전경"
            width={640}
            height={420}
            priority
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* 2. Service Flow Section (3단계 선순환) */}
      <section
        style={{
          backgroundColor: '#F5F5F7',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0066CC', textTransform: 'uppercase', letterSpacing: '1px' }}>
              참여 선순환 과정
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1D1D1F', marginTop: '6px' }}>
              이렇게 함께 바꿉니다
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Step 1 */}
            <div className="card-apple" style={{ background: '#FFFFFF', padding: '32px 28px' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0066CC', lineHeight: 1, marginBottom: '16px' }}>
                01
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D1D1F', marginBottom: '8px' }}>
                듣습니다
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#6E6E73', lineHeight: 1.6 }}>
                군민이 생활 속 불편사항, 정책 아이디어, 지역 현안을 자유롭게 제안하고 공감을 나눕니다.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card-apple" style={{ background: '#FFFFFF', padding: '32px 28px' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0066CC', lineHeight: 1, marginBottom: '16px' }}>
                02
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D1D1F', marginBottom: '8px' }}>
                묻습니다
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#6E6E73', lineHeight: 1.6 }}>
                의회가 주요 조례, 예산, 군정 의제에 대해 군민에게 직접 의견을 수렴하고 투표를 집계합니다.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card-apple" style={{ background: '#FFFFFF', padding: '32px 28px' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#00A896', lineHeight: 1, marginBottom: '16px' }}>
                03
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D1D1F', marginBottom: '8px' }}>
                함께 바꿨습니다
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#6E6E73', lineHeight: 1.6 }}>
                군민의 참여가 조례 제정, 현장 개선, 예산 반영 및 실제 의정 성과로 완성됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 「묻습니다」 Section */}
      <section style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '36px' }}>
          <div>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0066CC', textTransform: 'uppercase', letterSpacing: '1px' }}>
              의견수렴 · 묻습니다
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1D1D1F', marginTop: '4px' }}>
              지금, 군민의 의견을 기다립니다
            </h2>
          </div>
          <Link href="/asks" style={{ color: '#0066CC', fontWeight: 700, textDecoration: 'none', fontSize: '0.9375rem' }}>
            전체 의견수렴 보기 ➔
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {asks.map((item) => (
            <AskCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 4. 「듣습니다」 Section */}
      <section style={{ backgroundColor: '#F5F5F7', borderTop: '1px solid rgba(0, 0, 0, 0.06)', borderBottom: '1px solid rgba(0, 0, 0, 0.06)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '36px' }}>
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0066CC', textTransform: 'uppercase', letterSpacing: '1px' }}>
                군민 제안 · 듣습니다
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1D1D1F', marginTop: '4px' }}>
                영광의 일상에서 시작된 이야기
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link href="/listens/write" className="btn-apple btn-apple-primary" style={{ height: '40px', padding: '0 16px', fontSize: '0.875rem' }}>
                + 내 이야기 들려주기
              </Link>
              <Link href="/listens" style={{ color: '#0066CC', fontWeight: 700, textDecoration: 'none', fontSize: '0.9375rem' }}>
                전체 제안 보기 ➔
              </Link>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {listens.map((item) => (
              <ListenCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. 「함께 바꿨습니다」 Showcase Section */}
      <section style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '36px' }}>
          <div>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#00A896', textTransform: 'uppercase', letterSpacing: '1px' }}>
              의정 성과 · 함께 바꿨습니다
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1D1D1F', marginTop: '4px' }}>
              참여는 실제 변화가 됩니다
            </h2>
          </div>
          <Link href="/outcomes" style={{ color: '#0066CC', fontWeight: 700, textDecoration: 'none', fontSize: '0.9375rem' }}>
            전체 성과 보기 ➔
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {outcomes.map((item) => (
            <OutcomeCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 6. Utility Section (의정 생중계 / 11개 읍·면 소통지도) */}
      <section style={{ backgroundColor: '#F5F5F7', borderTop: '1px solid rgba(0, 0, 0, 0.06)', padding: '64px 24px' }}>
        <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="card-apple" style={{ background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#DC2626' }}>LIVE BROADCAST</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D1D1F' }}>의정 생중계 시청하기</h3>
            <p style={{ fontSize: '0.9375rem', color: '#6E6E73', flex: 1 }}>
              영광군의회의 본회의 및 상임위원회 회의 진행 상황을 실시간 생중계로 확인하세요.
            </p>
            <Link href="/asks" className="btn-apple btn-apple-secondary" style={{ alignSelf: 'flex-start' }}>
              생중계 바로가기 ➔
            </Link>
          </div>

          <div className="card-apple" style={{ background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#00A896' }}>COMMUNITY MAP</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D1D1F' }}>11개 읍·면 소통지도</h3>
            <p style={{ fontSize: '0.9375rem', color: '#6E6E73', flex: 1 }}>
              영광읍, 백수읍, 홍농읍 등 우리 동네 지역별 제안과 성과 현황을 지도에서 찾아보세요.
            </p>
            <Link href="/listens" className="btn-apple btn-apple-secondary" style={{ alignSelf: 'flex-start' }}>
              소통지도 보기 ➔
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
