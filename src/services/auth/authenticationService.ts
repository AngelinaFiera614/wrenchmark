
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getProfile, createProfileIfNotExists } from "@/services/profileService";
import type { Profile } from "@/services/profileService";

export async function signIn(email: string, password: string) {
  console.log("Signing in user:", email);
  try {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    console.log("Sign in successful");

    if (data.user) {
      // Ensure profile exists after login
      const profile = await getProfile(data.user.id);
      if (!profile) {
        console.log("Creating profile after login");
        const createdProfile = await createProfileIfNotExists(data.user.id);
        if (!createdProfile) {
          toast.error("Failed to create profile. Please try refreshing.");
        }
      }
    }
    return data;
  } catch (error: any) {
    toast.error(error.message || "Failed to sign in");
    throw error;
  }
}

export async function signUp(email: string, password: string) {
  try {
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    
    // Create profile immediately after signup if we have a user
    if (data.user) {
      console.log("Creating profile immediately after signup");
      const createdProfile = await createProfileIfNotExists(data.user.id);
      if (!createdProfile) {
        console.log("Failed to create profile during signup");
      }
    }
    
    toast.success("Signup successful! Please check your email to verify your account.");
    return data;
  } catch (error: any) {
    toast.error(error.message || "Failed to sign up");
    throw error;
  }
}

export async function signOut() {
  try {
    await supabase.auth.signOut();
    toast.success("You have been signed out");
  } catch (error: any) {
    toast.error(error.message || "Failed to sign out");
    throw error;
  }
}

export async function updateProfileData(
  userId: string, 
  profileData: Partial<Profile>
) {
  if (!userId) {
    toast.error("User ID not available for profile update");
    throw new Error("User ID not available");
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    
    toast.success("Profile updated successfully");
    return data as Profile;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    toast.error(error.message || "Failed to update profile");
    throw error;
  }
}
