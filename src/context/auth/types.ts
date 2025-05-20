
import { Session, User } from "@supabase/supabase-js";
import type { Profile } from "@/services/profileService";

// Define a more specific admin verification state
export type AdminVerificationState = 'unknown' | 'pending' | 'verified' | 'failed';

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isAdminVerified: boolean;
  adminVerificationState: AdminVerificationState;
  isLoading: boolean;
  authInitError: Error | null; // Added this property
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  forceAdminVerification: () => Promise<boolean>;
};
