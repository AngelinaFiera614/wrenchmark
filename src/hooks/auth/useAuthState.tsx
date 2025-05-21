
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { AuthError } from "@supabase/supabase-js";

// Type definition for admin verification state
type AdminVerificationState = boolean | "loading" | "error";

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminVerified, setAdminVerified] = useState<AdminVerificationState>("loading");

  // Initialize the auth state from Supabase
  const initializeAuth = useCallback(async () => {
    console.info("[useAuthState] Starting authentication initialization");
    try {
      console.info("[useAuthState] Setting up auth state listener");
      
      // Set up the auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.info(`[useAuthState] Auth event: ${event}`);
          
          if (session?.user) {
            console.info(`[useAuthState] User authenticated: ${session.user.email}`);
            setSession(session);
            setUser(session.user);
            checkAdminStatus(session.user.id);
          } else {
            console.info("[useAuthState] No user in session");
            setSession(null);
            setUser(null);
            setIsAdmin(false);
            setAdminVerified(false);
          }
        }
      );

      // Check for existing session
      console.info("[useAuthState] Checking for existing session");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.info("[useAuthState] Initial session check: Session found");
        setSession(session);
        setUser(session.user);
        await checkAdminStatus(session.user.id);
      } else {
        console.info("[useAuthState] Initial session check: No session found");
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setAdminVerified(false);
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
      setAdminVerified(false);
    }
  }, []);

  // Check if the user has admin permissions
  const checkAdminStatus = async (userId: string) => {
    try {
      // Fetch the admin status from profiles table
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("[useAuthState] Admin check error:", error);
        setIsAdmin(false);
        setAdminVerified("error");
        return;
      }

      const isAdminUser = data?.is_admin || false;
      setIsAdmin(isAdminUser);
      setAdminVerified(true);
      
      console.info(`[useAuthState] Admin status: ${isAdminUser}`);
    } catch (error) {
      console.error("[useAuthState] Admin check exception:", error);
      setIsAdmin(false);
      setAdminVerified("error");
    }
  };

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
    isLoading,
    isAdmin,
    isAdminVerified: adminVerified === true,
    adminVerificationState: adminVerified,
  };
};

export default useAuthState;
