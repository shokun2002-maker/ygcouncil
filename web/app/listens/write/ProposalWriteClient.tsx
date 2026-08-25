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
      alert('🔒 제안 작성은 카카오 로그인이 필요합니다.');
      return;
    }

    if (!currentUser.isVerifiedResident) {
      alert('🪪 제안 작성은 영광군민 인증이 완료된 계정만 가능합니다.\n[군민인증 신청하기] 화면으로 이동합니다.');
      window.location.href = '/verification';
      return;
    }

    if (!category) {
      alert('⚠️ 카테고리를 선택해 주세요.');
      return;
    }
    if (!selectedRegionId) {
      alert('⚠️ 해당 읍·면 지역을 선택해 주세요.');
      return;
    }
    if (!title.trim()) {
      alert('⚠️ 제안 제목을 입력해 주세요.');
      return;
    }
    if (!content.trim()) {
      alert('⚠️ 제안 내용을 입력해 주세요.');
      return;
    }
    if (!policyAgreed) {
      alert('⚠️ 작성 전 유의사항 안내 동의에 체크해 주세요.');
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
      <div style={{ marginBottom: '24px' }}>
        <Link href="/listens" className="btn-share" style={{ fontSize: '0.9375rem', fontWeight: 700 }}>
          ← 전체 제안 목록으로 돌아가기
        </Link>
      </div>

      {/* 권한 안내 Banner */}
      {!currentUser ? (
        <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ color: '#92400E', fontSize: '0.9375rem' }}>🔒 제안 작성은 군민인증이 필요합니다.</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#B45309' }}>카카오 간편 로그인 후 영광군민 인증을 완료하시면 군민 제안을 등록하실 수 있습니다.</p>
          </div>
          <Link href="/" style={{ background: '#FEE500', color: '#191919', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
            카카오 로그인
          </Link>
        </div>
      ) : !currentUser.isVerifiedResident ? (
        <div style={{ background: '#EFF6FF', border: '1px solid #93C5FD', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ color: '#1E40AF', fontSize: '0.9375rem' }}>🪪 제안 작성을 위해 영광군민 인증이 필요합니다.</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#1E3A8A' }}>현재 카카오 로그인 상태({currentUser.displayName})이나 군민 미인증 상태입니다.</p>
          </div>
          <Link href="/verification" style={{ background: '#2563EB', color: 'white', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
            군민인증 신청 ➔
          </Link>
        </div>
      ) : null}

      {!submittedProposalId ? (
        <div className="ask-detail-card" style={{ padding: '36px' }}>
          <div style={{ marginBottom: '28px', borderBottom: '2px solid var(--teal)', paddingBottom: '16px' }}>
            <span className="section-tag listen-tag" style={{ marginBottom: '8px' }}>
              이야기 들려주기
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy)' }}>
              영광군의회에 제안을 들려주세요
            </h1>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.9375rem', marginTop: '6px' }}>
              군민 여러분의 생활 속 불편사항이나 영광의 발전을 위한 아이디어를 자유롭게 들려주세요.
            </p>
          </div>

          {/* Form Policy Agree Box */}
          <div className="policy-agree-box">
            <div className="policy-agree-title">📌 작성 시 유의사항 안내 (개인정보 보호)</div>
            <ul style={{ paddingLeft: '18px', marginTop: '6px', listStyleType: 'disc' }}>
              <li>주민등록번호, 전화번호, 주소 등 개인 식별 정보를 본문에 포함하지 마세요.</li>
              <li>특정 개인이나 단체에 대한 비방, 명예훼손, 광고성 제안은 예고 없이 숨김 처리될 수 있습니다.</li>
              <li>제안 내용은 영광군의회 담당 상임위원회 및 관계 부서에서 적극 검토합니다.</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label className="admin-form-label" style={{ fontWeight: 700, marginBottom: '8px', display: 'block' }}>
                  카테고리 선택 <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  className="search-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="">카테고리를 선택하세요</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="admin-form-label" style={{ fontWeight: 700, marginBottom: '8px', display: 'block' }}>
                  해당 읍·면 지역 <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  className="search-input"
                  value={selectedRegionId}
                  onChange={(e) => setSelectedRegionId(e.target.value)}
                  style={{ width: '100%' }}
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

            <div style={{ marginBottom: '24px' }}>
              <label className="admin-form-label" style={{ fontWeight: 700, marginBottom: '8px', display: 'block' }}>
                제안 제목 (최대 80자) <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                className="search-input"
                maxLength={80}
                placeholder="제안의 핵심 내용을 핵심 제목으로 입력하세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%' }}
              />
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-sub)', marginTop: '4px' }}>
                {title.length} / 80자
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label className="admin-form-label" style={{ fontWeight: 700, marginBottom: '8px', display: 'block' }}>
                제안 내용 (최대 2,000자) <span style={{ color: 'red' }}>*</span>
              </label>
              <div className="opinion-textarea-wrapper">
                <textarea
                  className="survey-textarea"
                  style={{ minHeight: '220px' }}
                  maxLength={2000}
                  placeholder="### 이런 점이 불편합니다&#10;현장의 문제점이나 불편한 사유를 기술해주세요.&#10;&#10;### 이렇게 바뀌었으면 좋겠습니다&#10;의회나 관공서에 바라는 구체적인 개선 아이디어를 들려주세요."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="textarea-char-counter">{content.length} / 2000자</div>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label className="policy-checkbox-label">
                <input
                  type="checkbox"
                  checked={policyAgreed}
                  onChange={(e) => setPolicyAgreed(e.target.checked)}
                />
                <span>위 유의사항 및 개인정보 보호 지침 안내를 확인하였으며 동의합니다.</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                className="section-btn-action"
                disabled={isSubmitting || !currentUser?.isVerifiedResident}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  background: 'var(--teal)',
                  minHeight: '52px',
                  fontSize: '1.0625rem',
                  opacity: !currentUser?.isVerifiedResident ? 0.6 : 1,
                  cursor: !currentUser?.isVerifiedResident ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? '등록 중...' : '의회에 제안 등록하기 ➔'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="submitted-result-box" style={{ background: 'white', padding: '60px 24px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <div className="success-icon-circle" style={{ background: 'var(--teal-light)', color: 'var(--teal)', margin: '0 auto 20px' }}>
            ✓
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '12px' }}>
            ✓ 이야기를 들려주셔서 감사합니다.
          </h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '1rem', marginBottom: '28px', lineHeight: 1.6 }}>
            등록해주신 소중한 제안은 영광군의회에 접수되어 담당 부서 및 상임위원회에서 적극 검토할 예정입니다.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`/listens/${submittedProposalId}`} className="section-btn-action" style={{ background: 'var(--teal)' }}>
              내가 작성한 이야기 보기
            </Link>
            <Link href="/listens" className="section-btn-action" style={{ background: 'var(--navy)' }}>
              전체 제안 목록으로 이동
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
