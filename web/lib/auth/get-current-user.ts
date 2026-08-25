import { createClient } from '@/lib/supabase/server';
import { getProfileByUserId } from '@/lib/repositories/profile-repository';
import { YGCOUNCIL_TENANT_ID } from '@/lib/config/tenant';
import { CurrentUserResult, AuthState, UserSessionProfile } from './types';

export async function getCurrentUser(): Promise<CurrentUserResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        user: null,
        rawUser: null,
        authState: 'anonymous'
      };
    }

    // 1. Fetch DB Profile & Membership & Verification
    let profile = await getProfileByUserId(user.id);

    // 2. 만약 세션은 존재하는데 Profile 이 생성이 안 되어 있다면 idempotent 보완 등록 실행
    if (!profile) {
      try {
        await supabase.rpc('ensure_member_registration', {
          p_tenant_id: YGCOUNCIL_TENANT_ID
        });
        profile = await getProfileByUserId(user.id);
      } catch (regErr) {
        console.error('Error during fallback member registration:', regErr);
      }
    }

    const role = profile?.role || 'member';
    const isIdentityVerified = profile?.isIdentityVerified ?? false;
    const isResidenceVerified = profile?.isResidenceVerified ?? false;
    const isVerifiedResident = isIdentityVerified && isResidenceVerified;

    let authState: AuthState = 'authenticated';
    if (role === 'admin') {
      authState = 'admin';
    } else if (role === 'council_staff') {
      authState = 'council_staff';
    } else if (isVerifiedResident) {
      authState = 'verified_resident';
    } else if (isIdentityVerified) {
      authState = 'identity_verified';
    }

    // 카카오 OAuth 프로필 메타데이터 fallback
    const kakaoName = user.user_metadata?.name || 
                      user.user_metadata?.full_name || 
                      user.user_metadata?.nickname || 
                      (user.email ? user.email.split('@')[0] : null);

    const displayName = profile?.displayName || kakaoName || '카카오 사용자';

    const userProfile: UserSessionProfile = {
      userId: user.id,
      displayName,
      email: user.email,
      role,
      isAuthenticated: true,
      isIdentityVerified,
      isResidenceVerified,
      isVerifiedResident, // 카카오 로그인 성공 및 회원등록 완료되었어도 verified_resident는 false (군민 인증 별도)
      regionId: profile?.regionId || null,
      authState
    };

    return {
      user: userProfile,
      rawUser: user,
      authState
    };
  } catch (err) {
    console.error('Error fetching current user:', err);
    return {
      user: null,
      rawUser: null,
      authState: 'anonymous'
    };
  }
}
