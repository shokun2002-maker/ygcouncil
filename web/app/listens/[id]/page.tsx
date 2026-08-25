'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProposalByIdClient } from '@/lib/repositories/listen-repository-client';
import { getAskByIdClient } from '@/lib/repositories/ask-repository-client';
import { getOutcomeByIdClient } from '@/lib/repositories/outcome-repository-client';
import { Proposal, Ask, Outcome, ProposalComment } from '@/lib/types';
import AskCard from '@/components/AskCard';
import Modal from '@/components/Modal';

export default function ListenDetailPage() {
  const params = useParams();
  const listenId = params?.id as string;

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [relatedAsk, setRelatedAsk] = useState<Ask | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [loading, setLoading] = useState(true);

  const [hasEmpathized, setHasEmpathized] = useState(false);
  const [comments, setComments] = useState<ProposalComment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!listenId) return;
      setLoading(true);
      const pData = await getProposalByIdClient(listenId);
      setProposal(pData);

      if (pData?.relatedAskId) {
        const aData = await getAskByIdClient(pData.relatedAskId);
        setRelatedAsk(aData);
      }
      const oData = await getOutcomeByIdClient('outcome-001');
      if (oData && oData.sourceListenId === listenId) {
        setOutcome(oData);
      }
      setLoading(false);
    }
    loadData();
  }, [listenId]);

  if (loading) {
    return (
      <main className="ask-detail-container">
        <div style={{ background: 'white', padding: '60px 24px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontSize: '1.125rem', color: 'var(--navy)' }}>제안 데이터를 불러오는 중입니다...</p>
        </div>
      </main>
    );
  }

  if (!proposal) {
    return (
      <main className="ask-detail-container">
        <div style={{ background: 'white', padding: '60px 24px', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '12px' }}>존재하지 않는 군민 제안입니다.</h2>
          <p style={{ color: 'var(--text-sub)', marginBottom: '24px' }}>요청하신 제안 정보를 찾을 수 없습니다.</p>
          <Link href="/listens" className="section-btn-action" style={{ display: 'inline-flex', background: 'var(--navy)' }}>
            군민 제안 전체보기
          </Link>
        </div>
      </main>
    );
  }

  const currentEmpathyCount = proposal.empathyCount + (hasEmpathized ? 1 : 0);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      alert('⚠️ 의견 내용을 입력해 주세요.');
      return;
    }
    const newComment: ProposalComment = {
      commentId: `cmt-${Date.now()}`,
      authorDisplay: '시연 참여자',
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
    <main className="ask-detail-container">
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
            <span className="demo-tag-pill">※ 시연용 예시 제안</span>
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

          {/* Empathy Action Button */}
          <div style={{ textAlign: 'center', margin: '36px 0' }}>
            <button
              className={`btn-empathy-large ${hasEmpathized ? 'active' : ''}`}
              onClick={() => setHasEmpathized(!hasEmpathized)}
            >
              <span>{hasEmpathized ? '♥' : '♡'}</span>
              <span>{hasEmpathized ? '이 제안에 공감했습니다' : '이 제안에 공감합니다'}</span>
              <span className="empathy-badge-count">({currentEmpathyCount})</span>
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
                <span className="demo-tag-pill" style={{ background: '#DBEAFE', color: 'var(--blue)' }}>
                  ※ 시연용 답변 예시입니다.
                </span>
              </div>
              <p className="admin-response-body">{proposal.adminResponse.content}</p>
              <div className="admin-response-footer">
                <span>답변 부서: <strong>{proposal.adminResponse.department}</strong></span>
                <span>답변 일자: <strong>{proposal.adminResponse.date}</strong></span>
              </div>
            </div>
          )}

          {/* Related Ask Callout */}
          {relatedAsk && (
            <div style={{ marginTop: '32px', padding: '20px', background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--teal)', marginBottom: '6px' }}>
                📢 이 제안에 대해 의회가 군민에게 다시 묻고 있습니다
              </h4>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-sub)', marginBottom: '16px' }}>
                군민 제안을 바탕으로 더 많은 군민의 의견을 듣기 위해 공론화 안건으로 전환하여 수렴 중입니다.
              </p>
              <AskCard item={relatedAsk} />
              <div style={{ marginTop: '12px', textAlign: 'right' }}>
                <Link href={`/asks/${relatedAsk.id}`} className="btn-cross-link btn-link-ask">
                  의견수렴 참여하기 ➔
                </Link>
              </div>
            </div>
          )}

          {/* Related Outcome Callout */}
          {outcome && (
            <div style={{ marginTop: '32px', padding: '20px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#D97706', marginBottom: '6px' }}>
                🎉 이 제안은 이렇게 이어지고 있습니다
              </h4>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-sub)', marginBottom: '12px' }}>
                군민 여러분의 공감과 제안이 의정 활동 및 예산 반영 성과로 추진된 현황을 확인해 보세요.
              </p>
              <Link href={`/outcomes/${outcome.id}`} className="btn-cross-link btn-link-outcome">
                진행 과정 보기 ➔
              </Link>
            </div>
          )}

          {/* Comments Section */}
          <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '2px solid var(--navy)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '20px' }}>
              💬 군민 의견 (<span style={{ color: 'var(--teal)' }}>{comments.length}</span>)
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
                의견 남기기
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
    </main>
  );
}
