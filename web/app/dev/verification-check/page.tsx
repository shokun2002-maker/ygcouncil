import { getCurrentUser } from '@/lib/auth/get-current-user';
import { getUserVerificationStatus } from '@/lib/repositories/verification-repository';

export default async function DevVerificationCheckPage() {
  const { user } = await getCurrentUser();
  const status = await getUserVerificationStatus(user?.userId);

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#FEF3C7', padding: '12px 16px', borderRadius: '6px', marginBottom: '24px', fontSize: '0.875rem', color: '#92400E' }}>
        ⚠️ <strong>개발자 전용 군민인증 상태 검증 페이지</strong> (본 페이지는 테스트용이며 주민번호, CI, DI, Secret을 표출하지 않습니다.)
      </div>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
        🔍 Resident Verification Status Check
      </h1>

      <div style={{ display: 'grid', gap: '16px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <strong>User ID:</strong> {user?.userId || 'Anonymous'} <br />
          <strong>Display Name:</strong> {user?.displayName || 'N/A'} <br />
          <strong>Tenant Membership Role:</strong> <span style={{ color: '#2563EB', fontWeight: 700 }}>{user?.role || 'none'}</span>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>Identity Status</div>
            <strong style={{ color: status?.identityStatus === 'verified' ? '#059669' : '#D97706' }}>
              {status?.identityStatus?.toUpperCase() || 'NONE'}
            </strong>
          </div>
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>Residence Status</div>
            <strong style={{ color: status?.residenceStatus === 'verified' ? '#059669' : '#D97706' }}>
              {status?.residenceStatus?.toUpperCase() || 'NONE'}
            </strong>
          </div>
          <div style={{ background: status?.isVerifiedResident ? '#ECFDF5' : '#F8FAFC', padding: '12px', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.8125rem', color: status?.isVerifiedResident ? '#065F46' : '#64748B' }}>Verified Resident Result</div>
            <strong style={{ color: status?.isVerifiedResident ? '#059669' : '#DC2626' }}>
              {status?.isVerifiedResident ? '✅ TRUE' : '❌ FALSE'}
            </strong>
          </div>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <strong>Region Name:</strong> {status?.regionName || 'N/A'} <br />
          <strong>Identity Verified At:</strong> {status?.identityVerifiedAt || 'N/A'} <br />
          <strong>Residence Verified At:</strong> {status?.residenceVerifiedAt || 'N/A'} <br />
          <strong>Expires At (1 Year):</strong> {status?.expiresAt || 'N/A'}
        </div>
      </div>
    </main>
  );
}
