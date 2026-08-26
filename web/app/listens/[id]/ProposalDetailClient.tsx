'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Proposal } from '@/lib/types';
import { UserSessionProfile } from '@/lib/auth/types';
import { ProposalEmpathyState, toggleProposalEmpathy } from '@/lib/repositories/proposal-empathy-repository';
import { ProposalCommentItem, getProposalComments, submitProposalComment, deleteMyProposalComment } from '@/lib/repositories/proposal-comment-repository';
import Modal from '@/components/Modal';

interface ProposalDetailClientProps {
  proposal: Proposal;
  currentUser: UserSessionProfile | null;
  initialEmpathyState: ProposalEmpathyState;
  initialComments: ProposalCommentItem[];
}

export default function ProposalDetailClient({
  proposal,
  currentUser,
  initialEmpathyState,
  initialComments,
}: ProposalDetailClientProps) {
  const [empathized, setEmpathized] = useState(initialEmpathyState.empathized);
  const [empathyCount, setEmpathyCount] = useState(initialEmpathyState.empathyCount);
  const [isToggling, setIsToggling] = useState(false);

  const [comments, setComments] = useState<ProposalCommentItem[]>(initialComments);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleToggleEmpathy = async () => {
    if (!currentUser) {
      alert('공감은 카카오 로그인이 필요합니다.');
      return;
    }

    if (!currentUser.isVerifiedResident) {
      alert('공감은 영광군민 인증이 완료된 계정만 가능합니다.\n[군민인증 신청하기] 화면으로 이동합니다.');
      window.location.href = '/verification';
      return;
    }

    if (isToggling) return;
    setIsToggling(true);

    const prevEmpathized = empathized;
    const prevCount = empathyCount;
    setEmpathized(!prevEmpathized);
    setEmpathyCount(prevEmpathized ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      const res = await toggleProposalEmpathy(proposal.id);
      if (!res.success) {
        setEmpathized(prevEmpathized);
        setEmpathyCount(prevCount);
        alert(`공감 처리 실패: ${res.error}`);
      } else {
        if (res.empathized !== undefined) setEmpathized(res.empathized);
        if (res.empathyCount !== undefined) setEmpathyCount(res.empathyCount);
      }
    } catch (err: any) {
      setEmpathized(prevEmpathized);
      setEmpathyCount(prevCount);
      alert('오류 발생: ' + err?.message);
    } finally {
      setIsToggling(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert('댓글 작성은 카카오 로그인이 필요합니다.');
      return;
    }

    if (!currentUser.isVerifiedResident) {
      alert('댓글 작성은 영광군민 인증이 완료된 계정만 가능합니다.\n[군민인증 신청하기] 화면으로 이동합니다.');
      window.location.href = '/verification';
      return;
    }

    if (!commentInput.trim()) {
      alert('댓글 내용을 입력해 주세요.');
      return;
    }

    if (isSubmittingComment) return;
    setIsSubmittingComment(true);

    try {
      const res = await submitProposalComment(proposal.id, commentInput.trim());
      if (!res.success) {
        alert(`댓글 작성 실패: ${res.error}`);
      } else {
        setCommentInput('');
        const updatedList = await getProposalComments(proposal.id);
        setComments(updatedList);
      }
    } catch (err: any) {
      alert('오류 발생: ' + err?.message);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (cid: string) => {
    if (!confirm('작성하신 댓글을 삭제하시겠습니까?')) return;

    try {
      const res = await deleteMyProposalComment(cid);
      if (!res.success) {
        alert(`댓글 삭제 실패: ${res.error}`);
      } else {
        setComments(comments.filter((c) => c.commentId !== cid));
      }
    } catch (err: any) {
      alert('오류 발생: ' + err?.message);
    }
  };

  return (
    <>
      {/* Top Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
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
        <button
          type="button"
          className="btn-apple btn-apple-secondary"
          onClick={() => setIsShareModalOpen(true)}
          style={{ height: '40px', padding: '0 16px', fontSize: '0.9375rem' }}
        >
          공유하기
        </button>
      </div>

      {/* Main Story Proposal Article */}
      <article style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {/* Header */}
        <header style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#00A896', backgroundColor: '#E6F7F5', padding: '4px 12px', borderRadius: '6px' }}>
              {proposal.region} · {proposal.category}
            </span>
            <span className="badge-apple" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
              {proposal.statusText}
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 800,
              lineHeight: 1.25,
              letterSpacing: '-0.03em',
              color: '#1D1D1F',
            }}
          >
            {proposal.title}
          </h1>

          {/* Typography Metadata */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
              fontSize: '1rem',
              color: '#6E6E73',
              paddingTop: '16px',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <span>작성자 <strong style={{ color: '#1D1D1F', fontWeight: 600 }}>{proposal.authorDisplay}</strong></span>
            <span style={{ color: '#C7C7CC' }}>·</span>
            <span>작성일 <strong style={{ color: '#1D1D1F', fontWeight: 600 }}>{proposal.createdAt}</strong></span>
            <span style={{ color: '#C7C7CC' }}>·</span>
            <span>조회 <strong style={{ color: '#1D1D1F', fontWeight: 600 }}>{proposal.viewCount}회</strong></span>
          </div>
        </header>

        {/* Content Story Body */}
        <div style={{ fontSize: '1.1875rem', color: '#1D1D1F', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
          {proposal.content}
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
            }}
          >
            <div>
              <strong style={{ color: '#92400E', fontSize: '1rem' }}>제안 공감 및 댓글은 군민인증이 필요합니다</strong>
              <p style={{ color: '#B45309', fontSize: '0.9375rem', marginTop: '4px' }}>
                카카오 간편 로그인 후 영광군민 인증을 완료하시면 공감과 댓글 작성에 참여하실 수 있습니다.
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
            }}
          >
            <div>
              <strong style={{ color: '#1E40AF', fontSize: '1rem' }}>공감 참여를 위해 영광군민 인증이 필요합니다</strong>
              <p style={{ color: '#1E3A8A', fontSize: '0.9375rem', marginTop: '4px' }}>
                현재 카카오 로그인 상태({currentUser.displayName})이나 군민 미인증 상태입니다.
              </p>
            </div>
            <Link href="/verification" className="btn-apple btn-apple-primary" style={{ height: '44px', padding: '0 20px', fontSize: '0.9375rem' }}>
              군민인증 신청하기
            </Link>
          </div>
        ) : null}

        {/* Empathy Action Box */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '40px 0', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '1.0625rem', color: '#424245', fontWeight: 600 }}>
            이 제안이 영광에 필요한 변화라고 생각하시나요?
          </p>
          <button
            type="button"
            onClick={handleToggleEmpathy}
            disabled={isToggling}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              height: '56px',
              padding: '0 32px',
              borderRadius: '14px',
              border: empathized ? '2px solid #00A896' : '1px solid rgba(0,0,0,0.12)',
              backgroundColor: empathized ? '#E6F7F5' : '#FFFFFF',
              color: empathized ? '#00A896' : '#1D1D1F',
              fontSize: '1.0625rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <span>{empathized ? '공감 완료' : '공감하기'}</span>
            <span style={{ backgroundColor: empathized ? '#00A896' : '#F5F5F7', color: empathized ? '#FFFFFF' : '#1D1D1F', padding: '3px 10px', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 700 }}>
              {empathyCount}
            </span>
          </button>
        </div>

        {/* Timeline Steps Section */}
        {proposal.timeline && proposal.timeline.length > 0 && (
          <div style={{ backgroundColor: '#F5F5F7', borderRadius: '20px', padding: '36px 32px', border: '1px solid rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D1D1F', marginBottom: '24px' }}>
              의회가 이렇게 살펴보는 중입니다
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {proposal.timeline.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: item.status === 'completed' ? '#00A896' : item.status === 'current' ? '#0066CC' : '#E5E5EA',
                      color: '#FFFFFF',
                      fontSize: '0.875rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: item.status === 'pending' ? '#86868B' : '#1D1D1F' }}>
                      {item.step}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#86868B' }}>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Official Response Section */}
        {proposal.adminResponse && (
          <div style={{ backgroundColor: '#F0F6FF', borderRadius: '20px', padding: '36px 32px', border: '1px solid #93C5FD' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0066CC' }}>
                영광군의회 공식 답변 및 조치 계획
              </h3>
            </div>
            <p style={{ fontSize: '1.0625rem', color: '#1D1D1F', lineHeight: 1.7, marginBottom: '20px', whiteSpace: 'pre-line' }}>
              {proposal.adminResponse.content}
            </p>
            <div style={{ fontSize: '0.875rem', color: '#6E6E73', display: 'flex', gap: '20px' }}>
              <span>답변 부서: <strong>{proposal.adminResponse.department}</strong></span>
              <span>답변 일자: <strong>{proposal.adminResponse.date}</strong></span>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingTop: '16px' }}>
          <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#1D1D1F' }}>
            군민 의견 (<span style={{ color: '#00A896' }}>{comments.length}</span>)
          </h3>

          <form onSubmit={handleAddComment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <textarea
              rows={3}
              maxLength={500}
              placeholder="이 제안에 대한 군민 여러분의 의견이나 응원 메시지를 남겨주세요."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                fontSize: '1rem',
                lineHeight: 1.6,
                color: '#1D1D1F',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: '#86868B' }}>{commentInput.length} / 500자</span>
              <button
                type="submit"
                className="btn-apple btn-apple-primary"
                disabled={isSubmittingComment || !currentUser?.isVerifiedResident}
                style={{
                  backgroundColor: '#00A896',
                  height: '44px',
                  padding: '0 24px',
                  fontSize: '0.9375rem',
                  opacity: !currentUser?.isVerifiedResident ? 0.5 : 1,
                  cursor: !currentUser?.isVerifiedResident ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmittingComment ? '의견 남기는 중...' : '의견 작성하기'}
              </button>
            </div>
          </form>

          {/* Comment List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
            {comments.map((cmt) => (
              <div
                key={cmt.commentId}
                style={{
                  padding: '20px 24px',
                  borderRadius: '14px',
                  backgroundColor: '#F5F5F7',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: '#6E6E73' }}>
                  <span style={{ fontWeight: 700, color: '#1D1D1F' }}>{cmt.authorDisplay}</span>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span>{cmt.createdAt}</span>
                    {cmt.isMyComment && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(cmt.commentId)}
                        style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
                <p style={{ fontSize: '1.0625rem', color: '#1D1D1F', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {cmt.content}
                </p>
              </div>
            ))}
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
