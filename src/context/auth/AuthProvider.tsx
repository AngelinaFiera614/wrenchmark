
import React from "react";
import { AuthContext } from "./AuthContext";
import { useAuthState } from "@/hooks/auth/useAuthState";
import { 
  signIn, 
  signUp, 
  signOut, 
  updateProfileData
} from "@/services/auth";
import type { Profile } from "@/services/profileService";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    session,
    user,
    profile,
    isAdmin,
    isLoading,
    authInitError, // Now including authInitError
    setProfile,
    refreshProfile,
    isAdminVerified,
    adminVerificationState,
    forceVerifyAdmin
  } = useAuthState();

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
      console.error("[AuthProvider] Error during sign out:", error);
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
      console.error("[AuthProvider] Error updating profile:", error);
    }
  };
  
  const handleForceAdminVerification = async () => {
    if (forceVerifyAdmin) {
      return await forceVerifyAdmin();
    }
    return false;
  };

  const value = {
    session,
    user,
    profile,
    isAdmin,
    isAdminVerified,
    adminVerificationState,
    isLoading,
    authInitError, // Added to context value
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
    refreshProfile,
    forceAdminVerification: handleForceAdminVerification
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
