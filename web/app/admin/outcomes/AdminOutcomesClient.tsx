'use client';

import React, { useState } from 'react';
import { UserSessionProfile } from '@/lib/auth/types';
import { OutcomeRecord, createOutcome } from '@/lib/repositories/outcome-repository';

interface AdminOutcomesClientProps {
  currentUser: UserSessionProfile;
  initialOutcomes: OutcomeRecord[];
}

export default function AdminOutcomesClient({
  initialOutcomes,
}: AdminOutcomesClientProps) {
  const [outcomes] = useState<OutcomeRecord[]>(initialOutcomes);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [result, setResult] = useState('');
  const [category, setCategory] = useState('교통');
  const [status, setStatus] = useState('published');
  const [sourceProposalId, setSourceProposalId] = useState('');
  const [sourceAskId, setSourceAskId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateOutcome = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !summary.trim() || !result.trim()) {
      alert('⚠️ 성과 제목, 요약, 결과를 모두 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createOutcome({
        title: title.trim(),
        summary: summary.trim(),
        result: result.trim(),
        category,
        status,
        sourceProposalId: sourceProposalId.trim() || undefined,
        sourceAskId: sourceAskId.trim() || undefined,
      });

      if (!res.success) {
        alert(`성과 등록 실패: ${res.error}`);
      } else {
        alert('성과 항목이 성공적으로 등록되었습니다.');
        setTitle('');
        setSummary('');
        setResult('');
        setSourceProposalId('');
        setSourceAskId('');
        window.location.reload();
      }
    } catch (err: any) {
      alert('오류 발생: ' + err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* 1. Outcomes Admin List */}
      <div className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D1D1F' }}>
            등록된 의정 성과 사례 ({outcomes.length}건)
          </h2>
          <span style={{ fontSize: '0.8125rem', color: '#86868B' }}>
            ※ Public 정책: published / completed / active
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F5F5F7', borderBottom: '1px solid rgba(0,0,0,0.06)', color: '#6E6E73', fontSize: '0.8125rem' }}>
                <th style={{ padding: '12px 16px' }}>성과 제목</th>
                <th style={{ padding: '12px 16px' }}>분야</th>
                <th style={{ padding: '12px 16px' }}>상태</th>
                <th style={{ padding: '12px 16px' }}>완료 및 공개일</th>
                <th style={{ padding: '12px 16px' }}>스토리 연결 정보</th>
              </tr>
            </thead>
            <tbody>
              {outcomes.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1D1D1F' }}>{item.title}</td>
                  <td style={{ padding: '12px 16px', color: '#6E6E73' }}>{item.category}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge-apple" style={{
                      backgroundColor: item.status === 'published' ? '#D1FAE5' : '#FEF3C7',
                      color: item.status === 'published' ? '#059669' : '#D97706'
                    }}>
                      {item.status === 'published' ? '공개' : '임시저장'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#86868B', fontSize: '0.8125rem' }}>{item.outcomeAt}</td>
                  <td style={{ padding: '12px 16px', fontSize: '0.8125rem', color: '#6E6E73' }}>
                    {item.sourceProposalId ? '💬 시민 제안' : ''} {item.sourceAskId ? ' 🙋‍♂️ 군민 의견수렴' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Outcome Creation Form with 4 Visual Sections */}
      <div className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D1D1F' }}>
            신규 성과 등록
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6E6E73', marginTop: '4px' }}>
            군민의 참여가 만든 실제 성과 스토리를 등록하고 공개합니다.
          </p>
        </div>

        <form onSubmit={handleCreateOutcome} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Section 1: Basic Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0066CC', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '8px' }}>
              01 기본 정보
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1D1D1F' }}>
                성과 제목 <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                maxLength={100}
                placeholder="예: 영광읍 중앙시장 보행자 안심 펜스 설치 및 속도제한 완료"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  fontSize: '0.9375rem',
                  color: '#1D1D1F',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1D1D1F' }}>
                  카테고리 <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    height: '44px',
                    padding: '0 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    fontSize: '0.875rem',
                    color: '#1D1D1F',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                  }}
                >
                  <option value="교통">교통</option>
                  <option value="청년">청년</option>
                  <option value="문화·관광">문화·관광</option>
                  <option value="복지">복지</option>
                  <option value="환경">환경</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1D1D1F' }}>
                  공개 설정 <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{
                    width: '100%',
                    height: '44px',
                    padding: '0 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    fontSize: '0.875rem',
                    color: '#1D1D1F',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                  }}
                >
                  <option value="published">공개 (Published)</option>
                  <option value="draft">임시저장 (Draft)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0066CC', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '8px' }}>
              02 성과 및 결과 내용
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1D1D1F' }}>
                요약 설명 <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <textarea
                required
                maxLength={500}
                rows={2}
                placeholder="군민제안 및 의견수렴을 통해 의회가 반영한 성과 요약"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.5,
                  color: '#1D1D1F',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1D1D1F' }}>
                의회 처리 및 예산 반영 결과 (무엇이 달라졌나요?) <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="조례 제·개정, 예산 확보액, 현장 공사 완료 등 상세 결과"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  color: '#1D1D1F',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Section 3: Story Source Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#F5F5F7', padding: '20px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1D1D1F' }}>
              03 스토리 출발점 연결 (선택)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#6E6E73' }}>
                  시작된 시민 제안 ID (UUID)
                </label>
                <input
                  type="text"
                  placeholder="예: 20000000-0000-0000-0000-000000000001"
                  value={sourceProposalId}
                  onChange={(e) => setSourceProposalId(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    fontSize: '0.875rem',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#6E6E73' }}>
                  연관된 군민 의견수렴 ID (UUID)
                </label>
                <input
                  type="text"
                  placeholder="예: 10000000-0000-0000-0000-000000000001"
                  value={sourceAskId}
                  onChange={(e) => setSourceAskId(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    fontSize: '0.875rem',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-apple btn-apple-primary"
            style={{
              backgroundColor: '#0066CC',
              height: '48px',
              fontSize: '1rem',
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            {isSubmitting ? '성과 등록 중...' : '의정 성과 등록하기 ➔'}
          </button>
        </form>
      </div>
    </div>
  );
}
