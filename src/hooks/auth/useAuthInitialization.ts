
import { useState, useCallback, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { useAuthListener } from "./useAuthListener";
import { useSessionInit } from "./useSessionInit";
import type { AdminVerificationState } from "@/context/auth/types";

export interface AuthInitializationProps {
  setSession: (session: Session | null) => void;
  setUser: (user: any) => void;
  setIsLoading: (isLoading: boolean) => void;
  fetchProfile: (userId: string) => Promise<void>;
  setIsProfileLoading: (isLoading: boolean) => void;
  setAdminVerificationState: (state: AdminVerificationState) => void;
}

export function useAuthInitialization({
  setSession,
  setUser,
  setIsLoading,
  fetchProfile,
  setIsProfileLoading,
  setAdminVerificationState
}: AuthInitializationProps) {
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Handle auth state changes callback
  const handleAuthStateChange = useCallback((event: string, currentSession: Session | null) => {
    console.log(`[useAuthInitialization] Auth event: ${event}, user: ${currentSession?.user?.email || "none"}`);
    
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    
    if (currentSession?.user) {
      console.log(`[useAuthInitialization] Auth event processed, fetching profile for: ${currentSession.user.id}`);
      setIsProfileLoading(true);
      
      // Need to reset admin verification state for most events
      if (event !== 'TOKEN_REFRESHED') {
        setAdminVerificationState('pending');
      }
      
      // Fetch profile with slight delay to avoid race conditions
      setTimeout(() => {
        fetchProfile(currentSession.user.id)
          .catch(error => {
            console.error("[useAuthInitialization] Error fetching profile:", error);
          })
          .finally(() => {
            setIsLoading(false);
            setIsInitializing(false);
          });
      }, 100);
    } else {
      // No user session
      setIsLoading(false);
      setIsInitializing(false);
      setAdminVerificationState('unknown');
    }
  }, [
    setSession, 
    setUser, 
    setAdminVerificationState, 
    setIsLoading, 
    setIsProfileLoading, 
    fetchProfile
  ]);
  
  // Set up auth listener
  useAuthListener(handleAuthStateChange);
  
  // Initialize session
  useSessionInit(handleAuthStateChange, isInitializing);

  // Add a safety timeout to prevent infinite loading state
  useEffect(() => {
    if (isInitializing) {
      const timeoutId = setTimeout(() => {
        console.log("[useAuthInitialization] Auth initialization timeout reached, forcing completion");
        setIsLoading(false);
        setIsInitializing(false);
        setAdminVerificationState('unknown');
      }, 5000); // 5 second maximum wait time
      
      return () => clearTimeout(timeoutId);
    }
  }, [isInitializing, setIsLoading, setAdminVerificationState]);
}
