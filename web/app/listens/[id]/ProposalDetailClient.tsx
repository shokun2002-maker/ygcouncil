'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Proposal, Ask, Outcome, ProposalComment } from '@/lib/types';
import { UserSessionProfile } from '@/lib/auth/types';
import { ProposalEmpathyState, toggleProposalEmpathy } from '@/lib/repositories/proposal-empathy-repository';
import AskCard from '@/components/AskCard';
import Modal from '@/components/Modal';

interface ProposalDetailClientProps {
  proposal: Proposal;
  currentUser: UserSessionProfile | null;
  initialEmpathyState: ProposalEmpathyState;
}

export default function ProposalDetailClient({
  proposal,
  currentUser,
  initialEmpathyState,
}: ProposalDetailClientProps) {
  const [empathized, setEmpathized] = useState(initialEmpathyState.empathized);
  const [empathyCount, setEmpathyCount] = useState(initialEmpathyState.empathyCount);
  const [isToggling, setIsToggling] = useState(false);

  const [comments, setComments] = useState<ProposalComment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleToggleEmpathy = async () => {
    if (!currentUser) {
      alert('🔒 공감은 카카오 로그인이 필요합니다.');
      return;
    }

    if (!currentUser.isVerifiedResident) {
      alert('🪪 공감은 영광군민 인증이 완료된 계정만 가능합니다.\n[군민인증 신청하기] 화면으로 이동합니다.');
      window.location.href = '/verification';
      return;
    }

    if (isToggling) return;
    setIsToggling(true);

    // Optimistic Update
    const prevEmpathized = empathized;
    const prevCount = empathyCount;
    setEmpathized(!prevEmpathized);
    setEmpathyCount(prevEmpathized ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      const res = await toggleProposalEmpathy(proposal.id);
      if (!res.success) {
        // Rollback
        setEmpathized(prevEmpathized);
        setEmpathyCount(prevCount);
        alert(`공감 처리 실패: ${res.error}`);
      } else {
        if (res.empathized !== undefined) setEmpathized(res.empathized);
        if (res.empathyCount !== undefined) setEmpathyCount(res.empathyCount);
      }
    } catch (err: any) {
      // Rollback
      setEmpathized(prevEmpathized);
      setEmpathyCount(prevCount);
      alert('오류 발생: ' + err?.message);
    } finally {
      setIsToggling(false);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      alert('⚠️ 의견 내용을 입력해 주세요.');
      return;
    }
    const newComment: ProposalComment = {
      commentId: `cmt-${Date.now()}`,
      authorDisplay: currentUser?.displayName || '시연 참여자',
      text: commentInput.trim(),
      createdAt: new Date().toLocaleDateString('ko-KR'),
      isLocalUser: true,
    };
    setComments([...comments, newComment]);
    setCommentInput('');
  };

  const handleDeleteComment = (cid: string) => {
    if (confirm('작성하신 의견을 삭제하시겠습니까?')) {
      setComments(comments.filter((c) => c.commentId !== cid));
    }
  };

  return (
    <>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/listens" className="btn-share" style={{ fontSize: '0.9375rem', fontWeight: 700 }}>
          ← 전체 목록으로 돌아가기
        </Link>
        <button className="btn-share" onClick={() => setIsShareModalOpen(true)}>
          ↗ 공유
        </button>
      </div>

      <article className="ask-detail-card">
        {/* Header */}
        <div className="ask-detail-header">
          <div className="ask-detail-meta">
            <span className="section-tag listen-tag">듣습니다</span>
            <span className="card-category">{proposal.region} · {proposal.category}</span>
            <span className="badge-status status-review">{proposal.statusText}</span>
            {proposal.isDemo && <span className="demo-tag-pill">※ 시연용 예시 제안</span>}
          </div>

          <h1 className="ask-detail-title">{proposal.title}</h1>

          <div className="ask-detail-info-bar">
            <span>👤 작성자: <strong>{proposal.authorDisplay}</strong></span>
            <span>📅 작성일: <strong>{proposal.createdAt}</strong></span>
            <span>👁️ 조회: <strong>{proposal.viewCount}회</strong></span>
          </div>
        </div>

        {/* Content Body */}
        <div className="ask-detail-body">
          <div style={{ whiteSpace: 'pre-line', fontSize: '1.0625rem', color: 'var(--text)', lineHeight: 1.8, marginBottom: '36px' }}>
            {proposal.content}
          </div>

          {/* 권한 안내 Banner */}
          {!currentUser ? (
            <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', padding: '14px 18px', borderRadius: '10px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ color: '#92400E', fontSize: '0.875rem' }}>🔒 제안 공감은 영광군민 인증이 필요합니다.</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8125rem', color: '#B45309' }}>카카오 간편 로그인 후 영광군민 인증을 완료해 주세요.</p>
              </div>
              <Link href="/" style={{ background: '#FEE500', color: '#191919', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontWeight: 700, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                카카오 로그인
              </Link>
            </div>
          ) : !currentUser.isVerifiedResident ? (
            <div style={{ background: '#EFF6FF', border: '1px solid #93C5FD', padding: '14px 18px', borderRadius: '10px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ color: '#1E40AF', fontSize: '0.875rem' }}>🪪 제안 공감을 위해 영광군민 인증이 필요합니다.</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8125rem', color: '#1E3A8A' }}>현재 일반회원 상태입니다.</p>
              </div>
              <Link href="/verification" style={{ background: '#2563EB', color: 'white', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontWeight: 700, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                군민인증 신청 ➔
              </Link>
            </div>
          ) : null}

          {/* Empathy Action Button */}
          <div style={{ textAlign: 'center', margin: '36px 0' }}>
            <button
              className={`btn-empathy-large ${empathized ? 'active' : ''}`}
              onClick={handleToggleEmpathy}
              disabled={isToggling}
              style={{
                opacity: isToggling ? 0.7 : 1,
                cursor: 'pointer'
              }}
            >
              <span>{empathized ? '♥' : '♡'}</span>
              <span>{empathized ? '이 제안에 공감했습니다' : '이 제안에 공감합니다'}</span>
              <span className="empathy-badge-count">({empathyCount})</span>
            </button>
          </div>

          {/* Timeline Steps */}
          {proposal.timeline && proposal.timeline.length > 0 && (
            <div className="timeline-container">
              <div className="timeline-title">
                <span>🗺️ 의회가 이렇게 듣고 있습니다</span>
              </div>
              <div className="timeline-list">
                {proposal.timeline.map((item, idx) => (
                  <div
                    key={idx}
                    className={`timeline-step-item ${
                      item.status === 'completed'
                        ? 'completed'
                        : item.status === 'current'
                        ? 'current'
                        : ''
                    }`}
                  >
                    <div className="timeline-step-icon">
                      {item.status === 'completed' ? '✓' : item.status === 'current' ? '●' : '○'}
                    </div>
                    <div className="timeline-step-content">
                      <span className="timeline-step-label">{item.step}</span>
                      <span className="timeline-step-date">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Response Box */}
          {proposal.adminResponse && (
            <div className="admin-response-box" style={{ display: 'block', margin: '32px 0' }}>
              <div className="admin-response-title">
                <span>🏛️ 영광군의회 공식 답변 및 조치 계획</span>
                {proposal.isDemo && (
                  <span className="demo-tag-pill" style={{ background: '#DBEAFE', color: 'var(--blue)' }}>
                    ※ 시연용 답변 예시입니다.
                  </span>
                )}
              </div>
              <p className="admin-response-body">{proposal.adminResponse.content}</p>
              <div className="admin-response-footer">
                <span>답변 부서: <strong>{proposal.adminResponse.department}</strong></span>
                <span>답변 일자: <strong>{proposal.adminResponse.date}</strong></span>
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '2px solid var(--navy)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '20px' }}>
              💬 군민 의견 (<span style={{ color: 'var(--teal)' }}>{comments.length}</span>)
              <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 400, marginLeft: '8px' }}>
                (※ 댓글 작성 기능은 다음 단계 연동 예정)
              </span>
            </h3>

            <form onSubmit={handleAddComment} style={{ marginBottom: '28px' }}>
              <div className="opinion-textarea-wrapper" style={{ marginBottom: '12px' }}>
                <textarea
                  className="survey-textarea"
                  style={{ minHeight: '80px' }}
                  maxLength={500}
                  placeholder="이 제안에 대한 군민 여러분의 의견이나 응원 메시지를 남겨주세요."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />
              </div>
              <button type="submit" className="section-btn-action" style={{ background: 'var(--teal)', minHeight: '44px' }}>
                의견 남기기 (시연)
              </button>
            </form>

            <div className="comments-list">
              {comments.map((cmt) => (
                <div key={cmt.commentId} className="comment-item">
                  <div className="comment-meta">
                    <span className="comment-author">
                      👤 {cmt.authorDisplay} <span className="demo-tag-pill" style={{ fontSize: '0.6875rem' }}>시연 참여자</span>
                    </span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span>{cmt.createdAt}</span>
                      {cmt.isLocalUser && (
                        <button
                          className="btn-delete-comment"
                          onClick={() => handleDeleteComment(cmt.commentId)}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="comment-body">{cmt.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>

      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="공유하기"
        desc={`「${proposal.title}」 제안을 주변 군민들과 공유해 보세요.`}
        showShareActions={true}
      />
    </>
  );
}
