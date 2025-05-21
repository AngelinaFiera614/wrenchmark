
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';

// Define the Profile type
type Profile = {
  id: string;
  user_id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
};

// Define the ProfileContext type
type ProfileContextType = {
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
};

// Create the context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Create the ProfileProvider component
export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user || !profile) {
      throw new Error("User must be logged in to update profile");
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(updatedProfile);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const value = {
    profile,
    isLoading,
    error,
    refreshProfile: fetchProfile,
    updateProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

// Create a hook to use the profile context
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export default ProfileProvider;
