
import { Session, User } from "@supabase/supabase-js";
import type { Profile } from "@/services/profileService";
import type { AdminVerificationState } from "@/hooks/useAuthState";

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isAdminVerified: boolean;
  adminVerificationState: AdminVerificationState;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
};
