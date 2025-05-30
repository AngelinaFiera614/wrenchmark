
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import type { Profile } from "@/services/profileService";

export function useProfile(user: User | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<Error | null>(null);

  const fetchProfile = async (userId: string) => {
    if (!userId) {
      setProfile(null);
      return;
    }

    setIsProfileLoading(true);
    setProfileError(null);

    try {
      console.log("[useProfile] Fetching profile for user:", userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error("[useProfile] Error fetching profile:", error);
        throw error;
      }

      if (data) {
        console.log("[useProfile] Profile found:", data);
        setProfile(data);
      } else {
        console.log("[useProfile] No profile found, creating one");
        // Auto-create profile if it doesn't exist
        await createProfileIfNotExists(userId);
      }
    } catch (err) {
      console.error("[useProfile] Profile fetch exception:", err);
      setProfileError(err as Error);
      
      // Try to create profile if fetch failed due to missing profile
      if ((err as any)?.code === 'PGRST116') {
        await createProfileIfNotExists(userId);
      }
    } finally {
      setIsProfileLoading(false);
    }
  };

  const createProfileIfNotExists = async (userId: string) => {
    try {
      console.log("[useProfile] Creating profile for user:", userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          user_id: userId,
          username: user?.email?.split('@')[0] || 'user',
          is_admin: false,
          full_name: user?.user_metadata?.full_name || null
        })
        .select()
        .single();

      if (error) {
        console.error("[useProfile] Error creating profile:", error);
        throw error;
      }

      console.log("[useProfile] Profile created:", data);
      setProfile(data);
      toast.success("Profile created successfully");
    } catch (err) {
      console.error("[useProfile] Profile creation failed:", err);
      setProfileError(err as Error);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id || !profile) {
      throw new Error("User must be logged in to update profile");
    }

    setIsProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("[useProfile] Profile update failed:", err);
      throw err;
    } finally {
      setIsProfileLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    } else {
      setProfile(null);
    }
  }, [user?.id]);

  return {
    profile,
    setProfile,
    isProfileLoading,
    profileError,
    refreshProfile,
    updateProfile
  };
}
