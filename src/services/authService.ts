
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

// Function to refresh auth session with rate limiting protection
let lastRefreshTime = 0;
const REFRESH_COOLDOWN = 5000; // 5 seconds minimum between refreshes

export async function refreshSession() {
  try {
    // Check if we're refreshing too frequently to avoid rate limits
    const now = Date.now();
    if (now - lastRefreshTime < REFRESH_COOLDOWN) {
      console.log("[authService] Skipping refresh - too soon after last refresh");
      return await fetchCurrentSession();
    }
    
    lastRefreshTime = now;
    console.log("[authService] Refreshing session");
    
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      // Special handling for "Auth session missing" which isn't necessarily an error
      if (error.message === "Auth session missing!") {
        console.log("[authService] No active session to refresh");
        return null;
      }
      
      console.error("[authService] Error refreshing session:", error);
      
      // Try to get current session to see status
      const currentSession = await fetchCurrentSession();
      if (!currentSession) {
        console.log("[authService] No current session found during refresh failure");
      }
      
      return currentSession;
    }
    
    if (data.session) {
      console.log("[authService] Session refreshed successfully, expires:", new Date(data.session.expires_at * 1000).toISOString());
      return data.session;
    } else {
      console.log("[authService] No session after refresh");
      return null;
    }
  } catch (error) {
    console.error("[authService] Error in refreshSession:", error);
    return await fetchCurrentSession(); // Fallback to current session
  }
}

// Function to verify if the current user is admin
export async function verifyAdminStatus(userId?: string) {
  try {
    console.log("[authService] Verifying admin status");
    
    // First check if we have a user ID
    const userIdToCheck = userId || (await fetchCurrentSession())?.user?.id;
    
    if (!userIdToCheck) {
      console.log("[authService] No user ID available for admin verification");
      return false;
    }
    
    // Get user profile
    const profile = await getProfileById(userIdToCheck);
    if (!profile) {
      console.log("[authService] No profile found during admin verification");
      return false;
    }
    
    console.log(`[authService] Admin status for user ${userIdToCheck}: ${profile.is_admin}`);
    return profile.is_admin;
  } catch (error) {
    console.error("[authService] Error verifying admin status:", error);
    return false;
  }
}
