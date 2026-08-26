import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { getAdminDashboardMetrics } from '@/lib/repositories/admin-dashboard-repository';
import AdminNav from '@/components/admin/AdminNav';
import AdminDashboardClient from './AdminDashboardClient';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const { user } = await getCurrentUser();

  if (!user || (user.role !== 'council_staff' && user.role !== 'admin')) {
    redirect('/auth/error?reason=unauthorized');
  }

  const metrics = await getAdminDashboardMetrics();

  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', padding: '40px 24px 80px 24px', color: '#1D1D1F' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0066CC', backgroundColor: '#EBF5FF', padding: '4px 10px', borderRadius: '6px', display: 'inline-block', marginBottom: '8px' }}>
              운영관리 · CONTROL TOWER
            </div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#1D1D1F', letterSpacing: '-0.5px' }}>
              열린소통 ON 관리자
            </h1>
            <p style={{ color: '#6E6E73', fontSize: '0.9375rem', marginTop: '4px' }}>
              영광군민 참여 현황과 거주인증, 성과관리 운영 상태를 한눈에 관리합니다.
            </p>
          </div>
          <div style={{ backgroundColor: '#F5F5F7', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.06)', fontSize: '0.875rem', color: '#1D1D1F', fontWeight: 600 }}>
            {user.displayName} <span style={{ color: '#0066CC', fontSize: '0.8125rem' }}>({user.role})</span>
          </div>
        </div>

        {/* Common Admin Navigation */}
        <AdminNav />

        <AdminDashboardClient currentUser={user} metrics={metrics} />
      </div>
    </main>
  );
}
