
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { createProfileIfNotExists, getProfileById } from "@/services/profileService";
import type { Profile } from "@/services/profileService";

export async function signIn(email: string, password: string) {
  console.log("Signing in user:", email);
  try {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    console.log("Sign in successful");

    if (data.user) {
      // Ensure profile exists after login
      const profile = await getProfileById(data.user.id);
      if (!profile) {
        console.log("Creating profile after login");
        const createdProfile = await createProfileIfNotExists(data.user.id);
        if (!createdProfile) {
          toast.error("Failed to create profile. Please try refreshing.");
        }
      }
    }
    return data;
  } catch (error: any) {
    toast.error(error.message || "Failed to sign in");
    throw error;
  }
}

export async function signUp(email: string, password: string) {
  try {
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    
    // Create profile immediately after signup if we have a user
    if (data.user) {
      console.log("Creating profile immediately after signup");
      const createdProfile = await createProfileIfNotExists(data.user.id);
      if (!createdProfile) {
        console.log("Failed to create profile during signup");
      }
    }
    
    toast.success("Signup successful! Please check your email to verify your account.");
    return data;
  } catch (error: any) {
    toast.error(error.message || "Failed to sign up");
    throw error;
  }
}

export async function signOut() {
  try {
    // Clear admin cache before signing out
    adminStatusCache.clear();
    await supabase.auth.signOut();
    toast.success("You have been signed out");
  } catch (error: any) {
    toast.error(error.message || "Failed to sign out");
    throw error;
  }
}

export async function updateProfileData(
  userId: string, 
  profileData: Partial<Profile>
) {
  if (!userId) {
    toast.error("User ID not available for profile update");
    throw new Error("User ID not available");
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    
    toast.success("Profile updated successfully");
    return data as Profile;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    toast.error(error.message || "Failed to update profile");
    throw error;
  }
}

export async function fetchCurrentSession() {
  try {
    console.log("[authService] Fetching current session");
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("[authService] Error fetching session:", error);
      return null;
    }
    
    if (data.session) {
      const expiresAt = data.session.expires_at;
      const now = Math.floor(Date.now() / 1000);
      console.log(`[authService] Session expires at: ${new Date(expiresAt * 1000).toISOString()}, now: ${new Date(now * 1000).toISOString()}`);
    }
    
    return data.session;
  } catch (error) {
    console.error("[authService] Error fetching session:", error);
    return null;
  }
}

// Function to refresh auth session with rate limiting protection and a cache
let lastRefreshTime = 0;
let refreshPromise: Promise<Session | null> | null = null;
const REFRESH_COOLDOWN = 5000; // 5 seconds minimum between refreshes

export async function refreshSession() {
  try {
    // Check if we're refreshing too frequently to avoid rate limits
    const now = Date.now();
    if (now - lastRefreshTime < REFRESH_COOLDOWN) {
      console.log("[authService] Skipping refresh - too soon after last refresh");
      return await fetchCurrentSession();
    }
    
    // If a refresh is already in progress, return that promise
    if (refreshPromise) {
      console.log("[authService] Refresh already in progress, reusing promise");
      return refreshPromise;
    }
    
    lastRefreshTime = now;
    console.log("[authService] Refreshing session");
    
    // Create a new promise and store it
    refreshPromise = supabase.auth.refreshSession()
      .then(({ data, error }) => {
        if (error) {
          // Special handling for "Auth session missing" which isn't necessarily an error
          if (error.message === "Auth session missing!") {
            console.log("[authService] No active session to refresh");
            return null;
          }
          
          console.error("[authService] Error refreshing session:", error);
          throw error;
        }
        
        if (data.session) {
          console.log("[authService] Session refreshed successfully, expires:", new Date(data.session.expires_at * 1000).toISOString());
          return data.session;
        } else {
          console.log("[authService] No session after refresh");
          return null;
        }
      })
      .catch(async (error) => {
        console.error("[authService] Error in refreshSession:", error);
        return await fetchCurrentSession(); // Fallback to current session
      })
      .finally(() => {
        // Clear the cached promise after 1 second to allow future refreshes
        setTimeout(() => {
          refreshPromise = null;
        }, 1000);
      });
    
    return await refreshPromise;
  } catch (error) {
    console.error("[authService] Error in refreshSession:", error);
    refreshPromise = null;
    return await fetchCurrentSession(); // Fallback to current session
  }
}

