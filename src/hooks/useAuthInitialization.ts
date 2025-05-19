
import { useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { refreshSession } from "@/services/authService";

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
    
    let authStateEventQueue: Array<{event: string, session: Session | null}> = [];
    let isProcessingAuthEvents = false;
    
    // Process auth events one at a time to prevent race conditions
    const processAuthEventQueue = async () => {
      if (!isMounted || isProcessingAuthEvents || authStateEventQueue.length === 0) {
        return;
      }
      
      isProcessingAuthEvents = true;
      const { event, session } = authStateEventQueue.shift()!;
      
      console.log(`[useAuthInitialization] Processing auth event: ${event}`);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log(`[useAuthInitialization] Auth event processed, fetching profile for: ${session.user.id}`);
        setIsProfileLoading(true);
        
        try {
          await fetchProfile(session.user.id);
        } catch (err) {
          console.error("[useAuthInitialization] Error in fetchProfile during queue processing:", err);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } else {
        setIsLoading(false);
      }
      
      isProcessingAuthEvents = false;
      
      // Process next event if available
      if (authStateEventQueue.length > 0) {
        setTimeout(processAuthEventQueue, 0);
      }
    };
    
    // Create a function to handle auth state changes to prevent race conditions
    const handleAuthStateChange = (event: string, currentSession: Session | null) => {
      if (!isMounted) return;
      
      console.log(`[useAuthInitialization] Auth event: ${event}, user: ${currentSession?.user?.email || "none"}`);
      
      // Add event to queue
      authStateEventQueue.push({ event, session: currentSession });
      
      // Start processing if not already processing
      if (!isProcessingAuthEvents) {
        processAuthEventQueue();
      }
    };

    // Set up auth state listener FIRST to prevent missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
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
            const refreshedSession = await refreshSession();
            
            if (refreshedSession) {
              console.log("[useAuthInitialization] Session refreshed successfully");
              handleAuthStateChange("REFRESHED", refreshedSession);
              return; // handleAuthStateChange will take care of the rest
            } else {
              console.log("[useAuthInitialization] Session refresh failed or returned null");
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
