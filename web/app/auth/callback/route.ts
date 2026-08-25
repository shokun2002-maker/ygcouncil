import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { YGCOUNCIL_TENANT_ID } from '@/lib/config/tenant';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  // Open Redirect 취약점 방어: 내부 상대 경로만 허용 ('/'로 시작하되 '//'나 외부 domain 금지)
  let safeRedirectPath = '/';
  if (next.startsWith('/') && !next.startsWith('//') && !next.includes(':\\')) {
    safeRedirectPath = next;
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 최초 로그인 성공 시 Profiles & Member Membership 자동 수립 (Idempotent RPC)
      try {
        await supabase.rpc('ensure_member_registration', {
          p_tenant_id: YGCOUNCIL_TENANT_ID
        });
      } catch (regErr) {
        console.error('Failed to auto register member profile:', regErr);
        // 프로필 등록 실패 시 안전하게 에러 리다이렉트
        return NextResponse.redirect(`${origin}/auth/error`);
      }

      return NextResponse.redirect(`${origin}${safeRedirectPath}`);
    }
  }

  // Auth exchange 실패 시 에러 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/auth/error`);
}
