'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleKakaoLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo,
          scopes: 'profile_nickname profile_image',
        },
      });

      if (error) {
        console.error('Kakao OAuth error:', error.message);
        alert('카카오 로그인을 시작하지 못했습니다. 다시 시도해 주세요.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Kakao OAuth exception:', err);
      alert('카카오 로그인을 시작하지 못했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <button
      id="btn-kakao"
      type="button"
      className="btn-kakao-login"
      aria-label="카카오로 시작하기"
      onClick={handleKakaoLogin}
      disabled={isLoading}
      style={{
        opacity: isLoading ? 0.7 : 1,
        cursor: isLoading ? 'wait' : 'pointer'
      }}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 3C6.477 3 2 6.477 2 10.765c0 2.766 1.832 5.19 4.606 6.556-.2.744-.727 2.693-.833 3.109-.13.513.189.507.397.369.164-.109 2.607-1.77 3.654-2.482.71.103 1.44.158 2.176.158 5.523 0 10-3.477 10-7.765C22 6.477 17.523 3 12 3z" />
      </svg>
      <span>{isLoading ? '카카오로 연결 중...' : '카카오로 시작하기'}</span>
    </button>
  );
}
