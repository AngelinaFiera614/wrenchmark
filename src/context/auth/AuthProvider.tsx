
import React, { useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useAuthState } from "@/hooks/useAuthState";
import { signIn, signUp, signOut, updateProfileData, refreshSession } from "@/services/authService";
import type { Profile } from "@/services/profileService";
import { toast } from "sonner";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    session,
    user,
    profile,
    isAdmin,
    isLoading,
    setProfile,
    refreshProfile,
  } = useAuthState();

  // Immediately refresh session on initial render
  useEffect(() => {
    const initialRefresh = async () => {
      console.log("[AuthProvider] Performing initial session refresh");
      try {
        await refreshSession();
      } catch (error) {
        console.error("[AuthProvider] Error refreshing session on init:", error);
      }
    };
    
    initialRefresh();
  }, []);

  // Periodically refresh session to prevent expiration
  useEffect(() => {
    if (!session) return;
    
    console.log("[AuthProvider] Setting up session refresh interval");
    
    const intervalId = setInterval(async () => {
      console.log("[AuthProvider] Refreshing auth session");
      try {
        await refreshSession();
      } catch (error) {
        console.error("[AuthProvider] Error refreshing session:", error);
      }
    }, 5 * 60 * 1000); // Refresh every 5 minutes instead of 10
    
    return () => {
      console.log("[AuthProvider] Clearing session refresh interval");
      clearInterval(intervalId);
    };
  }, [session]);

  // Force profile refresh when user or session changes
  useEffect(() => {
    if (user && session) {
      console.log("[AuthProvider] User or session changed, refreshing profile");
      refreshProfile();
    }
  }, [user?.id, session?.access_token, refreshProfile]);

  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      // Auth state listener will handle session update
    } catch (error) {
      // Error handled in service
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      await signUp(email, password);
      // Auth state listener will handle session update
    } catch (error) {
      // Error handled in service
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Auth state listener will handle session update
    } catch (error) {
      // Error handled in service
    }
  };

  const handleUpdateProfile = async (profileData: Partial<Profile>) => {
    if (!user) {
      return;
    }

    try {
      const updatedProfile = await updateProfileData(user.id, profileData);
      setProfile(updatedProfile);
    } catch (error) {
      // Error handled in service
    }
  };

  const value = {
    session,
    user,
    profile,
    isAdmin,
    isLoading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
