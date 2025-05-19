
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { SessionRefreshState } from "./types";

// Session refresh state with rate limiting protection
const sessionRefreshState: SessionRefreshState = {
  lastRefreshTime: 0,
  refreshPromise: null
};

// Constants for session refresh
const REFRESH_COOLDOWN = 5000; // 5 seconds minimum between refreshes

export async function fetchCurrentSession(): Promise<Session | null> {
  try {
    console.log("[sessionService] Fetching current session");
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("[sessionService] Error fetching session:", error);
      return null;
    }
    
    if (data.session) {
      const expiresAt = data.session.expires_at;
      const now = Math.floor(Date.now() / 1000);
      console.log(`[sessionService] Session expires at: ${new Date(expiresAt * 1000).toISOString()}, now: ${new Date(now * 1000).toISOString()}`);
    }
    
    return data.session;
  } catch (error) {
    console.error("[sessionService] Error fetching session:", error);
    return null;
  }
}

export async function refreshSession(): Promise<Session | null> {
  try {
    // Check if we're refreshing too frequently to avoid rate limits
    const now = Date.now();
    if (now - sessionRefreshState.lastRefreshTime < REFRESH_COOLDOWN) {
      console.log("[sessionService] Skipping refresh - too soon after last refresh");
      return await fetchCurrentSession();
    }
    
    // If a refresh is already in progress, return that promise
    if (sessionRefreshState.refreshPromise) {
      console.log("[sessionService] Refresh already in progress, reusing promise");
      return sessionRefreshState.refreshPromise;
    }
    
    sessionRefreshState.lastRefreshTime = now;
    console.log("[sessionService] Refreshing session");
    
    // Create a new promise and store it
    sessionRefreshState.refreshPromise = supabase.auth.refreshSession()
      .then(({ data, error }) => {
        if (error) {
          // Special handling for "Auth session missing" which isn't necessarily an error
          if (error.message === "Auth session missing!") {
            console.log("[sessionService] No active session to refresh");
            return null;
          }
          
          console.error("[sessionService] Error refreshing session:", error);
          throw error;
        }
        
        if (data.session) {
          console.log("[sessionService] Session refreshed successfully, expires:", new Date(data.session.expires_at * 1000).toISOString());
          return data.session;
        } else {
          console.log("[sessionService] No session after refresh");
          return null;
        }
      })
      .catch(async (error) => {
        console.error("[sessionService] Error in refreshSession:", error);
        return await fetchCurrentSession(); // Fallback to current session
      })
      .finally(() => {
        // Clear the cached promise after 1 second to allow future refreshes
        setTimeout(() => {
          sessionRefreshState.refreshPromise = null;
        }, 1000);
      });
    
    return await sessionRefreshState.refreshPromise;
  } catch (error) {
    console.error("[sessionService] Error in refreshSession:", error);
    sessionRefreshState.refreshPromise = null;
    return await fetchCurrentSession(); // Fallback to current session
  }
}
