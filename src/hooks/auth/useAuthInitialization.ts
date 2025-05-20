
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
    
    try {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
    } catch (error) {
      console.error("[useAuthInitialization] Error updating session state:", error);
    }
    
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
      }
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
    }, 3000); // Reduced from 5 seconds to 3 seconds for faster recovery
    
    return () => clearTimeout(timeoutId);
  }, [isInitializing, setIsLoading, setAdminVerificationState]);
}
