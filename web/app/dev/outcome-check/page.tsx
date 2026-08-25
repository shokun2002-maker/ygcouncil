import { getCurrentUser } from '@/lib/auth/get-current-user';
import { getPublicOutcomes } from '@/lib/repositories/outcome-repository';

export default async function DevOutcomeCheckPage() {
  const { user } = await getCurrentUser();
  const outcomes = await getPublicOutcomes();
  const canAdminWrite = user?.role === 'council_staff' || user?.role === 'admin';

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#FEF3C7', padding: '12px 16px', borderRadius: '6px', marginBottom: '24px', fontSize: '0.875rem', color: '#92400E' }}>
        ⚠️ <strong>개발자 전용 「함께 바꿨습니다」 성과 관리 파이프라인 검증 페이지</strong>
      </div>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
        🤝 Outcomes Pipeline Check
      </h1>

      <div style={{ display: 'grid', gap: '16px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <strong>Authenticated User:</strong> {user?.displayName || 'Anonymous'} <br />
          <strong>Tenant Membership Role:</strong> {user?.role || 'none'} <br />
          <strong>Admin/Staff WRITE Permission:</strong>{' '}
          <span style={{ color: canAdminWrite ? '#059669' : '#DC2626', fontWeight: 700 }}>
            {canAdminWrite ? '✅ TRUE (성과 등록/수정/공개 가능)' : '❌ FALSE (일반 회원 READ 전용)'}
          </span>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
            Published DB Outcomes ({outcomes.length}건)
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '8px' }}>
            {outcomes.map((item) => (
              <li key={item.id} style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '6px' }}>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>{item.title}</div>
                <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '4px' }}>
                  {item.category} · {item.regionName} · {item.outcomeAt}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
