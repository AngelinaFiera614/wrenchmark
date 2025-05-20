
import { useState, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/services/profileService";
import { verifyAdminStatus } from "@/services/auth";
import type { AdminVerificationState } from "@/context/auth/types";

/**
 * Hook for handling admin verification
 */
export function useAdminVerification(user: User | null, profile: Profile | null) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [adminVerificationState, setAdminVerificationState] = useState<AdminVerificationState>('unknown');
  const [verificationAttempts, setVerificationAttempts] = useState(0);

  // Update admin status based on profile
  useEffect(() => {
    if (user && profile !== null) {
      const profileIsAdmin = profile?.is_admin || false;
      console.log(`[useAdminVerification] User ${user.id} admin status from profile: ${profileIsAdmin}`);
      setIsAdmin(profileIsAdmin);
      
      // If profile says user is admin, mark as verified
      if (profileIsAdmin && !isAdminVerified) {
        console.log("[useAdminVerification] Setting admin as verified based on profile data");
        setIsAdminVerified(true);
        setAdminVerificationState('verified');
      } else if (!profileIsAdmin && adminVerificationState === 'pending') {
        // If profile says user is not admin, and we're still pending, update state
        console.log("[useAdminVerification] User is not an admin according to profile data");
        setAdminVerificationState('failed');
      }
    }
  }, [user, profile, isAdminVerified, adminVerificationState]);
  
  // Reset verification state when user changes
  useEffect(() => {
    if (user === null) {
      setAdminVerificationState('unknown');
      setIsAdminVerified(false);
      setIsAdmin(false);
      setVerificationAttempts(0);
    } else if (adminVerificationState === 'unknown') {
      setAdminVerificationState('pending');
    }
  }, [user, adminVerificationState]);

  // Add a timeout effect to prevent infinite pending state
  useEffect(() => {
    if (adminVerificationState === 'pending' && verificationAttempts < 2) {
      const timeoutId = setTimeout(() => {
        console.log("[useAdminVerification] Attempting admin verification automatically");
        setVerificationAttempts(prev => prev + 1);
        
        if (user) {
          verifyAdminStatus(user.id)
            .then(isAdmin => {
              setIsAdmin(isAdmin);
              setIsAdminVerified(isAdmin);
              setAdminVerificationState(isAdmin ? 'verified' : 'failed');
            })
            .catch(error => {
              console.error("[useAdminVerification] Error in auto verification:", error);
              setAdminVerificationState('failed');
            });
        }
      }, 1500);
      
      return () => clearTimeout(timeoutId);
    } else if (adminVerificationState === 'pending' && verificationAttempts >= 2) {
      // If we've tried 2 times and still pending, mark as failed
      console.log("[useAdminVerification] Maximum verification attempts reached, marking as failed");
      setAdminVerificationState('failed');
    }
  }, [adminVerificationState, user, verificationAttempts]);
  
  // Force verification function
  const verifyAdminStatus = useCallback(async () => {
    if (!user) {
      console.log("[useAdminVerification] Cannot verify admin status: no user");
      return false;
    }
    
    console.log("[useAdminVerification] Forcing admin verification");
    setAdminVerificationState('pending');
    
    try {
      const isAdmin = await verifyAdminStatus(user.id);
      
      setIsAdmin(isAdmin);
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
    isAdmin,
    isAdminVerified,
    adminVerificationState,
    setIsAdmin,
    setIsAdminVerified,
    setAdminVerificationState,
    verifyAdminStatus
  };
}
