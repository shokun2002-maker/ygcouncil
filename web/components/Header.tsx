'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserMenu from './auth/UserMenu';
import LoginButton from './auth/LoginButton';
import { UserSessionProfile } from '@/lib/auth/types';

interface HeaderProps {
  currentUser?: UserSessionProfile | null;
}

export default function Header({ currentUser }: HeaderProps) {
  const pathname = usePathname();

  const navItems = [
    { label: '묻습니다', href: '/asks' },
    { label: '듣습니다', href: '/listens' },
    { label: '함께 바꿨습니다', href: '/outcomes' },
  ];

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Brand Area */}
        <Link
          href="/"
          className="header-brand"
          aria-label="영광군의회 열린소통 메인으로 이동"
        >
          <div className="header-brand-badge">
            ON
          </div>
          <div className="header-brand-text">
            영광군의회 <span>열린소통</span>
          </div>
        </Link>

        {/* Navigation Bar */}
        <nav className="header-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`header-nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Header Actions */}
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
