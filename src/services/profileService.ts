
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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data as Profile | null;
  } catch (error) {
    console.error("Error in getProfileById:", error);
    return null;
  }
};

// Create profile if it doesn't exist
export const createProfileIfNotExists = async (userId: string, isAdmin: boolean = false): Promise<Profile | null> => {
  try {
    // First check if profile exists
    const existingProfile = await getProfileById(userId);
    if (existingProfile) {
      return existingProfile;
    }
    
    // Get user details from auth to populate profile
    const { data: authData } = await supabase.auth.getUser(userId);
    const userEmail = authData?.user?.email || '';
    const username = userEmail.split('@')[0];
    const fullName = authData?.user?.user_metadata?.full_name;
    
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
      console.error("Error creating profile:", error);
      return null;
    }

    return data as Profile;
  } catch (error) {
    console.error("Error in createProfileIfNotExists:", error);
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
      console.error("Error updating profile:", error);
      return null;
    }

    return data as Profile;
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return null;
  }
};

// Check if user is admin
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const profile = await getProfileById(userId);
    return profile?.is_admin || false;
  } catch (error) {
    console.error("Error checking admin status:", error);
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
      console.error("Error making user admin:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in makeUserAdmin:", error);
    return false;
  }
};
