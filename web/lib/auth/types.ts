export type AuthState = 
  | 'anonymous'
  | 'authenticated'
  | 'identity_pending'
  | 'identity_verified'
  | 'residence_pending'
  | 'verified_resident'
  | 'council_staff'
  | 'admin';

export interface UserSessionProfile {
  userId: string;
  displayName: string;
  email?: string;
  role: 'member' | 'council_staff' | 'admin';
  
  // 인증 및 거주지 상태 분리
  isAuthenticated: boolean;
  isIdentityVerified: boolean;
  isResidenceVerified: boolean;
  isVerifiedResident: boolean; // 최종 영광군민 자격 여부
  
  regionId?: string | null;
  regionName?: string | null;
  authState: AuthState;
}

export interface CurrentUserResult {
  user: UserSessionProfile | null;
  rawUser: any | null;
  authState: AuthState;
}
