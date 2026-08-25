'use client';

import React from 'react';
import Link from 'next/link';
import UserMenu from './auth/UserMenu';
import LoginButton from './auth/LoginButton';
import { UserSessionProfile } from '@/lib/auth/types';

interface HeaderProps {
  currentUser?: UserSessionProfile | null;
}

export default function Header({ currentUser }: HeaderProps) {
  return (
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
          {currentUser ? (
            <UserMenu user={currentUser} />
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
}
