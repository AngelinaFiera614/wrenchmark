
import { useState, useEffect, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useProfile } from "./useProfile";
import { useAdminVerification } from "./useAdminVerification";
import { supabase } from "@/integrations/supabase/client";
import type { AdminVerificationState } from "@/context/auth/types";

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitError, setAuthInitError] = useState<Error | null>(null);
  
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
    isAdmin,
    isAdminVerified,
    adminVerificationState,
    setIsAdminVerified,
    setAdminVerificationState,
    verifyAdminStatus
  } = useAdminVerification(user, profile);

  // Initialize authentication
  useEffect(() => {
    let isMounted = true;
    console.log("[useAuthState] Starting authentication initialization");
    
    const initializeAuth = async () => {
      try {
        // Set up auth state listener
        console.log("[useAuthState] Setting up auth state listener");
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            if (!isMounted) return;
            
            console.log(`[useAuthState] Auth event: ${event}`);
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            
            if (currentSession?.user) {
              console.log(`[useAuthState] User authenticated: ${currentSession.user.email}`);
              
              // Reset admin verification state on new auth events except token refresh
              if (event !== 'TOKEN_REFRESHED') {
                setAdminVerificationState('pending');
              }
              
              // Fetch profile with slight delay to avoid race conditions
              setTimeout(() => {
                if (isMounted) {
                  fetchProfile(currentSession.user.id);
                }
              }, 100);
            } else {
              // No user session
              console.log("[useAuthState] No user session detected");
              setIsLoading(false);
              setAdminVerificationState('unknown');
            }
          }
        );

        // Initial session check
        console.log("[useAuthState] Checking for existing session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("[useAuthState] Session check error:", error);
          throw error;
        }
        
        const initialSession = data.session;
        console.log(`[useAuthState] Initial session check: ${initialSession ? 'Session found' : 'No session'}`);
        
        // Process initial session if exists
        if (initialSession?.user && isMounted) {
          setSession(initialSession);
          setUser(initialSession.user);
          setAdminVerificationState('pending');
          
          // Fetch profile for initial session
          setTimeout(() => {
            if (isMounted) {
              fetchProfile(initialSession.user.id)
                .finally(() => {
                  if (isMounted) {
                    setIsLoading(false);
                  }
                });
            }
          }, 100);
        } else if (isMounted) {
          // No initial session
          setIsLoading(false);
        }

        // Cleanup function
        return () => {
          subscription.unsubscribe();
        };
      } catch (error: any) {
        console.error("[useAuthState] Error in auth initialization:", error);
        if (isMounted) {
          setAuthInitError(error);
          setIsLoading(false);
        }
      }
    };
    
    // Start initialization
    initializeAuth();
    
    // Add a safety timeout to prevent infinite loading state
    const timeoutId = setTimeout(() => {
      if (isMounted && isLoading) {
        console.warn("[useAuthState] Loading state timeout reached, forcing completion");
        setIsLoading(false);
      }
    }, 5000);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []); // Empty dependency array since this should only run once

  return {
    session,
    user,
    profile,
    isAdmin,
    isAdminVerified,
    adminVerificationState,
    isLoading: isLoading || isProfileLoading,
    profileError,
    authInitError,
    setProfile,
    refreshProfile,
    setIsAdminVerified,
    setAdminVerificationState,
    verifyAdminStatus
  };
}
