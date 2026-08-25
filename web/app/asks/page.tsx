import React from 'react';
import { getAsks } from '@/lib/repositories/ask-repository';
import AsksListClient from '@/components/AsksListClient';

export const revalidate = 0;

export default async function AsksListPage() {
  const asksData = await getAsks();

  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingBottom: '80px', color: '#1D1D1F' }}>
      {/* Apple-style Subpage Banner Header */}
      <section
        style={{
          backgroundColor: '#F5F5F7',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          padding: '64px 24px 48px 24px',
          marginBottom: '48px',
        }}
      >
        <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
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
              의견수렴 · ASK
            </span>
            <span style={{ fontSize: '0.8125rem', color: '#86868B' }}>
              ※ 시연용 안건 목록
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
              color: '#1D1D1F',
              marginBottom: '12px',
            }}
          >
            영광의 중요한 일,<br />군민께 직접 묻습니다.
          </h1>

          <p style={{ fontSize: '1.0625rem', color: '#6E6E73', lineHeight: 1.6, maxWidth: '640px' }}>
            영광군의회의 주요 정책, 조례, 예산 및 지역 현안에 대해 군민 여러분의 솔직한 의견과 선택을 들려주세요.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: '0 24px' }}>
        <AsksListClient initialAsks={asksData} />
      </div>
    </main>
  );
}
