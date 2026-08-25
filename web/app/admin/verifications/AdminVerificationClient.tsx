'use client';

import React, { useState } from 'react';
import { UserSessionProfile } from '@/lib/auth/types';
import { createClient } from '@/lib/supabase/client';
import { YGCOUNCIL_TENANT_ID } from '@/lib/config/tenant';

interface AdminVerificationClientProps {
  user: UserSessionProfile;
  initialList: any[];
}

export default function AdminVerificationClient({ user, initialList }: AdminVerificationClientProps) {
  const [list, setList] = useState<any[]>(initialList);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleReview = async (targetUserId: string, decision: 'approve' | 'reject') => {
    const actionName = decision === 'approve' ? '승인' : '반려';
    const reason = window.prompt(`[군민인증 ${actionName}]\n사유를 입력해 주세요 (선택사항):`, decision === 'approve' ? '서류 및 본인확인 일치' : '거주지 증빙 미비');

    if (reason === null) return; // 취소

    setProcessingId(targetUserId);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('review_residence_verification', {
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
    <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
            <th style={{ padding: '12px 16px' }}>신청 사용자</th>
            <th style={{ padding: '12px 16px' }}>신청 읍면</th>
            <th style={{ padding: '12px 16px' }}>본인확인</th>
            <th style={{ padding: '12px 16px' }}>거주지상태</th>
            <th style={{ padding: '12px 16px' }}>유효기간</th>
            <th style={{ padding: '12px 16px' }}>신청/신규일시</th>
            <th style={{ padding: '12px 16px', textAlign: 'right' }}>관리 조치</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#94A3B8' }}>
                군민인증 신청 내역이 없습니다.
              </td>
            </tr>
          ) : (
            list.map((item) => {
              const displayName = item.profiles?.display_name || '군민';
              const regionName = item.regions?.name || '미선택';
              const isApproved = item.residence_status === 'verified';
              const isPending = item.residence_status === 'pending';
              const isRejected = item.residence_status === 'rejected';

              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0F172A' }}>
                    {displayName}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#334155' }}>
                    {regionName}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: item.identity_status === 'verified' ? '#D1FAE5' : '#FEF3C7',
                      color: item.identity_status === 'verified' ? '#065F46' : '#92400E',
                      padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700
                    }}>
                      {item.identity_status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: isApproved ? '#ECFDF5' : isPending ? '#DBEAFE' : isRejected ? '#FEE2E2' : '#F1F5F9',
                      color: isApproved ? '#047857' : isPending ? '#1E40AF' : isRejected ? '#991B1B' : '#64748B',
                      padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700
                    }}>
                      {item.residence_status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontSize: '0.8125rem' }}>
                    {item.expires_at ? new Date(item.expires_at).toLocaleDateString('ko-KR') : '-'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748B', fontSize: '0.8125rem' }}>
                    {new Date(item.updated_at).toLocaleString('ko-KR')}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleReview(item.user_id, 'approve')}
                        disabled={processingId === item.user_id || isApproved}
                        style={{
                          background: isApproved ? '#CBD5E1' : '#059669',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: isApproved ? 'not-allowed' : 'pointer'
                        }}
                      >
                        승인
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReview(item.user_id, 'reject')}
                        disabled={processingId === item.user_id || isRejected}
                        style={{
                          background: isRejected ? '#CBD5E1' : '#DC2626',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: isRejected ? 'not-allowed' : 'pointer'
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
  );
}
