
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
    console.log("[useAuthInitialization] Setting up auth state listener");
    
    // Create a function to handle auth state changes to prevent race conditions
    const handleAuthStateChange = (event: string, currentSession: Session | null) => {
      if (!isMounted) return;
      
      console.log(`[useAuthInitialization] Auth state changed: ${event}`);
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        // Set a flag to avoid double fetching and schedule profile fetch
        console.log(`[useAuthInitialization] Auth state changed, scheduling profile fetch for user: ${currentSession.user.id}`);
        setIsProfileLoading(true);
        
        // Use setTimeout to prevent deadlock
        setTimeout(() => {
          if (isMounted) {
            fetchProfile(currentSession.user.id).catch(err => {
              console.error("[useAuthInitialization] Error in fetchProfile during auth state change:", err);
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
      (event, currentSession) => {
        console.log(`[useAuthInitialization] Auth event: ${event}, user: ${currentSession?.user?.email || "none"}`);
        handleAuthStateChange(event, currentSession);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        console.log("[useAuthInitialization] Initializing auth");
        setIsLoading(true);
        
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        console.log(`[useAuthInitialization] Got session: ${currentSession?.user?.email || "No session"}`);
        
        if (currentSession?.user) {
          // Check session expiry
          const expiresAt = currentSession.expires_at;
          const now = Math.floor(Date.now() / 1000);
          console.log(`[useAuthInitialization] Session expires at: ${new Date(expiresAt * 1000).toISOString()}, now: ${new Date(now * 1000).toISOString()}`);
          
          if (expiresAt && expiresAt < now + 300) { // Less than 5 minutes until expiry
            console.log("[useAuthInitialization] Session close to expiry, refreshing");
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            
            if (refreshError) {
              console.error("[useAuthInitialization] Error refreshing session:", refreshError);
              // Continue with existing session
            } else if (refreshData?.session) {
              console.log("[useAuthInitialization] Session refreshed successfully");
              handleAuthStateChange("REFRESHED", refreshData.session);
              return; // handleAuthStateChange will take care of the rest
            }
          }
        }
        
        // Process the session we got
        handleAuthStateChange("INITIALIZED", currentSession);
      } catch (error: any) {
        console.error("[useAuthInitialization] Error initializing auth:", error);
        toast.error("Failed to initialize authentication");
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      console.log("[useAuthInitialization] Unsubscribing from auth state changes");
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setIsLoading, fetchProfile, setIsProfileLoading]);
}
