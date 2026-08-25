import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { createClient } from '@/lib/supabase/server';
import { YGCOUNCIL_TENANT_ID } from '@/lib/config/tenant';
import AdminNav from '@/components/admin/AdminNav';
import AdminVerificationClient from './AdminVerificationClient';

export default async function AdminVerificationsPage() {
  const { user } = await getCurrentUser();

  if (!user || (user.role !== 'council_staff' && user.role !== 'admin')) {
    return (
      <main style={{ maxWidth: '600px', margin: '60px auto', padding: '24px', textAlign: 'center' }}>
        <h2>관리자 로그인이 필요합니다.</h2>
        <Link href="/" style={{ color: '#0066CC', fontWeight: 700 }}>메인으로 이동</Link>
      </main>
    );
  }

  const supabase = await createClient();

  const { data: verifications, error } = await supabase
    .from('resident_verifications')
    .select('*, profiles(display_name), regions(name)')
    .eq('tenant_id', YGCOUNCIL_TENANT_ID)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin verifications:', error);
  }

  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', padding: '40px 24px 80px 24px', color: '#1D1D1F' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0066CC', backgroundColor: '#EBF5FF', padding: '4px 10px', borderRadius: '6px', display: 'inline-block', marginBottom: '8px' }}>
              군민인증 관리 · VERIFICATION
            </div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#1D1D1F', letterSpacing: '-0.5px' }}>
              거주인증 검토 및 승인
            </h1>
            <p style={{ color: '#6E6E73', fontSize: '0.9375rem', marginTop: '4px' }}>
              신청된 군민 거주인증 내역을 검토하고 승인 또는 반려 처리합니다.
            </p>
          </div>
          <div style={{ backgroundColor: '#F5F5F7', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.06)', fontSize: '0.875rem', color: '#1D1D1F', fontWeight: 600 }}>
            👤 {user.displayName} <span style={{ color: '#0066CC', fontSize: '0.8125rem' }}>({user.role})</span>
          </div>
        </div>

        {/* Common Admin Navigation */}
        <AdminNav />

        <AdminVerificationClient
          user={user}
          initialList={verifications || []}
        />
      </div>
    </main>
  );
}
