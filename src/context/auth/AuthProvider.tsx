
import React, { useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { useAuthState } from "@/hooks/auth/useAuthState";
import { signIn, signUp, signOut } from "@/services/auth/authenticationService";
import { updateProfile as updateProfileService } from "@/services/profileService";
import { toast } from "sonner";
import type { Profile } from "@/services/profileService";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    session,
    user,
    profile,
    isAdmin,
    isAdminVerified,
    adminVerificationState,
    isLoading,
    refreshProfile,
    setProfile
  } = useAuthState();

  // Authentication methods
  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn(email, password);
    } catch (error: any) {
      console.error("[AuthProvider] Sign in error:", error);
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      await signUp(email, password);
    } catch (error: any) {
      console.error("[AuthProvider] Sign up error:", error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.error("[AuthProvider] Sign out error:", error);
    }
  };

  const handleUpdateProfile = async (profileData: Partial<Profile>) => {
    if (!user || !profile) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    try {
      const updatedProfile = await updateProfileService(user.id, profileData);
      if (updatedProfile && setProfile) {
        setProfile(updatedProfile);
      }
    } catch (error: any) {
      console.error("[AuthProvider] Update profile error:", error);
    }
  };

  const value = {
    session,
    user,
    profile,
    isAdmin,
    isAdminVerified,
    adminVerificationState: adminVerificationState as any, // Type assertion to match context type
    isLoading,
    authError: null, // We handle errors directly in the methods now
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
