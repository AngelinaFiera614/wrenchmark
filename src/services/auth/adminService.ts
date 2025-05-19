
import { supabase } from "@/integrations/supabase/client";

/**
 * Verifies if a user has admin status
 * 
 * @param userId The ID of the user to check
 * @returns True if the user is an admin, false otherwise
 */
export const verifyAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    // First check if the is_admin_user function exists by running a simple query
    const { data: functionCheck, error: functionError } = await supabase.rpc('is_admin_user');
    
    if (!functionError) {
      // If the function exists, use it to check admin status
      console.log("[adminService] Using is_admin_user() function to verify admin status");
      return functionCheck === true;
    }
    
    // Fallback to direct profile check if function doesn't exist
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
