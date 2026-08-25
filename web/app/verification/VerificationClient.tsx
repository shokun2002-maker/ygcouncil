'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  const [status] = useState<UserVerificationStatus | null>(initialStatus);
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
      const { error } = await supabase.rpc('demo_verify_identity', {
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
      const { error } = await supabase.rpc('request_residence_verification', {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Step Progress Indicator Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
        {[
          { step: '01', title: '계정 연결', active: true, done: true },
          { step: '02', title: '본인 확인', active: isIdentityDone, done: isIdentityDone },
          { step: '03', title: '거주 확인', active: isResidencePending || isResidenceDone, done: isResidenceDone },
          { step: '04', title: '인증 완료', active: isResidenceDone, done: isResidenceDone },
        ].map((st, idx) => (
          <div
            key={idx}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: st.done ? '#E6F7F5' : st.active ? '#EBF5FF' : '#F5F5F7',
              border: st.done ? '1px solid #00A896' : st.active ? '1px solid #0066CC' : '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: st.done ? '#00A896' : st.active ? '#0066CC' : '#86868B' }}>
              STEP {st.step}
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1D1D1F' }}>
              {st.title}
            </span>
          </div>
        ))}
      </div>

      {/* STEP 1: 카카오 로그인 */}
      <div className="card-apple" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8125rem', color: '#00A896', fontWeight: 700 }}>STEP 1 · 계정 연결</div>
          <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1D1D1F', marginTop: '2px' }}>카카오 간편 계정 연결</div>
          <div style={{ fontSize: '0.875rem', color: '#6E6E73', marginTop: '2px' }}>{user.displayName} 계정으로 로그인되어 있습니다.</div>
        </div>
        <span className="badge-apple" style={{ backgroundColor: '#D1FAE5', color: '#059669' }}>
          ✓ 연결 완료
        </span>
      </div>

      {/* STEP 2: 본인확인 */}
      <div className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8125rem', color: isIdentityDone ? '#00A896' : '#0066CC', fontWeight: 700 }}>STEP 2 · 본인 식별</div>
            <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1D1D1F', marginTop: '2px' }}>휴대폰 본인확인 (PASS / NICE)</div>
          </div>
          {isIdentityDone ? (
            <span className="badge-apple" style={{ backgroundColor: '#D1FAE5', color: '#059669' }}>
              ✓ 본인확인 완료
            </span>
          ) : (
            <span className="badge-apple" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
              미완료
            </span>
          )}
        </div>

        {!isIdentityDone ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '0.875rem', color: '#6E6E73', lineHeight: 1.5 }}>
              본인 식별을 위해 휴대폰 본인확인을 진행합니다.<br />
              (시연용 환경에서는 실제 결제/인증창 없이 본인확인 완료 처리됩니다.)
            </p>
            <button
              type="button"
              onClick={handleDemoVerifyIdentity}
              disabled={isLoading}
              className="btn-apple btn-apple-primary"
              style={{ backgroundColor: '#0066CC', height: '44px', width: 'fit-content', padding: '0 20px' }}
            >
              {isLoading ? '처리 중...' : '시연용 본인확인 진행 ➔'}
            </button>
          </div>
        ) : (
          <div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: 600 }}>
            ✓ 본인 식별 인증이 정상 완료되었습니다. (인증수단: {status?.identityMethod || 'DEMO_PASS'})
          </div>
        )}
      </div>

      {/* STEP 3: 거주확인 */}
      <div className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8125rem', color: isResidenceDone ? '#00A896' : isResidencePending ? '#0066CC' : '#6E6E73', fontWeight: 700 }}>STEP 3 · 거주지 증빙</div>
            <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1D1D1F', marginTop: '2px' }}>영광군 거주지 확인</div>
          </div>
          {isResidenceDone ? (
            <span className="badge-apple" style={{ backgroundColor: '#D1FAE5', color: '#059669' }}>
              ✓ 거주지 승인 완료
            </span>
          ) : isResidencePending ? (
            <span className="badge-apple" style={{ backgroundColor: '#EBF5FF', color: '#0066CC' }}>
              관리자 검토 중
            </span>
          ) : isResidenceRejected ? (
            <span className="badge-apple" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
              신청 반려
            </span>
          ) : (
            <span className="badge-apple" style={{ backgroundColor: '#F5F5F7', color: '#6E6E73' }}>
              미신청
            </span>
          )}
        </div>

        {!isIdentityDone ? (
          <div style={{ fontSize: '0.875rem', color: '#86868B' }}>
            STEP 2 본인확인을 먼저 완료해 주시기 바랍니다.
          </div>
        ) : isResidenceDone ? (
          <div style={{ fontSize: '0.875rem', color: '#1D1D1F', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div><strong>거주 읍면:</strong> {status?.regionName || '영광군'}</div>
            <div>
              <strong>유효기간:</strong> {status?.expiresAt ? new Date(status.expiresAt).toLocaleDateString('ko-KR') : '무제한'} 까지
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.875rem', color: '#6E6E73', lineHeight: 1.5 }}>
              영광군 관내 거주 읍면을 선택하고 거주확인을 신청해 주세요.<br />
              (관리자 검토 후 승인 처리됩니다.)
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1D1D1F' }}>
                거주 읍면 선택 (11개 관내 읍면)
              </label>
              <select
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '320px',
                  height: '44px',
                  padding: '0 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  fontSize: '0.875rem',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                }}
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
              className="btn-apple btn-apple-primary"
              style={{
                backgroundColor: isResidencePending ? '#0066CC' : '#00A896',
                height: '44px',
                width: 'fit-content',
                padding: '0 20px',
              }}
            >
              {isResidencePending ? '거주확인 재신청하기 ➔' : '영광군 거주확인 신청 ➔'}
            </button>
          </div>
        )}
      </div>

      {/* STEP 4: 군민인증 결과 */}
      <div
        style={{
          backgroundColor: isResidenceDone ? '#E6F7F5' : '#F5F5F7',
          padding: '24px',
          borderRadius: '20px',
          border: isResidenceDone ? '1px solid #00A896' : '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ fontSize: '0.8125rem', color: isResidenceDone ? '#00A896' : '#6E6E73', fontWeight: 700 }}>
          STEP 4 · 군민인증 결과
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D1D1F' }}>
          {isResidenceDone ? '영광군민 인증 최종 완료' : '영광군민 인증 대기'}
        </h2>
        <p style={{ fontSize: '0.9375rem', color: '#6E6E73', lineHeight: 1.5 }}>
          {isResidenceDone
            ? '영광군의회 열린소통 ON의 군민 참여 안건 투표, 제안 등록, 공감 및 댓글 작성이 자유롭게 가능합니다.'
            : '군민인증 완료 전에는 안건 조회 및 공유 기능만 제공됩니다.'}
        </p>

        {isResidenceDone && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
            <Link href="/asks" className="btn-apple btn-apple-primary" style={{ backgroundColor: '#0066CC', height: '40px' }}>
              의견수렴 참여하기 ➔
            </Link>
            <Link href="/listens/write" className="btn-apple btn-apple-secondary" style={{ height: '40px' }}>
              내 이야기 들려주기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
