
import { useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { refreshSession } from "@/services/auth";

/**
 * Hook for initializing the session on component mount
 */
export function useSessionInit(
  onSessionLoaded: (event: string, session: any) => void,
  isLoading: boolean
) {
  const initializeSession = useCallback(async () => {
    try {
      console.log("[useSessionInit] Initializing session");
      
      // Try to load session from localStorage first for immediate UI updates
      try {
        const storedSession = localStorage.getItem('sb-session');
        if (storedSession) {
          try {
            const parsedSession = JSON.parse(storedSession);
            if (parsedSession) {
              console.log("[useSessionInit] Found stored session, using it initially");
              // Just set the session/user temporarily, will be replaced by getSession() response
              onSessionLoaded("STORED", parsedSession);
            }
          } catch (e) {
            console.error("[useSessionInit] Error parsing stored session:", e);
          }
        }
      } catch (e) {
        console.error("[useSessionInit] Error accessing localStorage:", e);
      }
      
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      console.log(`[useSessionInit] Got session: ${currentSession?.user?.email || "No session"}`);
      
      if (currentSession?.user) {
        // Check session expiry
        const expiresAt = currentSession.expires_at;
        const now = Math.floor(Date.now() / 1000);
        console.log(`[useSessionInit] Session expires at: ${new Date(expiresAt * 1000).toISOString()}, now: ${new Date(now * 1000).toISOString()}`);
        
        if (expiresAt && expiresAt < now + 300) { // Less than 5 minutes until expiry
          console.log("[useSessionInit] Session close to expiry, refreshing");
          try {
            const refreshedSession = await refreshSession();
            
            if (refreshedSession) {
              console.log("[useSessionInit] Session refreshed successfully");
              onSessionLoaded("REFRESHED", refreshedSession);
              return; // handleAuthStateChange will take care of the rest
            } else {
              console.log("[useSessionInit] Session refresh failed or returned null");
            }
          } catch (err) {
            console.error("[useSessionInit] Error refreshing session:", err);
          }
        }
      }
      
      // Process the session we got
      onSessionLoaded("INITIALIZED", currentSession);
    } catch (error: any) {
      console.error("[useSessionInit] Error initializing session:", error);
      toast.error("Failed to initialize authentication");
    }
  }, [onSessionLoaded]);

  useEffect(() => {
    if (isLoading) {
      // Initialize session with a small delay to ensure subscription is set up
      const timeoutId = setTimeout(initializeSession, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [initializeSession, isLoading]);
}
