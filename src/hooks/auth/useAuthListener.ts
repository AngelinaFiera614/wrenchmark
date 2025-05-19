
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAuthListener(
  onStateChange: (event: string, session: any) => void
) {
  useEffect(() => {
    console.log("[useAuthListener] Setting up auth state listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`[useAuthListener] Auth state change: ${event}`, session ? session.user?.email : "no user");
        onStateChange(event, session);
      }
    );
    
    // Return cleanup function to unsubscribe
    return () => {
      console.log("[useAuthListener] Unsubscribing from auth state changes");
      subscription.unsubscribe();
    };
  }, [onStateChange]);
}
