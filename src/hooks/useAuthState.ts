
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

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log("Fetching profile data for user:", userId);
      setIsProfileLoading(true);
      const profileData = await getProfileById(userId);
      
      if (!profileData) {
        console.log("No profile found, creating one");
        
        if (!profileCreationAttempted) {
          setProfileCreationAttempted(true);
          // Try to create a new profile if one doesn't exist
          try {
            const createdProfile = await createProfileIfNotExists(userId);
            
            if (createdProfile) {
              console.log("Created new profile for user");
              console.log("Admin status:", createdProfile.is_admin);
              setProfile(createdProfile);
              toast.success("Profile created successfully");
            } else {
              console.error("Failed to create profile");
              toast.error("Failed to create user profile. Please try refreshing the page.");
              setProfile(null);
            }
          } catch (profileError) {
            console.error("Error creating profile:", profileError);
            toast.error("Failed to create user profile. Please try refreshing the page.");
            setProfile(null);
          }
        }
      } else {
        console.log("Found existing profile, admin status:", profileData.is_admin);
        setProfile(profileData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load user profile. Please try refreshing the page.");
      setProfile(null);
    } finally {
      setIsProfileLoading(false);
      setIsLoading(false);
    }
  }, [profileCreationAttempted]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    
    // Prevent too frequent refreshes (e.g., within 2 seconds)
    const now = Date.now();
    if (now - lastRefreshTime < 2000) {
      console.log("Skipping refresh profile - too soon after last refresh");
      return;
    }
    
    setLastRefreshTime(now);
    console.log("Refreshing profile for user:", user.id);
    setIsProfileLoading(true);
    setProfileCreationAttempted(false); // Reset this flag to allow re-creation attempt
    await fetchProfile(user.id);
  }, [user, fetchProfile, lastRefreshTime]);

  // Use the extracted authentication initialization logic
  useAuthInitialization({
    setSession,
    setUser,
    setIsLoading,
    fetchProfile,
    setIsProfileLoading
  });

  return {
    session,
    user,
    profile,
    isAdmin: profile?.is_admin || false,
    isLoading: isLoading || isProfileLoading,
    isProfileLoading,
    setProfile,
    refreshProfile,
    setProfileCreationAttempted,
  };
}
