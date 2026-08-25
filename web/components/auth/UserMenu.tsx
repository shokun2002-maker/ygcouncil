'use client';

import React, { useState } from 'react';
import { UserSessionProfile } from '@/lib/auth/types';

interface UserMenuProps {
  user: UserSessionProfile;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch {
      window.location.href = '/';
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#F1F5F9',
          border: '1px solid #CBD5E1',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#334155',
          cursor: 'pointer'
        }}
      >
        <span style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: user.isVerifiedResident ? '#059669' : '#2563EB',
          color: 'white',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 700
        }}>
          {user.displayName.slice(0, 1)}
        </span>
        <span>{user.displayName}</span>
        {user.isVerifiedResident ? (
          <span style={{ fontSize: '0.6875rem', background: '#D1FAE5', color: '#065F46', padding: '2px 6px', borderRadius: '10px', fontWeight: 700 }}>
            군민인증
          </span>
        ) : (
          <span style={{ fontSize: '0.6875rem', background: '#E0F2FE', color: '#0369A1', padding: '2px 6px', borderRadius: '10px', fontWeight: 600 }}>
            일반회원
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: 'calc(100% + 8px)',
          width: '220px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
          border: '1px solid #E2E8F0',
          padding: '12px',
          zIndex: 100
        }}>
          <div style={{ paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>{user.displayName}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
              상태: {user.isVerifiedResident ? '영광군민 인증완료' : '카카오 로그인 (군민미인증)'}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '8px 12px',
              fontSize: '0.875rem',
              color: '#EF4444',
              background: 'none',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
