import React from 'react';
import Link from 'next/link';
import { getProposals } from '@/lib/repositories/listen-repository';
import ListensListClient from '@/components/ListensListClient';

export const revalidate = 0;

export default async function ListensListPage() {
  const proposalData = await getProposals();

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
                    backgroundColor: '#E6F7F5',
                    color: '#00A896',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '6px',
                  }}
                >
                  군민 제안 · LISTEN
                </span>
                <span style={{ fontSize: '0.8125rem', color: '#86868B' }}>
                  ※ 시연용 군민 제안 목록
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
                영광의 일상에서 시작된<br />군민의 이야기를 듣습니다.
              </h1>

              <p style={{ fontSize: '1.0625rem', color: '#6E6E73', lineHeight: 1.6, maxWidth: '640px' }}>
                생활 속 불편사항부터 정책 아이디어까지, 영광군민의 자유로운 목소리를 의회가 귀기울여 듣고 함께 답을 찾습니다.
              </p>
            </div>

            <Link href="/listens/write" className="btn-apple btn-apple-primary" style={{ backgroundColor: '#00A896' }}>
              + 내 이야기 들려주기
            </Link>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: '0 24px' }}>
        <ListensListClient initialProposals={proposalData} />
      </div>
    </main>
  );
}
