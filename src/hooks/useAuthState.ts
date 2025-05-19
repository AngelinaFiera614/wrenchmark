
import { useState, useEffect, useCallback, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getProfileById, createProfileIfNotExists } from "@/services/profileService";
import type { Profile } from "@/services/profileService";
import { toast } from "sonner";
import { useAuthInitialization } from "./useAuthInitialization";
import { forceAdminVerification, verifyAdminStatus } from "@/services/authService";

export type AdminVerificationState = 'unknown' | 'pending' | 'verified' | 'failed';

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileCreationAttempted, setProfileCreationAttempted] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const [profileError, setProfileError] = useState<Error | null>(null);
  const [adminStatus, setAdminStatus] = useState(false);
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [adminVerificationState, setAdminVerificationState] = useState<AdminVerificationState>('unknown');
  
  // Track admin verification attempts to prevent infinite loops
  const adminVerificationAttempts = useRef(0);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log(`[useAuthState] Fetching profile data for user: ${userId}`);
      setIsProfileLoading(true);
      setProfileError(null);
      
      const profileData = await getProfileById(userId);
      
      if (!profileData) {
        console.log("[useAuthState] No profile found, creating one");
        
        if (!profileCreationAttempted) {
          setProfileCreationAttempted(true);
          // Try to create a new profile if one doesn't exist
          try {
            const createdProfile = await createProfileIfNotExists(userId);
            
            if (createdProfile) {
              console.log("[useAuthState] Created new profile for user");
              console.log("[useAuthState] Admin status:", createdProfile.is_admin);
              setProfile(createdProfile);
              setAdminStatus(createdProfile.is_admin || false);
              
              if (createdProfile.is_admin) {
                setIsAdminVerified(true);
                setAdminVerificationState('verified');
              } else {
                setAdminVerificationState('failed');
              }
            } else {
              const error = new Error("Failed to create profile");
              console.error("[useAuthState]", error);
              setProfileError(error);
              toast.error("Failed to create user profile. Please try refreshing the page.");
              setProfile(null);
              setAdminStatus(false);
              setAdminVerificationState('failed');
            }
          } catch (error: any) {
            console.error("[useAuthState] Error creating profile:", error);
            setProfileError(error);
            toast.error("Failed to create user profile. Please try refreshing the page.");
            setProfile(null);
            setAdminStatus(false);
            setAdminVerificationState('failed');
          }
        }
      } else {
        console.log("[useAuthState] Found existing profile, admin status:", profileData.is_admin);
        setProfile(profileData);
        setAdminStatus(profileData.is_admin || false);
        
        if (profileData.is_admin) {
          setIsAdminVerified(true);
          setAdminVerificationState('verified');
          console.log("[useAuthState] Admin status verified from profile data");
        } else {
          setIsAdminVerified(false);
          setAdminVerificationState('failed');
        }
      }
    } catch (error: any) {
      console.error("[useAuthState] Error fetching profile:", error);
      setProfileError(error);
      toast.error("Failed to load user profile. Please try refreshing the page.");
      setProfile(null);
      setAdminStatus(false);
    } finally {
      setIsProfileLoading(false);
      setIsLoading(false);
    }
  }, [profileCreationAttempted]);

  // Add debounce functionality to avoid too frequent refreshes
  const refreshProfile = useCallback(async () => {
    if (!user) {
      console.log("[useAuthState] Cannot refresh profile: no user");
      return;
    }
    
    // Prevent too frequent refreshes (e.g., within 1 second)
    const now = Date.now();
    if (now - lastRefreshTime < 1000) {
      console.log("[useAuthState] Skipping refresh profile - too soon after last refresh");
      return;
    }
    
    setLastRefreshTime(now);
    console.log("[useAuthState] Refreshing profile for user:", user.id);
    setIsProfileLoading(true);
    setProfileCreationAttempted(false); // Reset this flag to allow re-creation attempt
    await fetchProfile(user.id);
  }, [user, fetchProfile, lastRefreshTime]);

  // Force refresh if we have a user but no profile
  useEffect(() => {
    if (user && !profile && !isProfileLoading && !profileError) {
      console.log("[useAuthState] Have user but no profile, triggering refresh");
      refreshProfile();
    }
  }, [user, profile, isProfileLoading, profileError, refreshProfile]);

  // Use the extracted authentication initialization logic with improved admin handling
  useAuthInitialization({
    setSession,
    setUser,
    setIsLoading,
    fetchProfile,
    setIsProfileLoading,
    setAdminVerificationState
  });
  
  // Add explicit logging for admin status with deterministic verification
  useEffect(() => {
    if (user && profile !== null) {
      const isAdmin = profile?.is_admin || false;
      console.log(`[useAuthState] User ${user.id} admin status from profile: ${isAdmin}`);
      setAdminStatus(isAdmin);
      
      // If profile says user is admin, mark as verified
      if (isAdmin && !isAdminVerified) {
        console.log("[useAuthState] Setting admin as verified based on profile data");
        setIsAdminVerified(true);
        setAdminVerificationState('verified');
      }
    }
  }, [user, profile, isAdminVerified]);
  
  // Add function to force admin verification
  const forceVerifyAdmin = useCallback(async () => {
    if (!user) {
      console.log("[useAuthState] Cannot verify admin status: no user");
      return false;
    }
    
    console.log("[useAuthState] Forcing admin verification");
    setAdminVerificationState('pending');
    
    try {
      const isAdmin = await forceAdminVerification(user.id);
      
      setAdminStatus(isAdmin);
      setIsAdminVerified(isAdmin);
      setAdminVerificationState(isAdmin ? 'verified' : 'failed');
      
      return isAdmin;
    } catch (error) {
      console.error("[useAuthState] Error in force verification:", error);
      setAdminVerificationState('failed');
      return false;
    }
  }, [user]);

  return {
    session,
    user,
    profile,
    isAdmin: adminStatus,
    isAdminVerified,
    adminVerificationState,
    isLoading: isLoading || isProfileLoading,
    isProfileLoading,
    profileError,
    setProfile,
    refreshProfile,
    setProfileCreationAttempted,
    setIsAdminVerified,
    setAdminVerificationState,
    forceVerifyAdmin
  };
}