// Create a persistent cache for admin status with a TTL (time to live)
// Using localStorage for persistence across page reloads
const ADMIN_CACHE_KEY = 'wrenchmark_admin_status';
const ADMIN_CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

// In-memory cache for quick access
const adminStatusCache = new Map<string, {isAdmin: boolean, timestamp: number}>();

// Load initial cache from localStorage if available
try {
  const storedCache = localStorage.getItem(ADMIN_CACHE_KEY);
  if (storedCache) {
    const parsedCache = JSON.parse(storedCache);
    // Only use cache if it's not expired
    if (parsedCache && parsedCache.timestamp && (Date.now() - parsedCache.timestamp < ADMIN_CACHE_TTL)) {
      if (parsedCache.userId && parsedCache.isAdmin !== undefined) {
        adminStatusCache.set(parsedCache.userId, {
          isAdmin: parsedCache.isAdmin,
          timestamp: parsedCache.timestamp
        });
        console.log("[authService] Loaded admin status from persistent cache:", parsedCache);
      }
    } else {
      // Clear expired cache
      localStorage.removeItem(ADMIN_CACHE_KEY);
    }
  }
} catch (error) {
  console.error("[authService] Error loading admin cache from localStorage:", error);
  // Continue without the cache
}

// Function to verify if a user is admin with improved caching
export async function verifyAdminStatus(userId?: string): Promise<boolean> {
  try {
    console.log("[authService] Verifying admin status");
    
    // First check if we have a user ID
    const userIdToCheck = userId || (await fetchCurrentSession())?.user?.id;
    
    if (!userIdToCheck) {
      console.log("[authService] No user ID available for admin verification");
      return false;
    }
    
    // Check in-memory cache first
    const cachedStatus = adminStatusCache.get(userIdToCheck);
    if (cachedStatus && (Date.now() - cachedStatus.timestamp < ADMIN_CACHE_TTL)) {
      console.log(`[authService] Using cached admin status for user ${userIdToCheck}: ${cachedStatus.isAdmin}`);
      return cachedStatus.isAdmin;
    }
    
    // Get user profile
    console.log(`[authService] No valid cache found, fetching profile for user ${userIdToCheck}`);
    const profile = await getProfileById(userIdToCheck);
    
    if (!profile) {
      console.log("[authService] No profile found during admin verification");
      
      // Try to create a profile if one doesn't exist
      const createdProfile = await createProfileIfNotExists(userIdToCheck);
      if (!createdProfile) {
        // Cache the negative result
        updateAdminCache(userIdToCheck, false);
        return false;
      }
      
      // Use the created profile
      const isAdmin = Boolean(createdProfile.is_admin);
      updateAdminCache(userIdToCheck, isAdmin);
      return isAdmin;
    }
    
    console.log(`[authService] Admin status for user ${userIdToCheck}: ${profile.is_admin}`);
    
    // Update both caches
    updateAdminCache(userIdToCheck, Boolean(profile.is_admin));
    return Boolean(profile.is_admin);
  } catch (error) {
    console.error("[authService] Error verifying admin status:", error);
    return false;
  }
}

// Helper function to update both in-memory and persistent cache
function updateAdminCache(userId: string, isAdmin: boolean) {
  // Update in-memory cache
  adminStatusCache.set(userId, {
    isAdmin: isAdmin, 
    timestamp: Date.now()
  });
  
  // Update persistent cache in localStorage
  try {
    localStorage.setItem(ADMIN_CACHE_KEY, JSON.stringify({
      userId,
      isAdmin,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error("[authService] Error saving to localStorage:", error);
    // Continue even if localStorage fails
  }
  
  console.log(`[authService] Updated admin cache for ${userId}: ${isAdmin}`);
}

// Function to force clear admin cache and re-verify
export async function forceAdminVerification(userId?: string): Promise<boolean> {
  try {
    console.log("[authService] Performing forced admin verification");
    
    const userIdToCheck = userId || (await fetchCurrentSession())?.user?.id;
    
    if (!userIdToCheck) {
      console.log("[authService] No user ID available for forced verification");
      return false;
    }
    
    // Clear cache for this user
    adminStatusCache.delete(userIdToCheck);
    try {
      localStorage.removeItem(ADMIN_CACHE_KEY);
    } catch (e) {
      console.error("[authService] Error clearing localStorage:", e);
    }
    
    // Perform a fresh verification
    return await verifyAdminStatus(userIdToCheck);
  } catch (error) {
    console.error("[authService] Error in forceAdminVerification:", error);
    return false;
  }
}
