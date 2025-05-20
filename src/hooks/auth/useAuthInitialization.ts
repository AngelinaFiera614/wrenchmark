
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
  setIsProfileLoading: (isLoading: boolean) => void;  // Now this is properly expected
  setAdminVerificationState: (state: AdminVerificationState) => void;
}

// This hook is now only used as a fallback - the main auth logic has been moved to useAuthState
export function useAuthInitialization({
  setSession,
  setUser,
  setIsLoading,
  fetchProfile,
  setIsProfileLoading,
  setAdminVerificationState
}: AuthInitializationProps) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Handle auth state changes callback
  const handleAuthStateChange = useCallback((event: string, currentSession: Session | null) => {
    try {
      console.log(`[useAuthInitialization] Auth event: ${event}, user: ${currentSession?.user?.email || "none"}`);
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log(`[useAuthInitialization] Auth event processed, fetching profile for: ${currentSession.user.id}`);
        setIsProfileLoading(true);
        
        // Need to reset admin verification state for most events
        if (event !== 'TOKEN_REFRESHED') {
          try {
            setAdminVerificationState('pending');
          } catch (error) {
            console.error("[useAuthInitialization] Error setting admin verification state:", error);
          }
        }
        
        // Fetch profile with slight delay to avoid race conditions
        setTimeout(() => {
          fetchProfile(currentSession.user.id)
            .catch(error => {
              console.error("[useAuthInitialization] Error fetching profile:", error);
              setHasError(true);
            })
            .finally(() => {
              try {
                setIsLoading(false);
                setIsInitializing(false);
              } catch (error) {
                console.error("[useAuthInitialization] Error finalizing auth state:", error);
                // Force recovery
                setTimeout(() => {
                  setIsLoading(false);
                  setIsInitializing(false);
                }, 100);
              }
            });
        }, 100);
      } else {
        // No user session
        try {
          setIsLoading(false);
          setIsInitializing(false);
          setAdminVerificationState('unknown');
        } catch (error) {
          console.error("[useAuthInitialization] Error finalizing no-user state:", error);
          setHasError(true);
        }
      }
    } catch (error) {
      console.error("[useAuthInitialization] Critical error in auth state change handler:", error);
      setHasError(true);
      // Force recovery
      setIsLoading(false);
      setIsInitializing(false);
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
    const timeoutId = setTimeout(() => {
      if (isInitializing) {
        console.log("[useAuthInitialization] Auth initialization timeout reached, forcing completion");
        setIsLoading(false);
        setIsInitializing(false);
        setAdminVerificationState('unknown');
      }
    }, 3000); // 3 seconds timeout for faster recovery
    
    return () => clearTimeout(timeoutId);
  }, [isInitializing, setIsLoading, setAdminVerificationState]);

  // Add a longer timeout as a last resort
  useEffect(() => {
    const emergencyTimeoutId = setTimeout(() => {
      if (hasError || isInitializing) {
        console.error("[useAuthInitialization] EMERGENCY TIMEOUT: Forcing auth recovery");
        setIsLoading(false);
        setIsInitializing(false);
        setAdminVerificationState('unknown');
      }
    }, 5000); // 5 seconds emergency timeout
    
    return () => clearTimeout(emergencyTimeoutId);
  }, [hasError, isInitializing, setIsLoading, setAdminVerificationState]);
}
