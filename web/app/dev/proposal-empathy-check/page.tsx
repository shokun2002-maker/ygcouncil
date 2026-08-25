import { getCurrentUser } from '@/lib/auth/get-current-user';
import { getProposalEmpathyStatus } from '@/lib/repositories/proposal-empathy-repository';

export default async function DevProposalEmpathyCheckPage() {
  const { user } = await getCurrentUser();
  const testProposalId = '20000000-0000-0000-0000-000000000001';
  const empathyState = await getProposalEmpathyStatus(testProposalId);

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#FEF3C7', padding: '12px 16px', borderRadius: '6px', marginBottom: '24px', fontSize: '0.875rem', color: '#92400E' }}>
        ⚠️ <strong>개발자 전용 「듣습니다」 제안 공감 파이프라인 검증 페이지</strong>
      </div>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
        ❤️ Proposal Empathy Pipeline Check
      </h1>

      <div style={{ display: 'grid', gap: '16px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <strong>Authenticated User:</strong> {user?.displayName || 'Anonymous'} <br />
          <strong>Tenant Membership Role:</strong> {user?.role || 'none'} <br />
          <strong>Is Verified Resident:</strong>{' '}
          <span style={{ color: user?.isVerifiedResident ? '#059669' : '#DC2626', fontWeight: 700 }}>
            {user?.isVerifiedResident ? '✅ TRUE (공감/취소 가능)' : '❌ FALSE (공감 권한 없음)'}
          </span>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
            Target Test Proposal (`20000000-0000-0000-0000-000000000001`)
          </h2>
          <div><strong>Already Empathized by User:</strong> {empathyState.empathized ? '❤️ YES' : '🤍 NO'}</div>
          <div><strong>DB Total Empathy Count:</strong> {empathyState.empathyCount}개</div>
        </div>
      </div>
    </main>
  );
}
