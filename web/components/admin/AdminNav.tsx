'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: '대시보드' },
    { href: '/admin/verifications', label: '군민인증 관리' },
    { href: '/admin/outcomes', label: '성과 관리' },
  ];

  return (
    <nav style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid rgba(0, 0, 0, 0.08)', paddingBottom: '12px' }}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.9375rem',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#0066CC' : '#6E6E73',
              backgroundColor: isActive ? '#EBF5FF' : 'transparent',
              textDecoration: 'none',
              transition: 'all 150ms ease',
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
