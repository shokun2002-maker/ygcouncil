import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicOutcomeById } from '@/lib/repositories/outcome-repository';

interface OutcomeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OutcomeDetailPage({ params }: OutcomeDetailPageProps) {
  const { id: outcomeId } = await params;
  const outcome = await getPublicOutcomeById(outcomeId);

  if (!outcome) {
    notFound();
  }

  const pipelineSteps = (outcome as any).steps || [
    { label: '시민 제안', status: outcome.sourceProposalId ? 'completed' : 'completed' },
    { label: '군민 의견수렴', status: outcome.sourceAskId ? 'completed' : 'current' },
    { label: '의회 검토·조치', status: 'completed' },
    { label: '변화 확정', status: 'completed' },
  ];

  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', padding: '48px 24px 80px 24px', color: '#1D1D1F' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        {/* Top Back Navigation */}
        <div style={{ marginBottom: '32px' }}>
          <Link
            href="/outcomes"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#6E6E73',
              fontSize: '0.9375rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            ← 전체 성과 목록으로 돌아가기
          </Link>
        </div>

        {/* Main Showcase Article */}
        <article style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* Header */}
          <header style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0066CC', backgroundColor: '#EBF5FF', padding: '4px 10px', borderRadius: '6px' }}>
                함께 바꿨습니다 · OUTCOME
              </span>
              <span style={{ fontSize: '0.8125rem', color: '#6E6E73', backgroundColor: '#F5F5F7', padding: '4px 10px', borderRadius: '6px' }}>
                {outcome.regionName} · {outcome.category}
              </span>
              <span className="badge-apple" style={{ backgroundColor: '#D1FAE5', color: '#059669' }}>
                {outcome.status === 'published' ? '추진완료' : '진행중'}
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 800,
                lineHeight: 1.25,
                letterSpacing: '-0.5px',
                color: '#1D1D1F',
              }}
            >
              {outcome.title}
            </h1>

            <p style={{ fontSize: '1.0625rem', color: '#6E6E73', lineHeight: 1.6 }}>
              {outcome.summary}
            </p>

            <div style={{ fontSize: '0.875rem', color: '#86868B', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              🏁 완료 및 성과 공개일: <strong style={{ color: '#1D1D1F' }}>{outcome.outcomeAt}</strong>
            </div>
          </header>

          {/* Major Result Statement Surface Card */}
          <section
            style={{
              backgroundColor: '#F0F6FF',
              border: '1px solid #93C5FD',
              borderRadius: '24px',
              padding: '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem' }}>🏛️</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0066CC' }}>
                무엇이 달라졌나요? (성과 및 조치 결과)
              </h2>
            </div>
            <div style={{ fontSize: '1.0625rem', color: '#1D1D1F', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
              {outcome.result}
            </div>
          </section>

          {/* 4-Step Journey Section */}
          <section
            style={{
              backgroundColor: '#F5F5F7',
              borderRadius: '24px',
              padding: '32px 28px',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1D1D1F', marginBottom: '20px' }}>
              🌱 변화가 이루어진 4단계의 여정
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
              {pipelineSteps.map((st: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '16px',
                    borderRadius: '14px',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0066CC' }}>
                    0{idx + 1} 단계
                  </span>
                  <strong style={{ fontSize: '0.9375rem', color: '#1D1D1F' }}>{st.label}</strong>
                  <span style={{ fontSize: '0.8125rem', color: st.status === 'completed' ? '#059669' : '#0066CC' }}>
                    {st.status === 'completed' ? '✓ 완료' : '● 진행중'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Origin Source Relations Box */}
          {(outcome.sourceProposalId || outcome.sourceAskId) && (
            <section
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '24px',
                padding: '32px 28px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1D1D1F' }}>
                🔗 이 변화의 출발점 (스토리 연결)
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#6E6E73', marginTop: '-12px' }}>
                군민 여러분의 참여와 의정 활동이 연결된 원본 기록을 확인하실 수 있습니다.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {outcome.sourceProposalId && (
                  <Link
                    href={`/listens/${outcome.sourceProposalId}`}
                    className="btn-apple"
                    style={{
                      flex: 1,
                      minWidth: '240px',
                      height: '48px',
                      backgroundColor: '#E6F7F5',
                      color: '#00A896',
                      fontWeight: 700,
                      justifyContent: 'center',
                    }}
                  >
                    💬 처음 제안 원본 보기 ➔
                  </Link>
                )}
                {outcome.sourceAskId && (
                  <Link
                    href={`/asks/${outcome.sourceAskId}`}
                    className="btn-apple"
                    style={{
                      flex: 1,
                      minWidth: '240px',
                      height: '48px',
                      backgroundColor: '#EBF5FF',
                      color: '#0066CC',
                      fontWeight: 700,
                      justifyContent: 'center',
                    }}
                  >
                    🙋‍♂️ 군민 의견수렴 원본 보기 ➔
                  </Link>
                )}
              </div>
            </section>
          )}

          {/* Call to Participation Banner */}
          <section
            style={{
              backgroundColor: '#F5F5F7',
              borderRadius: '24px',
              padding: '36px 32px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D1D1F' }}>
              다음 변화는 당신의 이야기에서 시작됩니다.
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#6E6E73', maxWidth: '520px' }}>
              생활 속 작은 불편부터 영광을 바꿀 정책 아이디어까지, 영광군의회에 자유롭게 들려주세요.
            </p>
            <Link href="/listens/write" className="btn-apple btn-apple-primary" style={{ backgroundColor: '#00A896', height: '44px', padding: '0 24px' }}>
              + 내 이야기 들려주기 ➔
            </Link>
          </section>
        </article>
      </div>
    </main>
  );
}
