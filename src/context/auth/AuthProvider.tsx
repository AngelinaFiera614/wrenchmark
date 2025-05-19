
import React, { useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useAuthState } from "@/hooks/useAuthState";
import { 
  signIn, 
  signUp, 
  signOut, 
  updateProfileData, 
  verifyAdminStatus, 
  forceAdminVerification 
} from "@/services/auth";
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
    setIsAdminVerified,
    isAdminVerified,
    adminVerificationState,
    forceVerifyAdmin
  } = useAuthState();

  // Only verify admin status separately from profile if we have a user and
  // haven't verified admin status yet
  useEffect(() => {
    if (!user || isAdminVerified || adminVerificationState !== 'pending') return;
    
    // Use profile as source of truth when available
    if (profile?.is_admin === true) {
      console.log("[AuthProvider] Admin status verified from profile");
      setIsAdminVerified(true);
      return;
    }

    // Verify admin status if profile doesn't indicate admin status
    const checkAdminStatus = async () => {
      try {
        console.log("[AuthProvider] Performing direct admin verification");
        // Avoid race conditions by adding a small delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const isUserAdmin = await verifyAdminStatus(user.id);
        
        if (isUserAdmin) {
          console.log("[AuthProvider] User confirmed as admin via direct check");
          setIsAdminVerified(true);
        } else {
          console.log("[AuthProvider] User is not admin via direct check");
          setIsAdminVerified(false);
        }
      } catch (error) {
        console.error("[AuthProvider] Error during admin verification:", error);
      }
    };
    
    // Add a delay before verification to reduce race conditions
    const timeoutId = setTimeout(checkAdminStatus, 600);
    return () => clearTimeout(timeoutId);
  }, [user, profile, isAdminVerified, setIsAdminVerified, adminVerificationState]);

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
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
    refreshProfile,
    forceAdminVerification: handleForceAdminVerification
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
