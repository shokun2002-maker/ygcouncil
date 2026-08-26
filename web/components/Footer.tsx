import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#F5F5F7',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
        padding: '56px 24px 48px',
        marginTop: '80px',
        color: '#6E6E73',
        fontSize: '0.9375rem',
        fontFamily: 'var(--font-main)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-wide)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.3px' }}>
              영광군의회 열린소통 ON
            </div>
            <p style={{ color: '#6E6E73', fontSize: '1rem', lineHeight: 1.65 }}>
              군민의 목소리가 의회의 변화가 됩니다. 묻고, 듣고, 함께 바꿉니다.
            </p>
            <p style={{ color: '#86868B', fontSize: '0.9375rem', lineHeight: 1.5 }}>
              (우 57036) 전라남도 영광군 영광읍 중앙로 179 영광군의회
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '0.9375rem' }}>
            <Link href="/" style={{ color: '#424245', textDecoration: 'none', fontWeight: 500 }}>
              이용안내
            </Link>
            <span style={{ color: '#C7C7CC' }}>·</span>
            <Link href="/" style={{ color: '#424245', textDecoration: 'none', fontWeight: 600 }}>
              개인정보처리방침
            </Link>
            <span style={{ color: '#C7C7CC' }}>·</span>
            <Link href="/admin" style={{ color: '#0066CC', textDecoration: 'none', fontWeight: 700 }}>
              관리자 모드
            </Link>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            color: '#86868B',
            fontSize: '0.875rem',
          }}
        >
          <span>Copyright © 2026 Yeonggwang County Council. All rights reserved.</span>
          <span>전남 영광군 열린 소통 플랫폼 V4.5</span>
        </div>
      </div>
    </footer>
  );
}
