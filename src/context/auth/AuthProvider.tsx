
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

  // Authentication methods with proper error handling
  const handleSignIn = async (email: string, password: string): Promise<void> => {
    try {
      console.log("[AuthProvider] Starting sign in process");
      if (!email || !password) {
        console.error("[AuthProvider] Missing credentials");
        toast.error("Email and password are required");
        throw new Error("Email and password are required");
      }
      
      console.log("[AuthProvider] Calling signIn service");
      const result = await signIn(email, password);
      console.log("[AuthProvider] Sign in service completed:", result);
    } catch (error: any) {
      console.error("[AuthProvider] Sign in error:", error);
      throw error; // Allow calling code to handle the error
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        toast.error("Email and password are required");
        throw new Error("Email and password are required");
      }
      
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        throw new Error("Password must be at least 6 characters");
      }
      
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
      toast.error("Sign out failed. Please try again.");
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
      toast.error(error.message || "Failed to update profile");
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
