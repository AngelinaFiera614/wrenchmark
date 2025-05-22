
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Securely verifies if a user has admin status by checking their profile
 * @param userId The user ID to check
 * @returns boolean indicating if the user is an admin
 */
export async function verifyAdminStatus(userId: string): Promise<boolean> {
  try {
    if (!userId) {
      console.error("[adminService] No user ID provided for admin verification");
      return false;
    }
    
    console.log("[adminService] Verifying admin status for user:", userId);
    
    // Use maybeSingle instead of single to avoid errors with missing profiles
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .maybeSingle();
    
    if (error) {
      console.error("[adminService] Error checking admin status:", error);
      return false;
    }
    
    const isAdmin = !!data?.is_admin;
    console.log(`[adminService] User ${userId} admin status: ${isAdmin}`);
    
    return isAdmin;
  } catch (error) {
    console.error("[adminService] Unexpected error during admin verification:", error);
    toast.error("Failed to verify admin permissions");
    return false;
  }
}
