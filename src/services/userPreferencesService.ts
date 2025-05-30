
import { supabase } from "@/integrations/supabase/client";

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: string;
  measurement_unit: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  privacy_level: string;
  created_at: string;
  updated_at: string;
}

export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  try {
    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching user preferences:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch user preferences:", error);
    return null;
  }
}

export async function createUserPreferences(
  userId: string,
  preferences: Partial<UserPreferences>
): Promise<UserPreferences> {
  const { data, error } = await supabase
    .from("user_preferences")
    .insert({
      user_id: userId,
      ...preferences
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating user preferences:", error);
    throw error;
  }

  return data;
}

export async function updateUserPreferences(
  userId: string,
  preferences: Partial<UserPreferences>
): Promise<UserPreferences> {
  const { data, error } = await supabase
    .from("user_preferences")
    .update(preferences)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user preferences:", error);
    throw error;
  }

  return data;
}

export async function upsertUserPreferences(
  userId: string,
  preferences: Partial<UserPreferences>
): Promise<UserPreferences> {
  const { data, error } = await supabase
    .from("user_preferences")
    .upsert({
      user_id: userId,
      ...preferences
    })
    .select()
    .single();

  if (error) {
    console.error("Error upserting user preferences:", error);
    throw error;
  }

  return data;
}
