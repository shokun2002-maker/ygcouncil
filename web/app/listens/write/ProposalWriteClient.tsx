'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserSessionProfile } from '@/lib/auth/types';
import { RegionData } from '@/lib/repositories/region-repository';
import { submitCitizenProposal } from '@/lib/repositories/proposal-write-repository';

const CATEGORIES = ['생활환경', '교통', '복지', '청년', '교육', '문화·관광', '농업', '지역경제', '기타'];

interface ProposalWriteClientProps {
  currentUser: UserSessionProfile | null;
  regions: RegionData[];
}

export default function ProposalWriteClient({ currentUser, regions }: ProposalWriteClientProps) {
  const [category, setCategory] = useState('');
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProposalId, setSubmittedProposalId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert('제안 작성은 카카오 로그인이 필요합니다.');
      return;
    }

    if (!currentUser.isVerifiedResident) {
      alert('제안 작성은 영광군민 인증이 완료된 계정만 가능합니다.\n[군민인증 신청하기] 화면으로 이동합니다.');
      window.location.href = '/verification';
      return;
    }

    if (!category) {
      alert('카테고리를 선택해 주세요.');
      return;
    }
    if (!selectedRegionId) {
      alert('해당 읍·면 지역을 선택해 주세요.');
      return;
    }
    if (!title.trim()) {
      alert('제안 제목을 입력해 주세요.');
      return;
    }
    if (!content.trim()) {
      alert('제안 내용을 입력해 주세요.');
      return;
    }
    if (!policyAgreed) {
      alert('작성 전 유의사항 안내 동의에 체크해 주세요.');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const result = await submitCitizenProposal({
        regionId: selectedRegionId,
        category,
        title: title.trim(),
        content: content.trim(),
      });

      if (!result.success || !result.proposalId) {
        alert(`제안 등록 실패: ${result.error}`);
      } else {
        alert('이야기를 들려주셔서 감사합니다. 제안이 정상 등록되었습니다!');
        setSubmittedProposalId(result.proposalId);
      }
    } catch (err: any) {
      alert('오류가 발생했습니다: ' + err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Back Navigation */}
      <div style={{ marginBottom: '32px' }}>
        <Link
          href="/listens"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#424245',
            fontSize: '1rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          목록으로 돌아가기
        </Link>
      </div>

      {/* Authorization Guidance Banners */}
      {!currentUser ? (
        <div
          style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FCD34D',
            borderRadius: '16px',
            padding: '24px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div>
            <strong style={{ color: '#92400E', fontSize: '1rem' }}>제안 작성은 군민인증이 필요합니다</strong>
            <p style={{ color: '#B45309', fontSize: '0.9375rem', marginTop: '4px' }}>
              카카오 간편 로그인 후 영광군민 인증을 완료하시면 제안을 등록하실 수 있습니다.
            </p>
          </div>
          <Link href="/" className="btn-apple" style={{ backgroundColor: '#FEE500', color: '#191919', height: '44px', padding: '0 20px', fontSize: '0.9375rem' }}>
            카카오 로그인
          </Link>
        </div>
      ) : !currentUser.isVerifiedResident ? (
        <div
          style={{
            backgroundColor: '#F0F6FF',
            border: '1px solid #93C5FD',
            borderRadius: '16px',
            padding: '24px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div>
            <strong style={{ color: '#1E40AF', fontSize: '1rem' }}>제안 작성을 위해 영광군민 인증이 필요합니다</strong>
            <p style={{ color: '#1E3A8A', fontSize: '0.9375rem', marginTop: '4px' }}>
              현재 카카오 로그인 상태({currentUser.displayName})이나 군민 미인증 상태입니다.
            </p>
          </div>
          <Link href="/verification" className="btn-apple btn-apple-primary" style={{ height: '44px', padding: '0 20px', fontSize: '0.9375rem' }}>
            군민인증 신청하기
          </Link>
        </div>
      ) : null}

      {!submittedProposalId ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '24px',
            padding: '40px 36px',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#00A896', backgroundColor: '#E6F7F5', padding: '4px 12px', borderRadius: '6px' }}>
              이야기 들려주기
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1D1D1F', marginTop: '12px', letterSpacing: '-0.03em' }}>
              영광의 이야기를 들려주세요.
            </h1>
            <p style={{ color: '#6E6E73', fontSize: '1.0625rem', marginTop: '8px', lineHeight: 1.6 }}>
              생활 속 불편사항, 정책 아이디어, 우리 동네 이야기를 자유롭게 제안해 보세요.
            </p>
          </div>

          {/* Privacy Notice Box */}
          <div
            style={{
              backgroundColor: '#F5F5F7',
              borderRadius: '16px',
              padding: '24px 28px',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              marginBottom: '32px',
            }}
          >
            <strong style={{ fontSize: '1rem', color: '#1D1D1F' }}>작성 시 유의사항 (개인정보 보호)</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '10px', fontSize: '0.9375rem', color: '#6E6E73', lineHeight: 1.7 }}>
              <li>주민등록번호, 전화번호, 상세주소 등 개인 식별 정보를 본문에 입력하지 마세요.</li>
              <li>특정인에 대한 비방, 명예훼손, 광고성 내용은 예고 없이 숨김 처리될 수 있습니다.</li>
              <li>작성해주신 소중한 제안은 영광군의회 관계 부서에서 적극 검토합니다.</li>
            </ul>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Category & Region */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1D1D1F' }}>
                  카테고리 선택 <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    fontSize: '0.9375rem',
                    color: '#1D1D1F',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="">카테고리를 선택하세요</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1D1D1F' }}>
                  해당 읍·면 지역 <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <select
                  value={selectedRegionId}
                  onChange={(e) => setSelectedRegionId(e.target.value)}
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    fontSize: '0.9375rem',
                    color: '#1D1D1F',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="">지역을 선택하세요</option>
                  {regions.map((reg) => (
                    <option key={reg.id} value={reg.id}>
                      {reg.name} ({reg.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1D1D1F' }}>
                제안 제목 (최대 80자) <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                maxLength={80}
                placeholder="제안하고자 하는 핵심 내용을 제목으로 써주세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  fontSize: '1rem',
                  color: '#1D1D1F',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#86868B' }}>
                {title.length} / 80자
              </div>
            </div>

            {/* Content Textarea */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1D1D1F' }}>
                제안 내용 (최대 2,000자) <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <textarea
                rows={8}
                maxLength={2000}
                placeholder="### 이런 점이 불편합니다&#10;현장의 문제점이나 불편한 사유를 기술해주세요.&#10;&#10;### 이렇게 바뀌었으면 좋겠습니다&#10;의회나 관공서에 바라는 구체적인 개선 아이디어를 들려주세요."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{
                  width: '100%',
                  padding: '18px',
                  borderRadius: '14px',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  fontSize: '1rem',
                  lineHeight: 1.65,
                  color: '#1D1D1F',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#86868B' }}>
                {content.length} / 2000자
              </div>
            </div>

            {/* Privacy Agreement Checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9375rem', color: '#1D1D1F', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={policyAgreed}
                onChange={(e) => setPolicyAgreed(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span>위 유의사항 및 개인정보 보호 지침 안내를 확인하였으며 동의합니다.</span>
            </label>

            {/* Submit Action */}
            <button
              type="submit"
              className="btn-apple btn-apple-primary"
              disabled={isSubmitting || !currentUser?.isVerifiedResident}
              style={{
                backgroundColor: '#00A896',
                width: '100%',
                height: '56px',
                fontSize: '1.0625rem',
                opacity: !currentUser?.isVerifiedResident ? 0.5 : 1,
                cursor: !currentUser?.isVerifiedResident ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? '이야기를 보내는 중...' : '의회에 제안 등록하기'}
            </button>
          </form>
        </div>
      ) : (
        /* Completion State */
        <div style={{ backgroundColor: '#FFFFFF', padding: '64px 32px', textAlign: 'center', borderRadius: '24px', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
          <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#1D1D1F', marginBottom: '12px' }}>
            이야기를 들려주셔서 감사합니다
          </h2>
          <p style={{ color: '#6E6E73', fontSize: '1.0625rem', marginBottom: '32px', lineHeight: 1.6 }}>
            등록해 주신 소중한 제안은 영광군의회에 정상 접수되어 담당 부서 및 상임위원회에서 적극 검토할 예정입니다.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`/listens/${submittedProposalId}`} className="btn-apple btn-apple-primary" style={{ backgroundColor: '#00A896', height: '48px', padding: '0 24px', fontSize: '1rem' }}>
              내가 작성한 이야기 보기
            </Link>
            <Link href="/listens" className="btn-apple btn-apple-secondary" style={{ height: '48px', padding: '0 24px', fontSize: '1rem' }}>
              전체 제안 목록으로 이동
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
