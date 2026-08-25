'use client';

import React, { useState } from 'react';
import { UserSessionProfile } from '@/lib/auth/types';
import { OutcomeRecord, createOutcome, updateOutcome } from '@/lib/repositories/outcome-repository';

interface AdminOutcomesClientProps {
  currentUser: UserSessionProfile;
  initialOutcomes: OutcomeRecord[];
}

export default function AdminOutcomesClient({
  currentUser,
  initialOutcomes,
}: AdminOutcomesClientProps) {
  const [outcomes, setOutcomes] = useState<OutcomeRecord[]>(initialOutcomes);
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
        alert('🎉 성과 항목이 성공적으로 등록되었습니다.');
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
    <div style={{ display: 'grid', gap: '32px' }}>
      {/* 등록 Form Card */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
          ➕ 신규 성과 등록
        </h2>

        <form onSubmit={handleCreateOutcome} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '6px' }}>
              성과 제목 *
            </label>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="예: 영광읍 중앙시장 보행자 안심 펜스 설치 및 속도제한 완료"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '6px' }}>
                카테고리 *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              >
                <option value="교통">교통</option>
                <option value="청년">청년</option>
                <option value="문화·관광">문화·관광</option>
                <option value="복지">복지</option>
                <option value="환경">환경</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '6px' }}>
                공개 상태 *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              >
                <option value="published">공개 (Published)</option>
                <option value="draft">임시저장 (Draft)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '6px' }}>
              요약 설명 *
            </label>
            <textarea
              required
              maxLength={500}
              rows={2}
              placeholder="군민제안 및 의견수렴을 통해 의회가 반영한 성과 요약"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '6px' }}>
              의회 처리 및 예산 반영 상세 결과 *
            </label>
            <textarea
              required
              rows={4}
              placeholder="조례 제·개정, 예산 확보액, 현장 공사 완료 등 상세 결과"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#F8FAFC', padding: '16px', borderRadius: '8px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '4px', color: '#475569' }}>
                🌱 시작된 시민 제안 UUID (선택)
              </label>
              <input
                type="text"
                placeholder="예: 20000000-0000-0000-0000-000000000001"
                value={sourceProposalId}
                onChange={(e) => setSourceProposalId(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '4px', color: '#475569' }}>
                🙋‍♂️ 연관된 군민 의견수렴 UUID (선택)
              </label>
              <input
                type="text"
                placeholder="예: 10000000-0000-0000-0000-000000000001"
                value={sourceAskId}
                onChange={(e) => setSourceAskId(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              background: '#0F172A',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? '등록 처리 중...' : '성과 등록하기'}
          </button>
        </form>
      </div>

      {/* 성과 목록 Table */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
          📑 등록된 성과 목록 ({outcomes.length}건)
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#F1F5F9', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', borderBottom: '1px solid #CBD5E1' }}>제목</th>
                <th style={{ padding: '10px 12px', borderBottom: '1px solid #CBD5E1' }}>분야</th>
                <th style={{ padding: '10px 12px', borderBottom: '1px solid #CBD5E1' }}>상태</th>
                <th style={{ padding: '10px 12px', borderBottom: '1px solid #CBD5E1' }}>완료일</th>
                <th style={{ padding: '10px 12px', borderBottom: '1px solid #CBD5E1' }}>연결 정보</th>
              </tr>
            </thead>
            <tbody>
              {outcomes.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#0F172A' }}>{item.title}</td>
                  <td style={{ padding: '12px', color: '#475569' }}>{item.category}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      background: item.status === 'published' ? '#DEF7EC' : '#FEF08A',
                      color: item.status === 'published' ? '#03543F' : '#854D0E',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#64748B' }}>{item.outcomeAt}</td>
                  <td style={{ padding: '12px', fontSize: '0.8125rem', color: '#64748B' }}>
                    {item.sourceProposalId ? '💬 제안 연결' : ''} {item.sourceAskId ? '🙋‍♂️ 투표 연결' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
