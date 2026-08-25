import { createClient } from '@/lib/supabase/server';
import { YGCOUNCIL_TENANT_ID } from '@/lib/config/tenant';

export const revalidate = 0;

export default async function SupabaseCheckPage() {
  let connectionStatus = 'PENDING';
  let errorMessage = '';
  let tenantInfo: any = null;
  let regionsList: any[] = [];
  let asksCount = 0;
  let proposalsCount = 0;
  let outcomesCount = 0;

  try {
    const supabase = await createClient();

    // 1. Check Tenant
    const { data: tData, error: tErr } = await supabase
      .from('tenants')
      .select('id, name, slug')
      .eq('id', YGCOUNCIL_TENANT_ID)
      .single();

    if (tErr) {
      errorMessage = tErr.message;
      connectionStatus = 'ERROR';
    } else {
      tenantInfo = tData;
      connectionStatus = 'OK';
    }

    // 2. Check Regions
    const { data: rData } = await supabase
      .from('regions')
      .select('id, name, code')
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (rData) regionsList = rData;

    // 3. Check Asks Count
    const { count: aCount } = await supabase
      .from('asks')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', YGCOUNCIL_TENANT_ID);

    if (aCount !== null) asksCount = aCount;

    // 4. Check Proposals Count
    const { count: pCount } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', YGCOUNCIL_TENANT_ID);

    if (pCount !== null) proposalsCount = pCount;

    // 5. Check Outcomes Count
    const { count: oCount } = await supabase
      .from('outcomes')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', YGCOUNCIL_TENANT_ID);

    if (oCount !== null) outcomesCount = oCount;

  } catch (err: any) {
    connectionStatus = 'ERROR';
    errorMessage = err.message || 'Unknown connection error';
  }

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#FEF3C7', padding: '12px 16px', borderRadius: '6px', marginBottom: '24px', fontSize: '0.875rem', color: '#92400E' }}>
        ⚠️ <strong>개발 검증 전용 페이지</strong> (본 페이지는 개발자 연동 테스트용이며 Secret/API Key를 표출하지 않습니다.)
      </div>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
        🔍 Supabase READ 연동 검증 (Smoke Test)
      </h1>

      <div style={{ display: 'grid', gap: '16px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <strong>Supabase Connection Status:</strong>{' '}
          <span style={{ color: connectionStatus === 'OK' ? '#059669' : '#DC2626', fontWeight: 700 }}>
            {connectionStatus === 'OK' ? '✅ OK' : `❌ ERROR (${errorMessage})`}
          </span>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <strong>Target Tenant:</strong> {tenantInfo ? `${tenantInfo.name} (${tenantInfo.slug})` : 'Not Found'}
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <strong>Public Regions Count:</strong> <strong style={{ color: '#2563EB' }}>{regionsList.length}개</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
            {regionsList.map((r) => (
              <span key={r.id} style={{ background: '#F1F5F9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8125rem' }}>
                {r.name} ({r.code})
              </span>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div>
            <strong>Asks (DB Row):</strong> <span style={{ color: '#0D9488', fontWeight: 700 }}>{asksCount}건</span>
          </div>
          <div>
            <strong>Proposals (DB Row):</strong> <span style={{ color: '#0D9488', fontWeight: 700 }}>{proposalsCount}건</span>
          </div>
          <div>
            <strong>Outcomes (DB Row):</strong> <span style={{ color: '#0D9488', fontWeight: 700 }}>{outcomesCount}건</span>
          </div>
        </div>
      </div>
    </main>
  );
}
