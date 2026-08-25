import React from 'react';
import { getOutcomes } from '@/lib/repositories/outcome-repository';
import OutcomesListClient from '@/components/OutcomesListClient';

export const revalidate = 0;

export default async function OutcomesListPage() {
  const outcomesData = await getOutcomes();

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span
                  style={{
                    backgroundColor: '#EBF5FF',
                    color: '#0066CC',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '6px',
                  }}
                >
                  성과 Showcase · OUTCOME
                </span>
                <span style={{ fontSize: '0.8125rem', color: '#86868B' }}>
                  ※ 시연용 성과 사례 목록
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
                군민의 참여가<br />영광의 변화를 만들었습니다.
              </h1>

              <p style={{ fontSize: '1.0625rem', color: '#6E6E73', lineHeight: 1.6, maxWidth: '640px' }}>
                군민 여러분의 생활 제안과 의견수렴이 영광군의회의 어떤 조례·예산·정책 변화로 결실을 맺었는지 성과 스토리로 확인해 보세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: '0 24px' }}>
        <OutcomesListClient initialOutcomes={outcomesData} />
      </div>
    </main>
  );
}
