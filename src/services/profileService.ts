
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

// Alias for getProfile to maintain compatibility with existing code
export const getProfileById = getProfile;

export async function createProfileIfNotExists(userId: string): Promise<Profile | null> {
  // First check if profile already exists
  const existingProfile = await getProfile(userId);
  if (existingProfile) {
    return existingProfile;
  }

  // Create new profile if it doesn't exist
  const newProfile = {
    id: userId,
    user_id: userId,
    username: null,
    full_name: null,
    avatar_url: null,
    bio: null,
    is_admin: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("profiles")
    .insert([newProfile])
    .select()
    .single();

  if (error) {
    console.error("Error creating profile:", error);
    return null;
  }

  return data;
}

export async function updateProfile(
  userId: string,
  profileData: Partial<Profile>
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .update(profileData)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }

  return data;
}
