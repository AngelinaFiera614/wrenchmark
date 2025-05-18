
import { useState, useEffect, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getProfileById, createProfileIfNotExists } from "@/services/profileService";
import type { Profile } from "@/services/profileService";
import { toast } from "sonner";

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authChangeComplete, setAuthChangeComplete] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileCreationAttempted, setProfileCreationAttempted] = useState(false);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log("Fetching profile data for user:", userId);
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
        console.log("Admin status:", profileData.is_admin);
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
    setIsProfileLoading(true);
    setProfileCreationAttempted(false); // Reset this flag to allow re-creation attempt
    await fetchProfile(user.id);
  }, [user, fetchProfile]);

  useEffect(() => {
    console.log("Setting up auth state listener");
    // Set up auth state listener FIRST to prevent missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Use setTimeout to prevent deadlock and set a flag to avoid double fetching
          if (!isProfileLoading) {
            setIsProfileLoading(true);
            setTimeout(() => {
              fetchProfile(currentSession.user.id);
            }, 0);
          }
        } else {
          setProfile(null);
          setProfileCreationAttempted(false);
          // Only set loading to false if this is not the initial load
          if (authChangeComplete) {
            setIsLoading(false);
          }
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Got session:", currentSession?.user?.email || "No session");
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsLoading(false);
      }

      // Mark initial auth check as complete
      setAuthChangeComplete(true);
    };

    initializeAuth();

    return () => {
      console.log("Unsubscribing from auth state changes");
      subscription.unsubscribe();
    };
  }, [fetchProfile, isProfileLoading]);

  return {
    session,
    user,
    profile,
    isAdmin: profile?.is_admin || false,
    isLoading,
    isProfileLoading,
    setProfile,
    refreshProfile,
    setProfileCreationAttempted,
  };
}
