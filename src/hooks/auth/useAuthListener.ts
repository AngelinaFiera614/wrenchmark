
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for listening to authentication state changes
 */
export function useAuthListener(
  onAuthStateChange: (event: string, session: Session | null) => void
) {
  const [subscription, setSubscription] = useState<{ unsubscribe: () => void } | null>(null);
  
  useEffect(() => {
    console.log("[useAuthListener] Setting up auth state listener");
    
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log(`[useAuthListener] Auth event: ${event}, user: ${currentSession?.user?.email || "none"}`);
        onAuthStateChange(event, currentSession);
      }
    );
    
    setSubscription(authSubscription);

    return () => {
      console.log("[useAuthListener] Unsubscribing from auth state changes");
      if (subscription) {
        subscription.unsubscribe();
      }
      authSubscription.unsubscribe();
    };
  }, [onAuthStateChange]);
}
