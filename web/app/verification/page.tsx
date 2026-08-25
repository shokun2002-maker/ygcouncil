import { getCurrentUser } from '@/lib/auth/get-current-user';
import { getUserVerificationStatus } from '@/lib/repositories/verification-repository';
import { getRegions } from '@/lib/repositories/region-repository';
import VerificationClient from './VerificationClient';
import Link from 'next/link';

export default async function VerificationPage() {
  const { user } = await getCurrentUser();

  if (!user) {
    return (
      <main style={{ backgroundColor: '#FFFFFF', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#FFFFFF', padding: '40px 32px', borderRadius: '24px', border: '1px solid rgba(0, 0, 0, 0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#FFFBEB', color: '#D97706', fontSize: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            🔒
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D1D1F', marginBottom: '12px' }}>
            로그인이 필요합니다
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#6E6E73', lineHeight: 1.6, marginBottom: '24px' }}>
            군민인증 절차를 진행하시려면 먼저 카카오 간편 로그인을 진행해 주세요.
          </p>
          <Link href="/" className="btn-apple btn-apple-primary" style={{ backgroundColor: '#0066CC', width: '100%', height: '44px' }}>
            메인 페이지로 이동
          </Link>
        </div>
      </main>
    );
  }

  const verificationStatus = await getUserVerificationStatus(user.userId);
  const regions = await getRegions();

  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingBottom: '80px', color: '#1D1D1F' }}>
      {/* Banner Header */}
      <section
        style={{
          backgroundColor: '#F5F5F7',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          padding: '64px 24px 48px 24px',
          marginBottom: '48px',
        }}
      >
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
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
              군민인증 · VERIFICATION
            </span>
            <span style={{ fontSize: '0.8125rem', color: '#86868B' }}>
              ※ 시연용 군민인증
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
            영광군민 인증 후<br />의견을 직접 남길 수 있습니다.
          </h1>

          <p style={{ fontSize: '1.0625rem', color: '#6E6E73', lineHeight: 1.6, maxWidth: '640px' }}>
            안건 투표, 시민 제안 작성, 공감 및 댓글 참여를 위해 간단한 영광군민 인증 절차를 진행해 주세요.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '0 24px' }}>
        <VerificationClient
          user={user}
          initialStatus={verificationStatus}
          regions={regions}
        />
      </div>
    </main>
  );
}
