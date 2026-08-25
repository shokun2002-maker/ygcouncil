import { getCurrentUser } from '@/lib/auth/get-current-user';
import { createClient } from '@/lib/supabase/server';
import { YGCOUNCIL_TENANT_ID } from '@/lib/config/tenant';
import AdminVerificationClient from './AdminVerificationClient';
import Link from 'next/link';

export default async function AdminVerificationsPage() {
  const { user } = await getCurrentUser();

  if (!user) {
    return (
      <main style={{ maxWidth: '600px', margin: '60px auto', padding: '24px', textAlign: 'center' }}>
        <h2>관리자 로그인이 필요합니다.</h2>
        <Link href="/" style={{ color: '#2563EB', fontWeight: 700 }}>메인으로 이동</Link>
      </main>
    );
  }

  const supabase = await createClient();

  // 신청 목록 조회 (profiles & regions join)
  const { data: verifications, error } = await supabase
    .from('resident_verifications')
    .select('*, profiles(display_name), regions(name)')
    .eq('tenant_id', YGCOUNCIL_TENANT_ID)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin verifications:', error);
  }

  return (
    <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            🏛️ 군민인증 관리자 검토
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '4px 0 0 0' }}>
            군민의 거주확인 신청 내역을 검토하고 승인/반려합니다. (승인 시 1년 유효기간 자동 부여 및 감사로그 기록)
          </p>
        </div>
        <Link href="/admin" style={{ padding: '8px 16px', background: '#F1F5F9', color: '#334155', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
          관리자 메인
        </Link>
      </div>

      <AdminVerificationClient
        user={user}
        initialList={verifications || []}
      />
    </main>
  );
}
