
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  updated_at: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  email: string | null;
  skill_level: string | null;
  bio: string | null;
  motorcycle_id: string | null;
  created_at: string;
}

export async function getProfileById(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error("[profileService] Error fetching profile:", error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error("[profileService] Unexpected error in getProfileById:", error);
    return null;
  }
}

export async function createProfileIfNotExists(userId: string): Promise<Profile | null> {
  // First check if profile exists
  const existingProfile = await getProfileById(userId);
  if (existingProfile) return existingProfile;
  
  // Create new profile if it doesn't exist
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          username: null,
          full_name: null,
          avatar_url: null,
          email: userData.user?.email,
          is_admin: false,
          skill_level: 'beginner'
        }
      ])
      .select()
      .single();
      
    if (error) {
      console.error("[profileService] Error creating profile:", error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error("[profileService] Unexpected error in createProfileIfNotExists:", error);
    return null;
  }
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      console.error("[profileService] Error updating profile:", error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error("[profileService] Unexpected error in updateProfile:", error);
    return null;
  }
}
