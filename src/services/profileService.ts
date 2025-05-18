
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  username: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
};

// Get profile by user ID
export const getProfileById = async (userId: string): Promise<Profile | null> => {
  try {
    console.log(`[profileService] Fetching profile for user ID: ${userId}`);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error("[profileService] Error fetching profile:", error);
      return null;
    }

    if (!data) {
      console.log(`[profileService] No profile found for user ID: ${userId}`);
      return null;
    }

    console.log(`[profileService] Successfully fetched profile for: ${data.username || userId}`);
    return data as Profile;
  } catch (error) {
    console.error("[profileService] Error in getProfileById:", error);
    return null;
  }
};

// Create profile if it doesn't exist
export const createProfileIfNotExists = async (userId: string, isAdmin: boolean = false): Promise<Profile | null> => {
  try {
    console.log(`[profileService] Checking if profile exists for user ID: ${userId}`);
    // First check if profile exists
    const existingProfile = await getProfileById(userId);
    if (existingProfile) {
      console.log(`[profileService] Profile already exists for user ID: ${userId}`);
      return existingProfile;
    }
    
    // Get user details from auth to populate profile
    console.log(`[profileService] Fetching auth user details for profile creation`);
    const { data: authData } = await supabase.auth.getUser(userId);
    if (!authData?.user) {
      console.error(`[profileService] Could not retrieve auth data for user ID: ${userId}`);
      return null;
    }
    
    const userEmail = authData?.user?.email || '';
    const username = userEmail.split('@')[0];
    const fullName = authData?.user?.user_metadata?.full_name;
    
    console.log(`[profileService] Creating new profile for user: ${username}`);
    // Profile doesn't exist, create one
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        is_admin: isAdmin,
        username: username,
        full_name: fullName
      }])
      .select()
      .single();

    if (error) {
      console.error("[profileService] Error creating profile:", error);
      
      // Check if the profile was actually created despite the error
      // This can happen with race conditions
      const profileCheck = await getProfileById(userId);
      if (profileCheck) {
        console.log("[profileService] Profile exists despite insertion error, returning it");
        return profileCheck;
      }
      
      return null;
    }

    console.log(`[profileService] Successfully created profile for: ${username}`);
    return data as Profile;
  } catch (error) {
    console.error("[profileService] Error in createProfileIfNotExists:", error);
    return null;
  }
};

// Update profile
export const updateProfile = async (profile: Partial<Profile> & { id: string }): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', profile.id)
      .select()
      .single();

    if (error) {
      console.error("[profileService] Error updating profile:", error);
      return null;
    }

    return data as Profile;
  } catch (error) {
    console.error("[profileService] Error in updateProfile:", error);
    return null;
  }
};

// Check if user is admin
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const profile = await getProfileById(userId);
    return profile?.is_admin || false;
  } catch (error) {
    console.error("[profileService] Error checking admin status:", error);
    return false;
  }
};

// Make user an admin
export const makeUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    // Check if profile exists, create if it doesn't
    await createProfileIfNotExists(userId, true);
    
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', userId);
      
    if (error) {
      console.error("[profileService] Error making user admin:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("[profileService] Error in makeUserAdmin:", error);
    return false;
  }
};
