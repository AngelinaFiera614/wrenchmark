
import { useState, useEffect, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { Profile } from "@/services/profileService";
import { useAuthInitialization } from "./useAuthInitialization";
import { useProfile } from "./useProfile";
import { useAdminVerification } from "./useAdminVerification";
import type { AdminVerificationState } from "@/context/auth/types";

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use the extracted profile management hook
  const {
    profile,
    setProfile,
    isProfileLoading,
    profileError,
    fetchProfile,
    refreshProfile
  } = useProfile(user);
  
  // Use the extracted admin verification hook
  const {
    adminStatus: isAdmin,
    isAdminVerified,
    adminVerificationState,
    setIsAdminVerified,
    setAdminVerificationState,
    forceVerifyAdmin
  } = useAdminVerification(user, profile);
  
  // Use the extracted authentication initialization hook
  useAuthInitialization({
    setSession,
    setUser,
    setIsLoading,
    fetchProfile,
    setIsProfileLoading: setIsLoading,
    setAdminVerificationState
  });

  // Refresh profile when user changes but is not null
  const handleProfileRefresh = useCallback(() => {
    if (user) {
      console.log("[useAuthState] User changed, refreshing profile");
      refreshProfile();
    }
  }, [user, refreshProfile]);

  useEffect(() => {
    if (user) {
      // Add a delay to avoid race conditions with other initialization
      const timeoutId = setTimeout(handleProfileRefresh, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [user?.id, handleProfileRefresh]);

  return {
    session,
    user,
    profile,
    isAdmin,
    isAdminVerified,
    adminVerificationState,
    isLoading: isLoading || isProfileLoading,
    isProfileLoading,
    profileError,
    setProfile,
    refreshProfile,
    setIsAdminVerified,
    setAdminVerificationState,
    forceVerifyAdmin
  };
}
