
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
  const [sessionRefreshAttempts, setSessionRefreshAttempts] = useState(0);

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

  // Refresh session only once on initial render with improved debouncing
  useEffect(() => {
    if (sessionRefreshAttempts > 0) return;
    
    let didCancel = false;
    const initialRefresh = async () => {
      if (didCancel) return;
      
      setSessionRefreshAttempts(prev => prev + 1);
      console.log(`[useAuthState] Performing initial session refresh`);
      
      try {
        await refreshSession();
      } catch (error) {
        console.error("[useAuthState] Error refreshing session on init:", error);
      }
    };
    
    // Add a longer delay to let auth initialize first
    const timeoutId = setTimeout(initialRefresh, 800);
    
    return () => {
      didCancel = true;
      clearTimeout(timeoutId);
    };
  }, [sessionRefreshAttempts]);

  // Use a more conservative approach for session refresh interval
  useEffect(() => {
    if (!session) return;
    
    console.log("[useAuthState] Setting up session refresh interval");
    
    // Calculate when the session will expire
    const expiresAt = session.expires_at;
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = expiresAt - now;
    
    // Set refresh interval to be more conservative
    // At least 10 minutes before expiry, but not more than every 20 minutes
    const refreshInterval = Math.min(
      Math.max(timeUntilExpiry - 600, 600), // At least 10 min before expiry but min 10 min interval
      1200 // Max 20 minutes
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

  // Refresh profile when user or session changes, with improved debouncing
  useEffect(() => {
    if (!user || !session) return;
    
    let isMounted = true;
    
    const refreshUserProfile = () => {
      console.log("[useAuthState] User or session changed, refreshing profile");
      if (isMounted) refreshProfile();
    };
    
    // Delay profile refresh to avoid race conditions
    const timeoutId = setTimeout(refreshUserProfile, 500);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
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
