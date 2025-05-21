
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useAuthInitialization } from "./useAuthInitialization";
import { useAuthListener } from "./useAuthListener";
import { useAdminVerification, AdminVerificationState } from "./useAdminVerification";
import { getProfile } from "@/services/profileService";
import type { Profile } from "@/services/profileService";

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  isAdminVerified: boolean;
  adminVerificationState: AdminVerificationState;
  isLoading: boolean;
  error: Error | null;
  setProfile?: (profile: Profile) => void;
  refreshProfile: () => Promise<void>;
}

export const useAuthState = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Initialize auth
  useAuthInitialization({
    setUser,
    setSession,
    setIsLoading,
    onError: (err) => setError(err as Error)
  });

  // Listen for auth changes
  useAuthListener((event, newSession) => {
    setUser(newSession?.user || null);
    setSession(newSession);
  });

  // Admin verification
  const { isAdmin, isVerified, verificationState, verifyAdminStatus } = useAdminVerification(user);

  // Fetch profile when user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }
      
      try {
        setProfileLoading(true);
        const userProfile = await getProfile(user.id);
        setProfile(userProfile);
      } catch (err) {
        console.error("[useAuthState] Error fetching profile:", err);
        setError(err as Error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Refresh profile
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      setProfileLoading(true);
      const userProfile = await getProfile(user.id);
      setProfile(userProfile);
    } catch (err) {
      console.error("[useAuthState] Error refreshing profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  return {
    user,
    session,
    profile,
    isAdmin,
    isAdminVerified: isVerified,
    adminVerificationState: verificationState,
    isLoading: isLoading || profileLoading,
    error,
    setProfile,
    refreshProfile
  };
};
