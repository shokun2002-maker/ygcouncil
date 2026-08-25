import { getCurrentUser } from '@/lib/auth/get-current-user';
import { createClient } from '@/lib/supabase/server';
import { YGCOUNCIL_TENANT_ID } from '@/lib/config/tenant';

export default async function DevProposalWriteCheckPage() {
  const { user } = await getCurrentUser();
  const supabase = await createClient();

  const { count: proposalCount } = await supabase
    .from('proposals')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', YGCOUNCIL_TENANT_ID);

  const { data: latestProposal } = await supabase
    .from('proposals')
    .select('id, title, category, status, created_at, regions(name)')
    .eq('tenant_id', YGCOUNCIL_TENANT_ID)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#FEF3C7', padding: '12px 16px', borderRadius: '6px', marginBottom: '24px', fontSize: '0.875rem', color: '#92400E' }}>
        ⚠️ <strong>개발자 전용 「듣습니다」 제안 작성 파이프라인 검증 페이지</strong>
      </div>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
        🗣️ Proposal Write Pipeline Check
      </h1>

      <div style={{ display: 'grid', gap: '16px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <strong>Authenticated User:</strong> {user?.displayName || 'Anonymous'} <br />
          <strong>Tenant Membership Role:</strong> {user?.role || 'none'} <br />
          <strong>Is Verified Resident:</strong>{' '}
          <span style={{ color: user?.isVerifiedResident ? '#059669' : '#DC2626', fontWeight: 700 }}>
            {user?.isVerifiedResident ? '✅ TRUE (제안 작성 가능)' : '❌ FALSE (작성 권한 없음)'}
          </span>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
            DB Proposals Summary
          </h2>
          <div><strong>Total DB Proposals Count:</strong> {proposalCount ?? 0}개</div>
        </div>

        {latestProposal && (
          <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Latest Registered Proposal</h2>
            <div><strong>Title:</strong> {latestProposal.title}</div>
            <div><strong>Category / Region:</strong> {latestProposal.category} / {(latestProposal.regions as any)?.name || '기타'}</div>
            <div><strong>Status:</strong> <span style={{ color: '#2563EB', fontWeight: 700 }}>{latestProposal.status}</span></div>
            <div><strong>Created At:</strong> {new Date(latestProposal.created_at).toLocaleString('ko-KR')}</div>
          </div>
        )}
      </div>
    </main>
  );
}
