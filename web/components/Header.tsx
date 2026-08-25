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
    { label: '묻습니다', href: '/asks', icon: '🙋‍♂️' },
    { label: '듣습니다', href: '/listens', icon: '💬' },
    { label: '함께 바꿨습니다', href: '/outcomes', icon: '🤝' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.86)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 200ms ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 'var(--container-wide)',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Brand Area */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
          aria-label="영광군의회 열린소통 메인으로 이동"
        >
          <div
            style={{
              background: '#0066CC',
              color: 'white',
              fontWeight: 800,
              fontSize: '0.8125rem',
              padding: '4px 8px',
              borderRadius: '6px',
              letterSpacing: '0.5px',
            }}
          >
            ON
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#1D1D1F', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
              영광군의회 <span style={{ color: '#0066CC' }}>열린소통</span>
            </span>
          </div>
        </Link>

        {/* Navigation Bar */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.9375rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#0066CC' : '#6E6E73',
                  backgroundColor: isActive ? 'rgba(0, 102, 204, 0.08)' : 'transparent',
                  transition: 'all 150ms ease',
                  textDecoration: 'none',
                }}
              >
                <span style={{ marginRight: '6px' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
