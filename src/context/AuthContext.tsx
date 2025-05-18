
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

type Profile = {
  id: string;
  username: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authChangeComplete, setAuthChangeComplete] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  useEffect(() => {
    console.log("Setting up auth state listener");
    // Set up auth state listener FIRST to prevent missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Handle profile fetching with proper loading states
        if (currentSession?.user) {
          // Use setTimeout to prevent deadlock and set a flag to avoid double fetching
          if (!isProfileLoading) {
            setIsProfileLoading(true);
            setTimeout(() => {
              console.log("Fetching profile for user:", currentSession.user.id);
              fetchProfile(currentSession.user.id);
            }, 0);
          }
        } else {
          setProfile(null);
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
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile data for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      console.log("Profile data received:", data ? "Yes" : "No");
      
      if (!data) {
        console.log("No profile found, creating one");
        // Create a default profile for the user
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([{
            id: userId,
            is_admin: false, // Default to non-admin
            username: user?.email?.split('@')[0] || null,
          }])
          .select("*")
          .single();
        
        if (createError) {
          console.error("Error creating profile:", createError);
          toast.error("Failed to create user profile. Some features may not work correctly.");
          setProfile(null);
        } else {
          console.log("Created new profile for user");
          setProfile(newProfile as Profile);
        }
      } else {
        console.log("Admin status:", data.is_admin);
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load user profile. Some features may not work correctly.");
      setProfile(null);
    } finally {
      setIsProfileLoading(false);
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log("Signing in user:", email);
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      console.log("Sign in successful");
      // Auth state listener will handle session update
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success("Signup successful! Please check your email to verify your account.");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      toast.success("You have been signed out");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    try {
      setIsLoading(true);
      
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
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    user,
    profile,
    isAdmin: profile?.is_admin || false,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
