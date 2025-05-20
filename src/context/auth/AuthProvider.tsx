
import React, { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { Profile, getProfileById, createProfileIfNotExists } from "@/services/profileService";
import { toast } from "sonner";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch user profile
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log("[AuthProvider] Fetching profile for user:", userId);
      const profileData = await getProfileById(userId);
      
      if (profileData) {
        console.log("[AuthProvider] Profile found:", profileData.username);
        setProfile(profileData);
        setIsAdmin(profileData.is_admin || false);
      } else {
        console.log("[AuthProvider] No profile found, creating one");
        try {
          const newProfile = await createProfileIfNotExists(userId);
          if (newProfile) {
            setProfile(newProfile);
            setIsAdmin(newProfile.is_admin || false);
          }
        } catch (error) {
          console.error("[AuthProvider] Error creating profile:", error);
        }
      }
    } catch (error) {
      console.error("[AuthProvider] Error fetching profile:", error);
    }
  }, []);

  // Refresh user profile
  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  // Initialize authentication state
  useEffect(() => {
    if (isInitialized) return;
    
    const initAuth = async () => {
      try {
        console.log("[AuthProvider] Initializing auth");
        setIsLoading(true);
        
        // Set up auth state change listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log(`[AuthProvider] Auth event: ${event}`);
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            
            // Fetch profile after a slight delay to avoid race conditions
            if (currentSession?.user) {
              setTimeout(() => {
                fetchProfile(currentSession.user.id);
              }, 0);
            } else {
              setProfile(null);
              setIsAdmin(false);
            }
          }
        );
        
        // Then check for existing session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        if (data.session?.user) {
          await fetchProfile(data.session.user.id);
        }
        
        setIsInitialized(true);
        setIsLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error: any) {
        console.error("[AuthProvider] Auth initialization error:", error);
        setAuthError(error);
        setIsLoading(false);
      }
    };
    
    initAuth();
    
    // Force exit from loading state after maximum wait time
    const maxLoadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.error("[AuthProvider] CRITICAL: Force exiting loading state after timeout");
        setIsLoading(false);
      }
    }, 5000);
    
    return () => clearTimeout(maxLoadingTimeout);
  }, [isInitialized, isLoading, fetchProfile]);

  // Authentication methods
  const handleSignIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      console.error("[AuthProvider] Sign in error:", error);
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success("Signup successful! Please check your email to verify your account.");
    } catch (error: any) {
      console.error("[AuthProvider] Sign up error:", error);
      toast.error(error.message || "Failed to sign up");
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("You have been signed out");
    } catch (error: any) {
      console.error("[AuthProvider] Sign out error:", error);
      toast.error(error.message || "Failed to sign out");
    }
  };

  const handleUpdateProfile = async (profileData: Partial<Profile>) => {
    if (!user || !profile) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data as Profile);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("[AuthProvider] Update profile error:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  const value = {
    session,
    user,
    profile,
    isAdmin,
    isLoading,
    authError,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
