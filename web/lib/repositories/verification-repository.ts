import { createClient } from '@/lib/supabase/server';
import { YGCOUNCIL_TENANT_ID } from '@/lib/config/tenant';

export interface UserVerificationStatus {
  id: string | null;
  identityStatus: 'pending' | 'verified' | 'failed';
  residenceStatus: 'pending' | 'verified' | 'rejected' | 'expired';
  identityMethod: string | null;
  residenceMethod: string | null;
  regionId: string | null;
  regionName: string | null;
  identityVerifiedAt: string | null;
  residenceVerifiedAt: string | null;
  expiresAt: string | null;
  isVerifiedResident: boolean;
}

export async function getUserVerificationStatus(userId: string | undefined): Promise<UserVerificationStatus | null> {
  if (!userId) return null;

  try {
    const supabase = await createClient();

    const { data: verification } = await supabase
      .from('resident_verifications')
      .select('*, regions(name)')
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .eq('user_id', userId)
      .maybeSingle();

    if (!verification) {
      return {
        id: null,
        identityStatus: 'pending',
        residenceStatus: 'pending',
        identityMethod: null,
        residenceMethod: null,
        regionId: null,
        regionName: null,
        identityVerifiedAt: null,
        residenceVerifiedAt: null,
        expiresAt: null,
        isVerifiedResident: false,
      };
    }

    const now = new Date();
    const expiresAtDate = verification.expires_at ? new Date(verification.expires_at) : null;
    const isExpired = expiresAtDate ? expiresAtDate <= now : false;

    const identityVerified = verification.identity_status === 'verified';
    const residenceVerified = verification.residence_status === 'verified' && !isExpired;
    const isVerifiedResident = identityVerified && residenceVerified;

    const regionName = (verification.regions as any)?.name || null;

    return {
      id: verification.id,
      identityStatus: (verification.identity_status as any) || 'pending',
      residenceStatus: isExpired ? 'expired' : ((verification.residence_status as any) || 'pending'),
      identityMethod: verification.identity_method,
      residenceMethod: verification.residence_method,
      regionId: verification.region_id,
      regionName,
      identityVerifiedAt: verification.identity_verified_at,
      residenceVerifiedAt: verification.residence_verified_at,
      expiresAt: verification.expires_at,
      isVerifiedResident,
    };
  } catch (error) {
    console.error('Error fetching user verification status:', error);
    return null;
  }
}
