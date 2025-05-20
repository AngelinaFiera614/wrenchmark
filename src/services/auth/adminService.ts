
import { supabase } from "@/integrations/supabase/client";

/**
 * Verifies if a user has admin status
 * 
 * @param userId The ID of the user to check
 * @returns True if the user is an admin, false otherwise
 */
export const verifyAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) {
      console.log("[adminService] No user ID provided for admin verification");
      return false;
    }
    
    // First check if the is_admin function exists by running a simple query
    try {
      const { data: functionExists, error: functionCheckError } = await supabase.rpc('current_user_is_admin');
      
      if (!functionCheckError) {
        console.log("[adminService] Using current_user_is_admin() function to verify admin status");
        return functionExists === true;
      } else {
        console.log("[adminService] Function check error:", functionCheckError.message);
      }
    } catch (functionError) {
      console.error("[adminService] Error checking admin function:", functionError);
      // Continue to the profile check as fallback
    }
    
    // Fall back to direct profile check
    try {
      console.log("[adminService] Function not available, checking profile table directly");
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .maybeSingle(); // Changed from single() to maybeSingle() to prevent errors

      if (profileError) {
        console.error("[adminService] Error verifying admin status:", profileError);
        return false;
      }

      return profileData?.is_admin === true;
    } catch (profileCheckError) {
      console.error("[adminService] Error in profile check:", profileCheckError);
      return false;
    }
  } catch (error) {
    console.error("[adminService] Unexpected error in verifyAdminStatus:", error);
    return false;
  }
};

/**
 * Sets a user's admin status
 * 
 * @param targetUserId The ID of the user to update
 * @param isAdmin True to make the user an admin, false to remove admin status
 * @returns True if successful, false otherwise
 */
export const setUserAdminStatus = async (targetUserId: string, isAdmin: boolean): Promise<boolean> => {
  try {
    if (!targetUserId) {
      console.error("[adminService] No target user ID provided");
      return false;
    }
    
    // Only admins should be able to set admin status (enforced by RLS)
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: isAdmin })
      .eq('id', targetUserId);

    if (error) {
      console.error("[adminService] Error setting admin status:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[adminService] Unexpected error in setUserAdminStatus:", error);
    return false;
  }
};

// Simple in-memory cache for admin status to reduce database queries
const adminCache = new Map<string, {isAdmin: boolean, timestamp: number}>();
const CACHE_TTL = 2 * 60 * 1000; // Reduced from 5 minutes to 2 minutes for fresher data

/**
 * Clears the admin status cache
 */
export const clearAdminCache = () => {
  console.log("[adminService] Clearing admin cache");
  adminCache.clear();
};

/**
 * Checks if a user is an admin with caching
 * 
 * @param userId The ID of the user to check
 * @returns True if the user is an admin, false otherwise
 */
export const isUserAdminCached = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Check cache first
    const cached = adminCache.get(userId);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      return cached.isAdmin;
    }
    
    // Not in cache or expired, fetch from database
    const isAdmin = await verifyAdminStatus(userId);
    
    // Update cache
    adminCache.set(userId, {
      isAdmin,
      timestamp: Date.now()
    });
    
    return isAdmin;
  } catch (error) {
    console.error("[adminService] Error in isUserAdminCached:", error);
    // If there's an error, return false but don't update cache
    return false;
  }
};
