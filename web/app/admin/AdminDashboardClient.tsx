'use client';

import React from 'react';
import Link from 'next/link';
import { UserSessionProfile } from '@/lib/auth/types';
import { AdminDashboardMetrics } from '@/lib/repositories/admin-dashboard-repository';

interface AdminDashboardClientProps {
  currentUser: UserSessionProfile;
  metrics: AdminDashboardMetrics;
}

export default function AdminDashboardClient({
  currentUser,
  metrics,
}: AdminDashboardClientProps) {
  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      {/* 1. 핵심 수치 KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #3B82F6' }}>
          <div style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 700 }}>🙋‍♂️ 묻습니다 안건</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            {metrics.asksCount} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#64748B' }}>건</span>
          </div>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #0D9488' }}>
          <div style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 700 }}>💬 듣습니다 제안</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            {metrics.proposalsTotalCount} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#64748B' }}>건</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
            접수: {metrics.proposalsReceivedCount}건 · 검토: {metrics.proposalsReviewCount}건
          </div>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #EC4899' }}>
          <div style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 700 }}>❤️ 제안 공감</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            {metrics.empathyCount} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#64748B' }}>개</span>
          </div>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #8B5CF6' }}>
          <div style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 700 }}>🗨️ 제안 댓글</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            {metrics.commentsVisibleCount} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#64748B' }}>개</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
            Soft Deleted: {metrics.commentsDeletedCount}개 · Hidden: {metrics.commentsHiddenCount}개
          </div>
        </div>
      </div>

      {/* 2. 관리자 업무 Quick Links & Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* 군민인증 관리 Card */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A' }}>
              🪪 군민인증 검토 및 승인
            </h2>
            <Link
              href="/admin/verifications"
              style={{ background: '#2563EB', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 700, textDecoration: 'none' }}
            >
              인증 관리 ➔
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center' }}>
            <div style={{ background: '#FEF3C7', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#92400E', fontWeight: 700 }}>대기 (Pending)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#B45309', marginTop: '2px' }}>
                {metrics.verificationsPendingCount}건
              </div>
            </div>
            <div style={{ background: '#DEF7EC', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#03543F', fontWeight: 700 }}>승인 (Verified)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#046C4E', marginTop: '2px' }}>
                {metrics.verificationsVerifiedCount}건
              </div>
            </div>
            <div style={{ background: '#FDE8E8', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#9B1C1C', fontWeight: 700 }}>반려 (Rejected)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#C81E1E', marginTop: '2px' }}>
                {metrics.verificationsRejectedCount}건
              </div>
            </div>
          </div>
        </div>

        {/* 성과 관리 Card */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A' }}>
              🤝 함께 바꿨습니다 성과 관리
            </h2>
            <Link
              href="/admin/outcomes"
              style={{ background: '#0F172A', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 700, textDecoration: 'none' }}
            >
              성과 관리 ➔
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', textAlign: 'center' }}>
            <div style={{ background: '#E0E7FF', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#3730A3', fontWeight: 700 }}>공개 성과 (Published)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4338CA', marginTop: '2px' }}>
                {metrics.outcomesPublishedCount}건
              </div>
            </div>
            <div style={{ background: '#F1F5F9', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700 }}>임시저장 (Draft)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#334155', marginTop: '2px' }}>
                {metrics.outcomesDraftCount}건
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 최근 관리자 활동 (Audit Logs) & Public Health */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
            📜 최근 관리자 감사 로그 (Audit Logs)
          </h2>

          {metrics.recentAuditLogs.length === 0 ? (
            <div style={{ color: '#94A3B8', fontSize: '0.875rem', padding: '20px 0', textAlign: 'center' }}>
              최근 관리자 활동 내역이 없습니다. (Clean State)
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px' }}>
              {metrics.recentAuditLogs.map((log) => (
                <li key={log.id} style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>{log.action}</strong>
                    <span style={{ fontSize: '0.8125rem', color: '#64748B', marginLeft: '8px' }}>Target: {log.targetTable}</span>
                  </div>
                  <span style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>{log.createdAt}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Public Health Summary */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
            ⚙️ 서비스 Health 요약
          </h2>
          <div style={{ display: 'grid', gap: '10px', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '6px' }}>
              <span>Supabase DB</span>
              <strong style={{ color: '#059669' }}>✅ CONNECTED</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '6px' }}>
              <span>영광군 행정구역</span>
              <strong>11개 읍·면</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '6px' }}>
              <span>보안 RLS / GRANT</span>
              <strong style={{ color: '#059669' }}>✅ ENFORCED</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px' }}>
              <span>시연용 RPC (Demo)</span>
              <strong style={{ color: '#D97706' }}>⚠️ DEMO ACTIVE</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
