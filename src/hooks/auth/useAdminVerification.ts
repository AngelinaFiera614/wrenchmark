
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
  const lastVerificationTime = useRef(0);
  const verificationTimeoutId = useRef<NodeJS.Timeout | null>(null);

  // Update admin status based on profile with debouncing
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
      adminVerificationAttempts.current = 0;
    } else if (adminVerificationState === 'unknown') {
      setAdminVerificationState('pending');
      adminVerificationAttempts.current = 0;
    }
  }, [user, adminVerificationState]);
  
  // Function to force admin verification with rate limiting
  const forceVerifyAdmin = useCallback(async () => {
    if (!user) {
      console.log("[useAdminVerification] Cannot verify admin status: no user");
      return false;
    }
    
    const now = Date.now();
    
    // Rate limit: don't allow verification more than once every 2 seconds
    if (now - lastVerificationTime.current < 2000) {
      console.log("[useAdminVerification] Verification throttled, try again later");
      return isAdminVerified; // Return current state
    }
    
    lastVerificationTime.current = now;
    console.log("[useAdminVerification] Forcing admin verification");
    setAdminVerificationState('pending');
    
    // Clear any pending verification
    if (verificationTimeoutId.current) {
      clearTimeout(verificationTimeoutId.current);
    }
    
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
  }, [user, isAdminVerified]);

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
