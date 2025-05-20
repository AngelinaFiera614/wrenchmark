
import { useState, useEffect, useCallback, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { Profile } from "@/services/profileService";
import { useProfile } from "./useProfile";
import { useAdminVerification } from "./useAdminVerification";
import type { AdminVerificationState } from "@/context/auth/types";

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitError, setAuthInitError] = useState<Error | null>(null);
  const authInitCalled = useRef(false);

  // Use the extracted profile management hook
  const {
    profile,
    setProfile,
    isProfileLoading,
    setIsProfileLoading,  // Now properly available from useProfile
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

  // Initialize authentication - IMPORTANT: Moving this inside useEffect to fix hook ordering
  useEffect(() => {
    // Prevent multiple initialization attempts
    if (authInitCalled.current) return;
    
    authInitCalled.current = true;
    console.log("[useAuthState] Starting authentication initialization");
    
    const initializeAuth = async () => {
      try {
        // Import the auth initialization dynamically to avoid hook ordering issues
        const { supabase } = await import("@/integrations/supabase/client");

        // Set up auth state listener
        console.log("[useAuthState] Setting up auth state listener");
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log(`[useAuthState] Auth event: ${event}`);
            
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            
            if (currentSession?.user) {
              console.log(`[useAuthState] User authenticated: ${currentSession.user.email}`);
              setIsProfileLoading(true);
              
              // Reset admin verification state on new auth events except token refresh
              if (event !== 'TOKEN_REFRESHED') {
                setAdminVerificationState('pending');
              }
              
              // Fetch profile with slight delay to avoid race conditions
              setTimeout(() => {
                fetchProfile(currentSession.user.id)
                  .catch(error => {
                    console.error("[useAuthState] Error fetching profile:", error);
                  })
                  .finally(() => {
                    setIsLoading(false);
                  });
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
        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          setAdminVerificationState('pending');
          
          // Fetch profile for initial session
          setTimeout(() => {
            fetchProfile(initialSession.user.id)
              .catch(error => {
                console.error("[useAuthState] Error fetching profile on init:", error);
              })
              .finally(() => {
                setIsLoading(false);
              });
          }, 100);
        } else {
          // No initial session
          setIsLoading(false);
        }

        // Cleanup function
        return () => {
          console.log("[useAuthState] Cleaning up auth subscription");
          subscription.unsubscribe();
        };
      } catch (error: any) {
        console.error("[useAuthState] Error in auth initialization:", error);
        setAuthInitError(error);
        setIsLoading(false);
      }
    };
    
    // Start initialization
    initializeAuth();
  }, []); // Empty dependency array since this should only run once

  // Add a safety timeout to prevent infinite loading state
  useEffect(() => {
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        console.warn("[useAuthState] Loading state timeout reached, forcing completion");
        setIsLoading(false);
      }, 5000); // 5 second maximum loading time for recovery
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading]);

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
