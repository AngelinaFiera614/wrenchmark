
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { refreshSession } from "@/services/auth";
import { Profile } from "@/services/profileService";
import { useAuthInitialization } from "./useAuthInitialization";
import { useProfile } from "./useProfile";
import { useAdminVerification } from "./useAdminVerification";
import type { AdminVerificationState } from "@/context/auth/types";

export { AdminVerificationState };

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
    refreshProfile,
    setProfileCreationAttempted
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

  // Immediately refresh session on initial render with a debounce mechanism
  useEffect(() => {
    let didCancel = false;
    let refreshAttempts = 0;
    const MAX_REFRESH_ATTEMPTS = 2;
    
    const initialRefresh = async () => {
      if (didCancel || refreshAttempts >= MAX_REFRESH_ATTEMPTS) return;
      
      refreshAttempts++;
      console.log(`[useAuthState] Performing session refresh (attempt ${refreshAttempts}/${MAX_REFRESH_ATTEMPTS})`);
      
      try {
        await refreshSession();
      } catch (error) {
        console.error("[useAuthState] Error refreshing session on init:", error);
      }
    };
    
    const timeoutId = setTimeout(initialRefresh, 500); // Small delay to let auth initialize first
    
    return () => {
      didCancel = true;
      clearTimeout(timeoutId);
    };
  }, []);

  // Periodically refresh session to prevent expiration using an adaptive interval
  useEffect(() => {
    if (!session) return;
    
    console.log("[useAuthState] Setting up session refresh interval");
    
    // Calculate when the session will expire
    const expiresAt = session.expires_at;
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = expiresAt - now;
    
    // Refresh at least 5 minutes before expiry, but not more than every 10 minutes
    // This prevents refreshing too often but ensures we refresh before expiry
    const refreshInterval = Math.min(
      Math.max(timeUntilExpiry - 300, 300), // At least 5 min before expiry but min 5 min interval
      600 // Max 10 minutes
    ) * 1000;
    
    console.log(`[useAuthState] Session refresh interval set to ${refreshInterval/1000} seconds`);
    
    const intervalId = setInterval(async () => {
      console.log("[useAuthState] Refreshing auth session");
      try {
        await refreshSession();
      } catch (error) {
        console.error("[useAuthState] Error refreshing session:", error);
      }
    }, refreshInterval);
    
    return () => {
      console.log("[useAuthState] Clearing session refresh interval");
      clearInterval(intervalId);
    };
  }, [session]);

  // Force profile refresh when user or session changes, with debouncing
  useEffect(() => {
    if (user && session) {
      console.log("[useAuthState] User or session changed, refreshing profile");
      refreshProfile();
    }
  }, [user?.id, session?.access_token, refreshProfile]);

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
    setProfileCreationAttempted,
    setIsAdminVerified,
    setAdminVerificationState,
    forceVerifyAdmin
  };
}
