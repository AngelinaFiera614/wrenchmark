
import { useState, useEffect, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getProfileById, createProfileIfNotExists } from "@/services/profileService";
import type { Profile } from "@/services/profileService";
import { toast } from "sonner";
import { useAuthInitialization } from "./useAuthInitialization";

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileCreationAttempted, setProfileCreationAttempted] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const [profileError, setProfileError] = useState<Error | null>(null);

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
              toast.success("Profile created successfully");
            } else {
              const error = new Error("Failed to create profile");
              console.error("[useAuthState]", error);
              setProfileError(error);
              toast.error("Failed to create user profile. Please try refreshing the page.");
              setProfile(null);
            }
          } catch (error: any) {
            console.error("[useAuthState] Error creating profile:", error);
            setProfileError(error);
            toast.error("Failed to create user profile. Please try refreshing the page.");
            setProfile(null);
          }
        }
      } else {
        console.log("[useAuthState] Found existing profile, admin status:", profileData.is_admin);
        setProfile(profileData);
      }
    } catch (error: any) {
      console.error("[useAuthState] Error fetching profile:", error);
      setProfileError(error);
      toast.error("Failed to load user profile. Please try refreshing the page.");
      setProfile(null);
    } finally {
      setIsProfileLoading(false);
      setIsLoading(false);
    }
  }, [profileCreationAttempted]);

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

  // Use the extracted authentication initialization logic
  useAuthInitialization({
    setSession,
    setUser,
    setIsLoading,
    fetchProfile,
    setIsProfileLoading
  });

  const adminStatus = profile?.is_admin || false;
  
  // Add explicit logging for admin status
  useEffect(() => {
    if (user && profile !== null) {
      console.log(`[useAuthState] User ${user.id} admin status: ${adminStatus}`);
    }
  }, [user, profile, adminStatus]);

  return {
    session,
    user,
    profile,
    isAdmin: adminStatus,
    isLoading: isLoading || isProfileLoading,
    isProfileLoading,
    profileError,
    setProfile,
    refreshProfile,
    setProfileCreationAttempted,
  };
}
