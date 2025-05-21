
import { useState, useEffect, useCallback } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { useAuthInitialization } from "./useAuthInitialization";
import { useAuthListener } from "./useAuthListener";
import { useSessionInit } from "./useSessionInit";
import { useProfile } from "./useProfile";
import { useAdminVerification } from "./useAdminVerification";
import type { Profile } from "@/types";

export function useAuthState() {
  // User and session state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Get profile data
  const { 
    profile, 
    isProfileLoading, 
    refreshProfile 
  } = useProfile(user);

  // Admin verification
  const { 
    isAdmin, 
    isAdminVerified,
    adminVerificationState, 
    setAdminStatus,
    setIsAdminVerified,
    setAdminVerificationState,
    verifyAdminStatus 
  } = useAdminVerification(user, profile);

  // Handle initialization
  useAuthInitialization({ 
    setIsLoading, 
    setUser, 
    setSession, 
    setError
  });

  // Handle session change events
  useAuthListener({ 
    setUser, 
    setSession, 
    setError,
    setAdminVerificationState
  });

  // Initialize auth on page load
  useSessionInit({ 
    setUser, 
    setSession 
  });

  // Handle user changes to refresh profile
  useEffect(() => {
    if (user) {
      console.info("[useAuthState] User changed, refreshing profile");
      refreshProfile();
    }
  }, [user, refreshProfile]);

  return {
    user,
    session,
    profile,
    isAdmin,
    isAdminVerified,
    adminVerificationState,
    isLoading: isLoading || isProfileLoading,
    error,
    setUser,
    refreshProfile,
    verifyAdminStatus
  };
}
