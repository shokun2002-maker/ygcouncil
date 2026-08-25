'use client';

import React, { useState } from 'react';
import { UserSessionProfile } from '@/lib/auth/types';
import { UserVerificationStatus } from '@/lib/repositories/verification-repository';
import { RegionData } from '@/lib/repositories/region-repository';
import { createClient } from '@/lib/supabase/client';
import { YGCOUNCIL_TENANT_ID } from '@/lib/config/tenant';

interface VerificationClientProps {
  user: UserSessionProfile;
  initialStatus: UserVerificationStatus | null;
  regions: RegionData[];
}

export default function VerificationClient({ user, initialStatus, regions }: VerificationClientProps) {
  const [status, setStatus] = useState<UserVerificationStatus | null>(initialStatus);
  const [selectedRegionId, setSelectedRegionId] = useState<string>(regions[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoVerifyIdentity = async () => {
    if (isLoading) return;
    const confirmChoice = window.confirm(
      '[시연용 본인확인 안내]\n\n실제 서비스에서는 PASS/NICE 휴대폰 본인확인이 수행됩니다.\n현재 데모 단계에서는 본인확인 완료(verified) 상태로 전환합니다.\n\n진행하시겠습니까?'
    );
    if (!confirmChoice) return;

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('demo_verify_identity', {
        p_tenant_id: YGCOUNCIL_TENANT_ID,
      });

      if (error) {
        alert('본인확인 처리 중 오류가 발생했습니다: ' + error.message);
      } else {
        alert('시연용 본인확인이 완료되었습니다!');
        window.location.reload();
      }
    } catch (err: any) {
      alert('오류가 발생했습니다: ' + err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestResidence = async () => {
    if (!selectedRegionId) {
      alert('거주 읍면을 선택해 주세요.');
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('request_residence_verification', {
        p_tenant_id: YGCOUNCIL_TENANT_ID,
        p_region_id: selectedRegionId,
      });

      if (error) {
        alert('거주확인 신청 중 오류가 발생했습니다: ' + error.message);
      } else {
        alert('영광군 거주확인 신청이 완료되었습니다!\n(관리자 검토 후 승인 처리됩니다.)');
        window.location.reload();
      }
    } catch (err: any) {
      alert('오류가 발생했습니다: ' + err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isIdentityDone = status?.identityStatus === 'verified';
  const isResidencePending = status?.residenceStatus === 'pending';
  const isResidenceDone = status?.residenceStatus === 'verified' && status?.isVerifiedResident;
  const isResidenceRejected = status?.residenceStatus === 'rejected';

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {/* STEP 1: 카카오 로그인 */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 700, marginBottom: '2px' }}>STEP 1</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>카카오 간편 계정 연결</div>
          <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '2px' }}>{user.displayName} 계정으로 로그인되어 있습니다.</div>
        </div>
        <span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 700 }}>
          ✓ 계정연결 완료
        </span>
      </div>

      {/* STEP 2: 본인확인 */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 700, marginBottom: '2px' }}>STEP 2</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>휴대폰 본인확인 (PASS / NICE)</div>
          </div>
          {isIdentityDone ? (
            <span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 700 }}>
              ✓ 본인확인 완료
            </span>
          ) : (
            <span style={{ background: '#FEF3C7', color: '#92400E', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 700 }}>
              미완료
            </span>
          )}
        </div>

        {!isIdentityDone ? (
          <div>
            <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.5, marginBottom: '16px' }}>
              본인 식별을 위해 휴대폰 본인확인을 진행합니다.<br />
              (시연용 환경에서는 실제 결제/인증창 없이 완료 처리됩니다.)
            </p>
            <button
              type="button"
              onClick={handleDemoVerifyIdentity}
              disabled={isLoading}
              style={{
                background: '#2563EB',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? '처리 중...' : '시연용 본인확인 진행'}
            </button>
          </div>
        ) : (
          <div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: 600 }}>
            본인 식별 인증이 정상 완료되었습니다. (인증방수단: {status?.identityMethod || 'DEMO_PASS'})
          </div>
        )}
      </div>

      {/* STEP 3: 거주확인 */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 700, marginBottom: '2px' }}>STEP 3</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>영광군 거주지 확인</div>
          </div>
          {isResidenceDone ? (
            <span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 700 }}>
              ✓ 거주지 승인 완료
            </span>
          ) : isResidencePending ? (
            <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 700 }}>
              ⏳ 관리자 검토 중
            </span>
          ) : isResidenceRejected ? (
            <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 700 }}>
              ❌ 신청 반려
            </span>
          ) : (
            <span style={{ background: '#F1F5F9', color: '#64748B', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8125rem', fontWeight: 600 }}>
              미신청
            </span>
          )}
        </div>

        {!isIdentityDone ? (
          <div style={{ fontSize: '0.875rem', color: '#94A3B8' }}>
            STEP 2 본인확인을 먼저 완료해 주시기 바랍니다.
          </div>
        ) : isResidenceDone ? (
          <div style={{ fontSize: '0.875rem', color: '#334155' }}>
            <div><strong>거주 읍면:</strong> {status?.regionName || '영광군'}</div>
            <div style={{ marginTop: '4px' }}>
              <strong>유효기간:</strong> {status?.expiresAt ? new Date(status.expiresAt).toLocaleDateString('ko-KR') : '무제한'} 까지
            </div>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.5, marginBottom: '16px' }}>
              영광군 관내 거주 읍면을 선택하고 거주확인을 신청해 주세요.<br />
              (관리자 검토 후 즉시 승인 처리됩니다.)
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                거주 읍면 선택 (11개 관내 읍면):
              </label>
              <select
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                style={{ width: '100%', maxWidth: '280px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.9375rem' }}
              >
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.name} ({reg.code})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleRequestResidence}
              disabled={isLoading}
              style={{
                background: isResidencePending ? '#64748B' : '#059669',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isResidencePending ? '거주확인 재신청하기' : '영광군 거주확인 신청'}
            </button>
          </div>
        )}
      </div>

      {/* STEP 4: 군민인증 결과 */}
      <div style={{
        background: isResidenceDone ? '#ECFDF5' : 'white',
        padding: '20px',
        borderRadius: '12px',
        border: isResidenceDone ? '1px solid #A7F3D0' : '1px solid #E2E8F0'
      }}>
        <div style={{ fontSize: '0.8125rem', color: isResidenceDone ? '#047857' : '#64748B', fontWeight: 700, marginBottom: '2px' }}>STEP 4</div>
        <div style={{ fontSize: '1.125rem', fontWeight: 800, color: isResidenceDone ? '#065F46' : '#0F172A' }}>
          {isResidenceDone ? '🎉 영광군민 인증 최종 완료!' : '영광군민 인증 대기'}
        </div>
        <p style={{ fontSize: '0.875rem', color: isResidenceDone ? '#047857' : '#64748B', marginTop: '6px', lineHeight: 1.5 }}>
          {isResidenceDone
            ? '영광군의회 열린소통 ON의 군민 참여 안건 투표, 제안 등록, 공감 및 댓글 작성이 자유롭게 가능합니다.'
            : '군민인증 완료 전에는 안건 조회 및 공유 기능만 제공됩니다.'}
        </p>
      </div>
    </div>
  );
}
