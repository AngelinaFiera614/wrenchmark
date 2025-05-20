
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
    const { data: functionExists, error: functionCheckError } = await supabase.rpc('current_user_is_admin');
    
    if (!functionCheckError) {
      console.log("[adminService] Using current_user_is_admin() function to verify admin status");
      return functionExists === true;
    }
    
    // Fall back to direct profile check
    console.log("[adminService] Function not available, checking profile table directly");
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error("[adminService] Error verifying admin status:", profileError);
      return false;
    }

    return profileData?.is_admin === true;
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
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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
};
