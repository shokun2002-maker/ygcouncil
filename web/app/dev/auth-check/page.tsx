import { getCurrentUser } from '@/lib/auth/get-current-user';

export default async function AuthCheckPage() {
  const { user, rawUser, authState } = await getCurrentUser();

  const hasSession = !!rawUser;
  const hasUser = !!user;
  const hasProfile = !!user?.displayName;
  const role = user?.role || 'none';
  const isIdentityVerified = user?.isIdentityVerified ?? false;
  const isResidenceVerified = user?.isResidenceVerified ?? false;
  const isVerifiedResident = user?.isVerifiedResident ?? false;

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#FEF3C7', padding: '12px 16px', borderRadius: '6px', marginBottom: '24px', fontSize: '0.875rem', color: '#92400E' }}>
        ⚠️ <strong>개발자 전용 인증 상태 검증 페이지</strong> (본 페이지는 테스트용이며 Token, Secret, Key를 표출하지 않습니다.)
      </div>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
        🔐 Supabase Auth & Session 상태 검증 (Auth Check)
      </h1>

      <div style={{ display: 'grid', gap: '16px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <strong>Overall Auth State:</strong>{' '}
          <span style={{ color: hasSession ? '#059669' : '#D97706', fontWeight: 700 }}>
            {authState.toUpperCase()}
          </span>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <div>
            <strong>Session Status:</strong>{' '}
            <span style={{ color: hasSession ? '#059669' : '#64748B', fontWeight: 700 }}>
              {hasSession ? '✅ Session Active' : '⚪ Anonymous (No Session)'}
            </span>
          </div>
          <div>
            <strong>Current User Object:</strong>{' '}
            <span style={{ color: hasUser ? '#059669' : '#64748B', fontWeight: 700 }}>
              {hasUser ? '✅ Present' : '⚪ Null'}
            </span>
          </div>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: '#334155' }}>👤 User Profile & Membership Details</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '8px', fontSize: '0.9375rem' }}>
            <li><strong>Profile Exists:</strong> {hasProfile ? '✅ Yes' : '⚪ No'}</li>
            <li><strong>Display Name:</strong> {user?.displayName || 'N/A'}</li>
            <li><strong>Tenant Membership Role:</strong> <span style={{ color: '#2563EB', fontWeight: 700 }}>{role}</span></li>
          </ul>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: '#334155' }}>🪪 Identity & Residence Verification Status</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '4px' }}>Identity Verification</div>
              <strong>{isIdentityVerified ? '✅ VERIFIED' : '⚪ PENDING'}</strong>
            </div>
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '4px' }}>Residence Verification</div>
              <strong>{isResidenceVerified ? '✅ VERIFIED' : '⚪ PENDING'}</strong>
            </div>
            <div style={{ background: isVerifiedResident ? '#ECFDF5' : '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.8125rem', color: isVerifiedResident ? '#065F46' : '#64748B', marginBottom: '4px' }}>Final Verified Resident</div>
              <strong style={{ color: isVerifiedResident ? '#059669' : '#64748B' }}>
                {isVerifiedResident ? '✅ VERIFIED RESIDENT' : '⚪ NOT VERIFIED'}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
