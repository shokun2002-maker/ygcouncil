import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <b>영광군의회 열린소통</b>
          <span>묻고, 듣고, 함께 바꿉니다. (우 57036 전라남도 영광군 영광읍 중앙로 179)</span>
        </div>
        <div className="footer-nav">
          <a href="#">이용안내</a>
          <span>·</span>
          <a href="#">개인정보처리방침</a>
          <span>·</span>
          <Link href="/admin" className="footer-admin-link">
            관리자
          </Link>
        </div>
      </div>
    </footer>
  );
}
