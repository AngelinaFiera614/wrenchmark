
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/services/profileService";
import { verifyAdminStatus } from "@/services/auth";
import type { AdminVerificationState } from "@/context/auth/types";

/**
 * Hook for handling admin verification
 */
export function useAdminVerification(user: User | null, profile: Profile | null) {
  const [adminStatus, setAdminStatus] = useState(false);
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [adminVerificationState, setAdminVerificationState] = useState<AdminVerificationState>('unknown');

  // Update admin status based on profile
  useEffect(() => {
    if (user && profile !== null) {
      const isAdmin = profile?.is_admin || false;
      console.log(`[useAdminVerification] User ${user.id} admin status from profile: ${isAdmin}`);
      setAdminStatus(isAdmin);
      
      // If profile says user is admin, mark as verified
      if (isAdmin && !isAdminVerified) {
        console.log("[useAdminVerification] Setting admin as verified based on profile data");
        setIsAdminVerified(true);
        setAdminVerificationState('verified');
      }
    }
  }, [user, profile, isAdminVerified]);
  
  // Reset verification state when user changes
  useEffect(() => {
    if (user === null) {
      setAdminVerificationState('unknown');
      setIsAdminVerified(false);
      setAdminStatus(false);
    } else if (adminVerificationState === 'unknown') {
      setAdminVerificationState('pending');
    }
  }, [user, adminVerificationState]);
  
  // Force verification function
  const forceVerifyAdmin = async () => {
    if (!user) {
      console.log("[useAdminVerification] Cannot verify admin status: no user");
      return false;
    }
    
    console.log("[useAdminVerification] Forcing admin verification");
    setAdminVerificationState('pending');
    
    try {
      const isAdmin = await verifyAdminStatus(user.id);
      
      setAdminStatus(isAdmin);
      setIsAdminVerified(isAdmin);
      setAdminVerificationState(isAdmin ? 'verified' : 'failed');
      
      return isAdmin;
    } catch (error) {
      console.error("[useAdminVerification] Error in force verification:", error);
      setAdminVerificationState('failed');
      return false;
    }
  };

  return {
    adminStatus,
    isAdminVerified,
    adminVerificationState,
    setAdminStatus,
    setIsAdminVerified,
    setAdminVerificationState,
    forceVerifyAdmin
  };
}
