import { getCurrentUser } from '@/lib/auth/get-current-user';
import { getUserVerificationStatus } from '@/lib/repositories/verification-repository';
import { getRegions } from '@/lib/repositories/region-repository';
import VerificationClient from './VerificationClient';
import Link from 'next/link';

export default async function VerificationPage() {
  const { user } = await getCurrentUser();

  if (!user) {
    return (
      <main className="content-area" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '440px', width: '100%', background: 'white', padding: '36px 28px', borderRadius: '16px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔐</div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
            로그인이 필요합니다
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
            군민인증 절차를 진행하시려면 먼저 카카오 간편 로그인을 진행해 주세요.
          </p>
          <Link href="/" className="btn btn-primary" style={{ display: 'block', padding: '12px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none' }}>
            메인 페이지로 이동
          </Link>
        </div>
      </main>
    );
  }

  const verificationStatus = await getUserVerificationStatus(user.userId);
  const regions = await getRegions();

  return (
    <main className="content-area" style={{ maxWidth: '720px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '16px 20px', borderRadius: '12px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1E40AF', margin: '0 0 6px 0' }}>
          💡 영광군의회 열린소통 ON 군민인증 안내 (시연용)
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#1E3A8A', margin: 0, lineHeight: 1.5 }}>
          영광군민 인증 완료 시 군민 참여 안건 투표, 제안 등록, 공감 및 댓글 작성 권한이 부여됩니다.<br />
          <span style={{ fontSize: '0.8125rem', opacity: 0.85 }}>※ 본 페이지는 실서비스 연동 전 의정 플랫폼 기능 및 워크플로우 시연 전용 화면입니다.</span>
        </p>
      </div>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '24px' }}>
        🪪 영광군민 인증 신청
      </h1>

      <VerificationClient
        user={user}
        initialStatus={verificationStatus}
        regions={regions}
      />
    </main>
  );
}
