import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { getPublicOutcomes } from '@/lib/repositories/outcome-repository';
import AdminOutcomesClient from './AdminOutcomesClient';

export const revalidate = 0;

export default async function AdminOutcomesPage() {
  const { user } = await getCurrentUser();

  if (!user || (user.role !== 'council_staff' && user.role !== 'admin')) {
    redirect('/auth/error?reason=unauthorized');
  }

  const outcomes = await getPublicOutcomes();

  return (
    <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
          🏛️ 의정 성과 관리 (`/admin/outcomes`)
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          의회 직원 및 관리자가 군민 제안과 공론화 결과를 바탕으로 실제 의정 성과를 등록/수정/공개합니다.
        </p>
      </div>

      <AdminOutcomesClient currentUser={user} initialOutcomes={outcomes} />
    </main>
  );
}
