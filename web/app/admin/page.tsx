import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { getAdminDashboardMetrics } from '@/lib/repositories/admin-dashboard-repository';
import AdminDashboardClient from './AdminDashboardClient';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const { user } = await getCurrentUser();

  if (!user || (user.role !== 'council_staff' && user.role !== 'admin')) {
    redirect('/auth/error?reason=unauthorized');
  }

  const metrics = await getAdminDashboardMetrics();

  return (
    <main style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 24px', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
            🏛️ 영광군의회 열린소통 ON 통합 관리자 대시보드
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
            실시간 운영 현황 및 군민인증, 성과관리, 댓글 관리 통합 대시보드입니다.
          </p>
        </div>
        <div style={{ background: '#EFF6FF', padding: '8px 16px', borderRadius: '8px', border: '1px solid #BFDBFE', fontSize: '0.875rem', color: '#1E40AF', fontWeight: 700 }}>
          👤 {user.displayName} ({user.role})
        </div>
      </div>

      <AdminDashboardClient currentUser={user} metrics={metrics} />
    </main>
  );
}
