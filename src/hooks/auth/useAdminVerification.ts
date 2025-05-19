
import { useState, useCallback, useEffect, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/services/profileService";
import { verifyAdminStatus, forceAdminVerification } from "@/services/auth";
import type { AdminVerificationState } from "@/context/auth/types";

/**
 * Hook for handling admin verification
 */
export function useAdminVerification(user: User | null, profile: Profile | null) {
  const [adminStatus, setAdminStatus] = useState(false);
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [adminVerificationState, setAdminVerificationState] = useState<AdminVerificationState>('unknown');
  
  // Track admin verification attempts to prevent infinite loops
  const adminVerificationAttempts = useRef(0);

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
  
  // Verify admin status separately from profile, with improved stability
  useEffect(() => {
    // Only run admin verification if we have a user and haven't verified admin status yet
    if (!user || isAdminVerified) return;
    
    // Avoid race conditions by using a deterministic source of admin status
    if (profile?.is_admin === true) {
      console.log("[useAdminVerification] Admin status verified from profile");
      setIsAdminVerified(true);
      return;
    }

    // Only proceed with direct admin check if profile exists but doesn't have admin
    // or if we haven't verified status yet
    const checkAdminStatus = async () => {
      try {
        console.log("[useAdminVerification] Performing direct admin verification");
        const isUserAdmin = await verifyAdminStatus(user.id);
        
        if (isUserAdmin) {
          console.log("[useAdminVerification] User confirmed as admin via direct check");
          setIsAdminVerified(true);
          setAdminStatus(true);
          setAdminVerificationState('verified');
        } else {
          console.log("[useAdminVerification] User is not admin via direct check");
          setIsAdminVerified(false);
          setAdminStatus(false);
          setAdminVerificationState('failed');
        }
      } catch (error) {
        console.error("[useAdminVerification] Error during admin verification:", error);
        setAdminVerificationState('failed');
      }
    };
    
    const timeoutId = setTimeout(checkAdminStatus, 300);
    return () => clearTimeout(timeoutId);
  }, [user, profile, isAdminVerified, adminVerificationState]);
  
  // Function to force admin verification
  const forceVerifyAdmin = useCallback(async () => {
    if (!user) {
      console.log("[useAdminVerification] Cannot verify admin status: no user");
      return false;
    }
    
    console.log("[useAdminVerification] Forcing admin verification");
    setAdminVerificationState('pending');
    
    try {
      const isAdmin = await forceAdminVerification(user.id);
      
      setAdminStatus(isAdmin);
      setIsAdminVerified(isAdmin);
      setAdminVerificationState(isAdmin ? 'verified' : 'failed');
      
      return isAdmin;
    } catch (error) {
      console.error("[useAdminVerification] Error in force verification:", error);
      setAdminVerificationState('failed');
      return false;
    }
  }, [user]);

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
