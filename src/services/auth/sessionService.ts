
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

/**
 * Fetch the current user session
 * @returns The current session or null if not authenticated
 */
export const fetchCurrentSession = async (): Promise<Session | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("[sessionService] Error fetching session:", error);
      return null;
    }
    
    return data.session;
  } catch (error) {
    console.error("[sessionService] Unexpected error in fetchCurrentSession:", error);
    return null;
  }
};
