
import React, { useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { useAuthState } from "@/hooks/auth/useAuthState";
import { signIn, signUp, signOut, updateProfileData } from "@/services/auth/authenticationService";
import { toast } from "sonner";

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

  const handleUpdateProfile = async (profileData: Partial<typeof profile>) => {
    if (!user || !profile) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    try {
      const updatedProfile = await updateProfileData(user.id, profileData);
      if (updatedProfile) {
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
    adminVerificationState,
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
