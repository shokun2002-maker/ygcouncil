'use client';

import React, { useState, useMemo } from 'react';
import { UserSessionProfile } from '@/lib/auth/types';
import { createClient } from '@/lib/supabase/client';
import { YGCOUNCIL_TENANT_ID } from '@/lib/config/tenant';

interface AdminVerificationClientProps {
  user: UserSessionProfile;
  initialList: any[];
}

export default function AdminVerificationClient({ initialList }: AdminVerificationClientProps) {
  const [list] = useState<any[]>(initialList);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  const counts = useMemo(() => {
    return {
      pending: list.filter((i) => i.residence_status === 'pending').length,
      verified: list.filter((i) => i.residence_status === 'verified').length,
      rejected: list.filter((i) => i.residence_status === 'rejected').length,
    };
  }, [list]);

  const filteredList = useMemo(() => {
    if (filterStatus === 'all') return list;
    return list.filter((i) => i.residence_status === filterStatus);
  }, [list, filterStatus]);

  const handleReview = async (targetUserId: string, decision: 'approve' | 'reject') => {
    const actionName = decision === 'approve' ? '승인' : '반려';
    const reason = window.prompt(`[군민인증 ${actionName}]\n사유를 입력해 주세요 (선택사항):`, decision === 'approve' ? '서류 및 본인확인 일치' : '거주지 증빙 미비');

    if (reason === null) return;

    setProcessingId(targetUserId);
    try {
      const supabase = createClient();
      const { error } = await supabase.rpc('review_residence_verification', {
        p_tenant_id: YGCOUNCIL_TENANT_ID,
        p_target_user_id: targetUserId,
        p_decision: decision,
        p_reason: reason,
      });

      if (error) {
        alert(`처리 실패 (${error.message})`);
      } else {
        alert(`성공적으로 ${actionName} 처리되었습니다.`);
        window.location.reload();
      }
    } catch (err: any) {
      alert('오류 발생: ' + err?.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Segmented Filter Bar */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', backgroundColor: '#F5F5F7', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.06)' }}>
        {[
          { key: 'all', label: `전체 (${list.length})` },
          { key: 'pending', label: `대기 (${counts.pending})` },
          { key: 'verified', label: `승인 (${counts.verified})` },
          { key: 'rejected', label: `반려 (${counts.rejected})` },
        ].map((btn) => {
          const isActive = filterStatus === btn.key;
          return (
            <button
              key={btn.key}
              type="button"
              onClick={() => setFilterStatus(btn.key as any)}
              style={{
                height: '36px',
                padding: '0 16px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#FFFFFF' : '#1D1D1F',
                backgroundColor: isActive ? '#0066CC' : '#FFFFFF',
                border: isActive ? 'none' : '1px solid rgba(0, 0, 0, 0.08)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Clean Table Surface */}
      <div className="card-apple" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F5F5F7', borderBottom: '1px solid rgba(0,0,0,0.06)', color: '#6E6E73', fontSize: '0.8125rem' }}>
              <th style={{ padding: '14px 20px' }}>신청 사용자</th>
              <th style={{ padding: '14px 20px' }}>신청 읍면</th>
              <th style={{ padding: '14px 20px' }}>본인확인</th>
              <th style={{ padding: '14px 20px' }}>거주지상태</th>
              <th style={{ padding: '14px 20px' }}>유효기간</th>
              <th style={{ padding: '14px 20px' }}>신청일시</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>관리 조치</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#86868B' }}>
                  조건에 일치하는 군민인증 신청 내역이 없습니다. (Clean State)
                </td>
              </tr>
            ) : (
              filteredList.map((item) => {
                const displayName = item.profiles?.display_name || '군민';
                const regionName = item.regions?.name || '미선택';
                const isApproved = item.residence_status === 'verified';
                const isPending = item.residence_status === 'pending';
                const isRejected = item.residence_status === 'rejected';

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#1D1D1F' }}>
                      {displayName}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#1D1D1F' }}>
                      {regionName}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span className="badge-apple" style={{ backgroundColor: item.identity_status === 'verified' ? '#D1FAE5' : '#FEF3C7', color: item.identity_status === 'verified' ? '#059669' : '#D97706' }}>
                        {item.identity_status === 'verified' ? '인증완료' : '미인증'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span className="badge-apple" style={{
                        backgroundColor: isApproved ? '#D1FAE5' : isPending ? '#FEF3C7' : isRejected ? '#FEE2E2' : '#F5F5F7',
                        color: isApproved ? '#059669' : isPending ? '#D97706' : isRejected ? '#DC2626' : '#6E6E73',
                      }}>
                        {isApproved ? '승인' : isPending ? '대기' : isRejected ? '반려' : item.residence_status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#6E6E73', fontSize: '0.8125rem' }}>
                      {item.expires_at ? new Date(item.expires_at).toLocaleDateString('ko-KR') : '-'}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#6E6E73', fontSize: '0.8125rem' }}>
                      {new Date(item.updated_at).toLocaleString('ko-KR')}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleReview(item.user_id, 'approve')}
                          disabled={processingId === item.user_id || isApproved}
                          className="btn-apple btn-apple-primary"
                          style={{
                            backgroundColor: isApproved ? '#E5E5EA' : '#0066CC',
                            color: isApproved ? '#86868B' : '#FFFFFF',
                            height: '32px',
                            padding: '0 12px',
                            fontSize: '0.8125rem',
                            cursor: isApproved ? 'not-allowed' : 'pointer',
                          }}
                        >
                          승인
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReview(item.user_id, 'reject')}
                          disabled={processingId === item.user_id || isRejected}
                          className="btn-apple btn-apple-secondary"
                          style={{
                            borderColor: isRejected ? '#E5E5EA' : '#DC2626',
                            color: isRejected ? '#86868B' : '#DC2626',
                            height: '32px',
                            padding: '0 12px',
                            fontSize: '0.8125rem',
                            cursor: isRejected ? 'not-allowed' : 'pointer',
                          }}
                        >
                          반려
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
