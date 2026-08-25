import { createClient } from '@/lib/supabase/server';
import { YGCOUNCIL_TENANT_ID } from '@/lib/config/tenant';

export interface UserProfileData {
  userId: string;
  displayName: string;
  role: 'member' | 'council_staff' | 'admin';
  isIdentityVerified: boolean;
  isResidenceVerified: boolean;
  regionId: string | null;
}

export async function getProfileByUserId(userId: string | undefined): Promise<UserProfileData | null> {
  if (!userId) return null;

  try {
    const supabase = await createClient();

    // 1. Fetch Profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!profile) return null;

    // 2. Fetch Tenant Membership
    const { data: membership } = await supabase
      .from('tenant_memberships')
      .select('*')
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .eq('user_id', userId)
      .maybeSingle();

    // 3. Fetch Resident Verification Status
    const { data: verification } = await supabase
      .from('resident_verifications')
      .select('*')
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .eq('user_id', userId)
      .maybeSingle();

    const role = (membership?.role as 'member' | 'council_staff' | 'admin') || 'member';
    const isIdentityVerified = verification?.identity_status === 'verified';

    const now = new Date();
    const expiresAtDate = verification?.expires_at ? new Date(verification.expires_at) : null;
    const isExpired = expiresAtDate ? expiresAtDate <= now : false;

    const isResidenceVerified = verification?.residence_status === 'verified' && !isExpired;
    const regionId = verification?.region_id ?? null;

    return {
      userId: profile.user_id,
      displayName: profile.display_name || '군민',
      role,
      isIdentityVerified,
      isResidenceVerified,
      regionId
    };
  } catch (error) {
    console.error('Error in getProfileByUserId:', error);
    return null;
  }
}
