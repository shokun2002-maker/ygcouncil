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
  metrics,
}: AdminDashboardClientProps) {
  // Audit log action mapper
  const formatAuditAction = (action: string) => {
    switch (action) {
      case 'RESIDENCE_VERIFICATION_APPROVED':
        return '군민 거주인증 승인';
      case 'RESIDENCE_VERIFICATION_REJECTED':
        return '군민 거주인증 반려';
      case 'PROPOSAL_COMMENT_HIDDEN':
        return '댓글 숨김 처리';
      case 'OUTCOME_CREATED':
        return '성과 신규 등록';
      case 'OUTCOME_UPDATED':
        return '성과 정보 수정';
      default:
        return action;
    }
  };

  const hasPendingItems = metrics.verificationsPendingCount > 0 || metrics.outcomesDraftCount > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Pending Work Highlights Banner */}
      {hasPendingItems ? (
        <div
          style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FCD34D',
            borderRadius: '16px',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <strong style={{ color: '#92400E', fontSize: '0.9375rem' }}>검토 및 조치가 필요한 항목이 있습니다</strong>
            <p style={{ color: '#B45309', fontSize: '0.875rem', marginTop: '4px' }}>
              거주인증 신청 대기 <strong style={{ color: '#92400E' }}>{metrics.verificationsPendingCount}건</strong> / 임시저장 성과 <strong style={{ color: '#92400E' }}>{metrics.outcomesDraftCount}건</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {metrics.verificationsPendingCount > 0 && (
              <Link href="/admin/verifications" className="btn-apple btn-apple-primary" style={{ backgroundColor: '#D97706', height: '36px', padding: '0 14px', fontSize: '0.8125rem' }}>
                인증 검토하기
              </Link>
            )}
            {metrics.outcomesDraftCount > 0 && (
              <Link href="/admin/outcomes" className="btn-apple btn-apple-secondary" style={{ height: '36px', padding: '0 14px', fontSize: '0.8125rem' }}>
                성과 관리하기
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: '#F5F5F7', padding: '16px 20px', borderRadius: '12px', color: '#6E6E73', fontSize: '0.875rem' }}>
          현재 바로 처리해야 할 대기 안건이 없습니다. (Clean State)
        </div>
      )}

      {/* Core Numeric Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6E6E73' }}>의견수렴 안건</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1D1D1F' }}>
            {metrics.asksCount}
          </div>
          <span style={{ fontSize: '0.8125rem', color: '#0066CC' }}>진행중 투표 및 조사</span>
        </div>

        <div className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6E6E73' }}>시민 제안</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1D1D1F' }}>
            {metrics.proposalsTotalCount}
          </div>
          <span style={{ fontSize: '0.8125rem', color: '#6E6E73' }}>
            접수: {metrics.proposalsReceivedCount} · 검토: {metrics.proposalsReviewCount}
          </span>
        </div>

        <div className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6E6E73' }}>제안 공감</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1D1D1F' }}>
            {metrics.empathyCount}
          </div>
          <span style={{ fontSize: '0.8125rem', color: '#00A896' }}>군민 공감 참여 총계</span>
        </div>

        <div className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6E6E73' }}>제안 댓글</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1D1D1F' }}>
            {metrics.commentsVisibleCount}
          </div>
          <span style={{ fontSize: '0.8125rem', color: '#6E6E73' }}>
            Soft Deleted: {metrics.commentsDeletedCount} · Hidden: {metrics.commentsHiddenCount}
          </span>
        </div>
      </div>

      {/* Control Panels: Verification & Outcomes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Verification Control */}
        <div className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1D1D1F' }}>
              군민인증 검토 및 승인
            </h2>
            <Link
              href="/admin/verifications"
              className="btn-apple btn-apple-primary"
              style={{ backgroundColor: '#0066CC', height: '36px', padding: '0 14px', fontSize: '0.8125rem' }}
            >
              인증 관리
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center' }}>
            <div style={{ backgroundColor: '#FEF3C7', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 700 }}>대기</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#B45309', marginTop: '2px' }}>
                {metrics.verificationsPendingCount}
              </div>
            </div>
            <div style={{ backgroundColor: '#D1FAE5', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>승인</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#047857', marginTop: '2px' }}>
                {metrics.verificationsVerifiedCount}
              </div>
            </div>
            <div style={{ backgroundColor: '#FEE2E2', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 700 }}>반려</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#B91C1C', marginTop: '2px' }}>
                {metrics.verificationsRejectedCount}
              </div>
            </div>
          </div>
        </div>

        {/* Outcomes Control */}
        <div className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1D1D1F' }}>
              함께 바꿨습니다 성과 관리
            </h2>
            <Link
              href="/admin/outcomes"
              className="btn-apple btn-apple-secondary"
              style={{ height: '36px', padding: '0 14px', fontSize: '0.8125rem' }}
            >
              성과 관리
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', textAlign: 'center' }}>
            <div style={{ backgroundColor: '#EBF5FF', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#0066CC', fontWeight: 700 }}>공개 성과</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#004080', marginTop: '2px' }}>
                {metrics.outcomesPublishedCount}
              </div>
            </div>
            <div style={{ backgroundColor: '#F5F5F7', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#6E6E73', fontWeight: 700 }}>임시저장</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D1D1F', marginTop: '2px' }}>
                {metrics.outcomesDraftCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log & Service Health */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Audit Log Panel */}
        <div className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1D1D1F' }}>
            최근 관리자 감사 로그
          </h2>

          {metrics.recentAuditLogs.length === 0 ? (
            <div style={{ color: '#86868B', fontSize: '0.875rem', padding: '24px 0', textAlign: 'center' }}>
              최근 관리자 활동 내역이 없습니다. (Clean State)
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {metrics.recentAuditLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    backgroundColor: '#F5F5F7',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.875rem',
                  }}
                >
                  <div>
                    <strong style={{ color: '#1D1D1F' }}>{formatAuditAction(log.action)}</strong>
                    <span style={{ color: '#86868B', fontSize: '0.8125rem', marginLeft: '8px' }}>({log.targetTable})</span>
                  </div>
                  <span style={{ color: '#86868B', fontSize: '0.8125rem' }}>{log.createdAt}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Service Health Panel */}
        <div className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1D1D1F' }}>
            서비스 Health 요약
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <span style={{ color: '#6E6E73' }}>Supabase DB</span>
              <strong style={{ color: '#059669' }}>정상 연결</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <span style={{ color: '#6E6E73' }}>영광군 행정구역</span>
              <strong style={{ color: '#1D1D1F' }}>11개 읍·면</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <span style={{ color: '#6E6E73' }}>보안 RLS / GRANT</span>
              <strong style={{ color: '#059669' }}>적용됨</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
              <span style={{ color: '#6E6E73' }}>시연용 RPC (Demo)</span>
              <strong style={{ color: '#D97706' }}>※ 활성중</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
