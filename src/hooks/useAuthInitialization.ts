
import { useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthInitializationProps {
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  fetchProfile: (userId: string) => Promise<void>;
  setIsProfileLoading: (isLoading: boolean) => void;
}

export function useAuthInitialization({
  setSession,
  setUser,
  setIsLoading,
  fetchProfile,
  setIsProfileLoading
}: AuthInitializationProps) {
  useEffect(() => {
    let isMounted = true;
    console.log("Setting up auth state listener");
    
    // Create a function to handle auth state changes to prevent race conditions
    const handleAuthStateChange = (currentSession: Session | null) => {
      if (!isMounted) return;
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        // Use setTimeout to prevent deadlock and set a flag to avoid double fetching
        console.log("Auth state changed, scheduling profile fetch for user:", currentSession.user.id);
        setIsProfileLoading(true);
        setTimeout(() => {
          if (isMounted) {
            fetchProfile(currentSession.user.id).catch(err => {
              console.error("Error in fetchProfile during auth state change:", err);
              setIsLoading(false);
            });
          }
        }, 0);
      } else {
        setIsLoading(false);
      }
    };

    // Set up auth state listener FIRST to prevent missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        handleAuthStateChange(currentSession);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth");
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        console.log("Got session:", currentSession?.user?.email || "No session");
        handleAuthStateChange(currentSession);
      } catch (error: any) {
        console.error("Error initializing auth:", error);
        toast.error("Failed to initialize authentication");
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      console.log("Unsubscribing from auth state changes");
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setIsLoading, fetchProfile, setIsProfileLoading]);
}
