
import { useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      console.log(`[useSessionInit] Got session: ${session?.user?.email || "No session"}`);
      
      // Process the session
      onSessionLoaded("INITIAL_SESSION", session);
    } catch (error: any) {
      console.error("[useSessionInit] Error initializing session:", error);
      // Still call the handler with null session to complete initialization process
      onSessionLoaded("INITIAL_SESSION_ERROR", null);
    }
  }, [onSessionLoaded]);

  useEffect(() => {
    if (isLoading) {
      // Initialize session with a small delay
      const timeoutId = setTimeout(initializeSession, 50);
      
      // Add a safety timeout in case the first initialization fails
      const backupTimeoutId = setTimeout(() => {
        console.warn("[useSessionInit] Backup initialization triggered");
        initializeSession();
      }, 3000);
      
      return () => {
        clearTimeout(timeoutId);
        clearTimeout(backupTimeoutId);
      };
    }
  }, [initializeSession, isLoading]);
}
