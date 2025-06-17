
import { useCallback, useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { AuthError } from "@supabase/supabase-js";
import { useProfile } from "./useProfile";
import type { Profile } from "@/services/profileService";
import { AdminVerificationState } from "@/context/auth/types";
import { verifyEnhancedAdminStatus } from "@/services/auth/enhancedAdminService";
import { enhancedAuditLogger } from "@/services/security/enhancedAuditLogger";

export const useEnhancedAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminVerified, setAdminVerified] = useState<AdminVerificationState>("idle");
  const adminCheckInProgress = useRef<boolean>(false);

  // Use the profile hook to manage user profile data
  const {
    profile,
    setProfile,
    isProfileLoading,
    profileError,
    refreshProfile,
  } = useProfile(user);

  // Enhanced admin status check with security logging
  const checkAdminStatus = useCallback(async (userId: string) => {
    if (adminCheckInProgress.current) {
      console.log("[useEnhancedAuthState] Admin check already in progress, skipping");
      return;
    }

    try {
      adminCheckInProgress.current = true;
      setAdminVerified("pending");
      
      // Use the enhanced admin verification service
      const isAdminUser = await verifyEnhancedAdminStatus(userId);
      
      setIsAdmin(isAdminUser);
      setAdminVerified("verified");
      
      console.info(`[useEnhancedAuthState] Admin status verified: ${isAdminUser}`);
    } catch (error) {
      console.error("[useEnhancedAuthState] Admin check exception:", error);
      setIsAdmin(false);
      setAdminVerified("failed");
      
      // Log the security incident
      await enhancedAuditLogger.logSecurityEvent({
        action: 'admin_check_failed',
        resource_type: 'authentication',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        severity: 'high'
      });
    } finally {
      adminCheckInProgress.current = false;
    }
  }, []);

  // Initialize the auth state from Supabase with enhanced security
  const initializeAuth = useCallback(async () => {
    console.info("[useEnhancedAuthState] Starting authentication initialization");
    try {
      // First set up the auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          console.info(`[useEnhancedAuthState] Auth event: ${event}`);
          
          // Log authentication events
          if (event === 'SIGNED_IN' && currentSession?.user) {
            await enhancedAuditLogger.logAuthenticationAttempt(true, currentSession.user.email);
          } else if (event === 'SIGNED_OUT') {
            await enhancedAuditLogger.logAuthenticationAttempt(true, undefined, { event: 'sign_out' });
          }
          
          // Handle auth events securely
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (currentSession?.user) {
              console.info(`[useEnhancedAuthState] User authenticated: ${currentSession.user.email}`);
              setSession(currentSession);
              setUser(currentSession.user);
              
              // Use timeout to prevent potential deadlock and debounce multiple calls
              setTimeout(() => {
                if (!adminCheckInProgress.current) {
                  checkAdminStatus(currentSession.user.id);
                }
              }, 100);
            }
          } else if (event === 'SIGNED_OUT') {
            console.info("[useEnhancedAuthState] User signed out");
            setSession(null);
            setUser(null);
            setIsAdmin(false);
            setAdminVerified("idle");
            setProfile(null);
            adminCheckInProgress.current = false;
          }
        }
      );

      // Then check for existing session
      const { data: { session: currentSession }, error: sessionError } = 
        await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }
      
      if (currentSession) {
        console.info("[useEnhancedAuthState] Initial session check: Session found");
        setSession(currentSession);
        setUser(currentSession.user);
        await checkAdminStatus(currentSession.user.id);
      } else {
        console.info("[useEnhancedAuthState] Initial session check: No session found");
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setAdminVerified("idle");
      }
      
      setIsLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      const authError = error as AuthError;
      console.error("[useEnhancedAuthState] Auth initialization error:", authError);
      
      // Log the security incident
      await enhancedAuditLogger.logSecurityEvent({
        action: 'auth_initialization_failed',
        resource_type: 'authentication',
        details: { error: authError.message },
        severity: 'high'
      });
      
      toast.error("Authentication error. Please try again.");
      setIsLoading(false);
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      setAdminVerified("failed");
    }
  }, [checkAdminStatus, setProfile]);

  useEffect(() => {
    const cleanup = initializeAuth();
    return () => {
      cleanup.then(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
    };
  }, [initializeAuth]);

  return {
    session,
    user,
    profile,
    isLoading: isLoading || isProfileLoading,
    isAdmin,
    isAdminVerified: adminVerified === "verified",
    adminVerificationState: adminVerified,
    refreshProfile,
    setProfile
  };
};

export default useEnhancedAuthState;
