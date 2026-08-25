'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Modal from './Modal';

export default function Header() {
  const [isKakaoModalOpen, setIsKakaoModalOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="header-container">
          <Link href="/" className="brand-area" aria-label="영광군의회 열린소통 메인으로 이동">
            <div className="brand-symbol">ON</div>
            <div className="brand-titles">
              <span className="brand-title">영광군의회 열린소통</span>
              <span className="brand-sub">군민과 의회가 함께 만드는 영광</span>
            </div>
          </Link>

          <div className="header-actions">
            <button
              id="btn-kakao"
              className="btn-kakao-login"
              aria-label="카카오로 시작하기"
              onClick={() => setIsKakaoModalOpen(true)}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.765c0 2.766 1.832 5.19 4.606 6.556-.2.744-.727 2.693-.833 3.109-.13.513.189.507.397.369.164-.109 2.607-1.77 3.654-2.482.71.103 1.44.158 2.176.158 5.523 0 10-3.477 10-7.765C22 6.477 17.523 3 12 3z" />
              </svg>
              <span>카카오로 시작하기</span>
            </button>
          </div>
        </div>
      </header>

      <Modal
        isOpen={isKakaoModalOpen}
        onClose={() => setIsKakaoModalOpen(false)}
        title="카카오 간편가입 안내"
        desc={`카카오 간편가입 기능은 실제 서비스 구축 시 연동됩니다.\n\n[이용 절차 안내]\n1. 카카오 간편 로그인\n2. 최초 1회 영광군민 본인인증\n3. 안건 수렴 및 자유 제안 참여`}
      />
    </>
  );
}
