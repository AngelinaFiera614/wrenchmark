
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
    }
  }, [onSessionLoaded]);

  useEffect(() => {
    if (isLoading) {
      // Initialize session with a small delay
      const timeoutId = setTimeout(initializeSession, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [initializeSession, isLoading]);
}
