'use client';

import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  desc: string;
  showShareActions?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  desc,
  showShareActions = false,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('✅ 주소가 클립보드에 복사되었습니다.');
    } catch {
      alert('주소 복사에 실패했습니다.');
    }
  };

  const handleFbShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  const handleKakaoShare = () => {
    alert('카카오톡 공유 기능은 실제 Kakao JavaScript SDK API 키 발급 후 연동됩니다.');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '32px',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#F5F5F7',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            fontSize: '1.25rem',
            lineHeight: 1,
            color: '#6E6E73',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ×
        </button>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D1D1F', marginBottom: '12px' }}>
          {title}
        </h3>
        <p style={{ color: '#6E6E73', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '24px', whiteSpace: 'pre-line' }}>
          {desc}
        </p>

        {showShareActions && (
          <div style={{ display: 'grid', gap: '10px' }}>
            <button className="btn-apple btn-apple-secondary" style={{ width: '100%' }} onClick={handleKakaoShare}>
              카카오톡 공유
            </button>
            <button className="btn-apple btn-apple-secondary" style={{ width: '100%' }} onClick={handleFbShare}>
              페이스북 공유
            </button>
            <button className="btn-apple btn-apple-primary" style={{ width: '100%' }} onClick={handleCopyLink}>
              링크 복사하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
