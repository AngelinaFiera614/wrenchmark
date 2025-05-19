
import { useState, useCallback, useEffect, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { getProfileById, createProfileIfNotExists, Profile } from "@/services/profileService";
import { toast } from "sonner";

/**
 * Hook for managing user profile data
 */
export function useProfile(user: User | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileCreationAttempted, setProfileCreationAttempted] = useState(false);
  const [profileError, setProfileError] = useState<Error | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log(`[useProfile] Fetching profile data for user: ${userId}`);
      setIsProfileLoading(true);
      setProfileError(null);
      
      const profileData = await getProfileById(userId);
      
      if (!profileData) {
        console.log("[useProfile] No profile found, creating one");
        
        if (!profileCreationAttempted) {
          setProfileCreationAttempted(true);
          // Try to create a new profile if one doesn't exist
          try {
            const createdProfile = await createProfileIfNotExists(userId);
            
            if (createdProfile) {
              console.log("[useProfile] Created new profile for user");
              console.log("[useProfile] Admin status:", createdProfile.is_admin);
              setProfile(createdProfile);
            } else {
              const error = new Error("Failed to create profile");
              console.error("[useProfile]", error);
              setProfileError(error);
              toast.error("Failed to create user profile. Please try refreshing the page.");
              setProfile(null);
            }
          } catch (error: any) {
            console.error("[useProfile] Error creating profile:", error);
            setProfileError(error);
            toast.error("Failed to create user profile. Please try refreshing the page.");
            setProfile(null);
          }
        }
      } else {
        console.log("[useProfile] Found existing profile, admin status:", profileData.is_admin);
        setProfile(profileData);
      }
    } catch (error: any) {
      console.error("[useProfile] Error fetching profile:", error);
      setProfileError(error);
      toast.error("Failed to load user profile. Please try refreshing the page.");
      setProfile(null);
    } finally {
      setIsProfileLoading(false);
    }
  }, [profileCreationAttempted]);

  // Add debounce functionality to avoid too frequent refreshes
  const refreshProfile = useCallback(async () => {
    if (!user) {
      console.log("[useProfile] Cannot refresh profile: no user");
      return;
    }
    
    // Prevent too frequent refreshes (e.g., within 1 second)
    const now = Date.now();
    if (now - lastRefreshTime < 1000) {
      console.log("[useProfile] Skipping refresh profile - too soon after last refresh");
      return;
    }
    
    setLastRefreshTime(now);
    console.log("[useProfile] Refreshing profile for user:", user.id);
    setIsProfileLoading(true);
    setProfileCreationAttempted(false); // Reset this flag to allow re-creation attempt
    await fetchProfile(user.id);
  }, [user, fetchProfile, lastRefreshTime]);

  // Force refresh if we have a user but no profile
  useEffect(() => {
    if (user && !profile && !isProfileLoading && !profileError) {
      console.log("[useProfile] Have user but no profile, triggering refresh");
      refreshProfile();
    }
  }, [user, profile, isProfileLoading, profileError, refreshProfile]);

  return {
    profile,
    setProfile,
    isProfileLoading,
    profileError,
    fetchProfile,
    refreshProfile,
    setProfileCreationAttempted
  };
}
