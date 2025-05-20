
import { useState, useEffect, useCallback, useRef } from "react";
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
  const [authInitError, setAuthInitError] = useState<Error | null>(null);
  const authInitializationCalled = useRef(false);

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

  // Add a safety timeout to prevent infinite loading
  useEffect(() => {
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        console.warn("[useAuthState] Loading state timeout reached, forcing completion");
        setIsLoading(false);
      }, 5000); // Reduced from 10 second to 5 second maximum loading time for faster recovery
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading]);
  
  // Use the extracted authentication initialization hook - FIXED: Move to useEffect to ensure consistent hook ordering
  useEffect(() => {
    // Prevent multiple initialization attempts
    if (authInitializationCalled.current) return;
    
    authInitializationCalled.current = true;
    console.log("[useAuthState] Initializing authentication");
    
    try {
      const initProps = {
        setSession,
        setUser,
        setIsLoading,
        fetchProfile,
        setIsProfileLoading: setIsLoading,
        setAdminVerificationState
      };
      
      useAuthInitialization(initProps);
    } catch (error) {
      console.error("[useAuthState] Error in auth initialization:", error);
      setAuthInitError(error as Error);
      setIsLoading(false); // Ensure we don't get stuck in loading state
    }
  }, []);

  // Refresh profile when user changes but is not null
  const handleProfileRefresh = useCallback(() => {
    if (user) {
      console.log("[useAuthState] User changed, refreshing profile");
      refreshProfile().catch(error => {
        console.error("[useAuthState] Error refreshing profile:", error);
      });
    }
  }, [user, refreshProfile]);

  useEffect(() => {
    if (user) {
      // Add a delay to avoid race conditions with other initialization
      const timeoutId = setTimeout(handleProfileRefresh, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [user?.id, handleProfileRefresh]);

  // Force exit from loading state after maximum wait time
  useEffect(() => {
    const maxLoadingTime = 8000; // 8 seconds absolute maximum
    const forceExitTimeout = setTimeout(() => {
      if (isLoading) {
        console.error("[useAuthState] CRITICAL: Force exiting loading state after maximum time");
        setIsLoading(false);
      }
    }, maxLoadingTime);
    
    return () => clearTimeout(forceExitTimeout);
  }, [isLoading]);

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
    authInitError,
    setProfile,
    refreshProfile,
    setIsAdminVerified,
    setAdminVerificationState,
    forceVerifyAdmin
  };
}
