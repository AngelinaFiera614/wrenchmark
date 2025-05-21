import { useState, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { verifyAdminStatus } from "@/services/auth/adminService";

// Define the possible states of admin verification
export type AdminVerificationState = "idle" | "pending" | "verified" | "failed";

export function useAdminVerification(user?: User | null, profile?: any) {
  const [adminStatus, setAdminStatus] = useState<boolean>(false);
  const [isAdminVerified, setIsAdminVerified] = useState<boolean>(false);
  const [adminVerificationState, setAdminVerificationState] = useState<AdminVerificationState>("idle");

  // Check for admin status in profile
  useEffect(() => {
    if (profile?.is_admin) {
      console.info(`[useAdminVerification] User ${user?.id} admin status from profile: ${profile.is_admin}`);
      setAdminStatus(true);
    }
  }, [user, profile]);

  // Function to manually verify admin status
  const forceVerifyAdmin = useCallback(async () => {
    if (!user) return false;
    
    console.info(`[useAdminVerification] Attempting admin verification manually`);
    setAdminVerificationState("pending");
    
    try {
      const isAdmin = await verifyAdminStatus(user.id);
      console.info(`[useAdminVerification] User ${user.id} admin status: ${isAdmin}`);
      
      setAdminStatus(isAdmin);
      setIsAdminVerified(true);
      setAdminVerificationState(isAdmin ? "verified" : "failed");
      
      return isAdmin;
    } catch (error) {
      console.error("[useAdminVerification] Admin verification error:", error);
      setAdminVerificationState("failed");
      return false;
    }
  }, [user]);

  // Auto-verify admin status once on load if needed
  useEffect(() => {
    if (user && !isAdminVerified && !adminStatus && adminVerificationState === "idle") {
      console.info(`[useAdminVerification] Attempting admin verification automatically`);
      forceVerifyAdmin();
    }
  }, [user, isAdminVerified, adminStatus, adminVerificationState, forceVerifyAdmin]);

  return {
    isAdmin: adminStatus,
    isAdminVerified,
    adminVerificationState,
    setAdminStatus,
    setIsAdminVerified,
    setAdminVerificationState,
    verifyAdminStatus: forceVerifyAdmin
  };
}

export default useAdminVerification;
