
import { useCallback, useEffect, useState } from "react";
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

  // Use the profile hook to manage user profile data
  const {
    profile,
    setProfile,
    isProfileLoading,
    profileError,
    refreshProfile,
  } = useProfile(user);

  // Check admin status securely
  const checkAdminStatus = useCallback(async (userId: string) => {
    try {
      setAdminVerified("pending");
      
      // Use the dedicated admin check service
      const isAdminUser = await verifyAdminStatus(userId);
      
      setIsAdmin(isAdminUser);
      setAdminVerified("verified");
      
      console.info(`[useAuthState] Admin status: ${isAdminUser}`);
    } catch (error) {
      console.error("[useAuthState] Admin check exception:", error);
      setIsAdmin(false);
      setAdminVerified("failed");
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
              
              // Never call other Supabase functions directly in the callback
              // Use timeout to prevent potential deadlock or recursion
              setTimeout(() => {
                checkAdminStatus(currentSession.user.id);
              }, 0);
            }
          } else if (event === 'SIGNED_OUT') {
            console.info("[useAuthState] User signed out");
            setSession(null);
            setUser(null);
            setIsAdmin(false);
            setAdminVerified("idle");
            setProfile(null);
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
