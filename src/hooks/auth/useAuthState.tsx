
import { useCallback, useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { AuthError } from "@supabase/supabase-js";
import { useProfile } from "./useProfile";
import type { Profile } from "@/services/profileService";
import { AdminVerificationState } from "@/context/auth/types";
import { verifyAdminStatus } from "@/services/auth/adminService";

export const useAuthState = () => {
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

  // Check admin status securely with deduplication
  const checkAdminStatus = useCallback(async (userId: string) => {
    // Prevent multiple simultaneous admin checks
    if (adminCheckInProgress.current) {
      console.log("[useAuthState] Admin check already in progress, skipping");
      return;
    }

    try {
      adminCheckInProgress.current = true;
      setAdminVerified("pending");
      
      // Use the dedicated admin check service
      const isAdminUser = await verifyAdminStatus(userId);
      
      setIsAdmin(isAdminUser);
      setAdminVerified("verified");
      
      console.info(`[useAuthState] Admin status verified: ${isAdminUser}`);
    } catch (error) {
      console.error("[useAuthState] Admin check exception:", error);
      setIsAdmin(false);
      setAdminVerified("failed");
    } finally {
      adminCheckInProgress.current = false;
    }
  }, []);

  // Initialize the auth state from Supabase - securing the process
  const initializeAuth = useCallback(async () => {
    console.info("[useAuthState] Starting authentication initialization");
    try {
      // First set up the auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          console.info(`[useAuthState] Auth event: ${event}`);
          
          // Handle auth events securely
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (currentSession?.user) {
              console.info(`[useAuthState] User authenticated: ${currentSession.user.email}`);
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
            console.info("[useAuthState] User signed out");
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
        console.info("[useAuthState] Initial session check: Session found");
        setSession(currentSession);
        setUser(currentSession.user);
        await checkAdminStatus(currentSession.user.id);
      } else {
        console.info("[useAuthState] Initial session check: No session found");
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
      console.error("[useAuthState] Auth initialization error:", authError);
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

export default useAuthState;
