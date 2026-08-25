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
      alert('✅ 게시글 주소가 클립보드에 복사되었습니다.');
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
    <div className="modal-backdrop active" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="btn-modal-close" onClick={onClose} aria-label="닫기">
          ×
        </button>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
        </div>
        <p className="modal-desc" style={{ whiteSpace: 'pre-line' }}>
          {desc}
        </p>

        {showShareActions && (
          <div className="modal-actions" style={{ display: 'grid' }}>
            <button className="btn-share-option btn-share-kakao" onClick={handleKakaoShare}>
              <span>🟡 카카오톡</span>
            </button>
            <button className="btn-share-option btn-share-fb" onClick={handleFbShare}>
              <span>🟦 페이스북</span>
            </button>
            <button className="btn-share-option btn-share-copy" onClick={handleCopyLink}>
              <span>🔗 링크 복사</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
