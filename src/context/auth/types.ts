import { User, Session } from "@supabase/supabase-js";
import type { Profile } from "@/services/profileService";

export type AdminVerificationState = "unknown" | "pending" | "verified" | "failed" | "idle";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  isAdminVerified: boolean;
  adminVerificationState: AdminVerificationState;
  isLoading: boolean;
  authError: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}
