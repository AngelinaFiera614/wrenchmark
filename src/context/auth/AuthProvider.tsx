
import React, { useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useAuthState } from "@/hooks/useAuthState";
import { signIn, signUp, signOut, updateProfileData, refreshSession, verifyAdminStatus } from "@/services/authService";
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
  } = useAuthState();

  // Immediately refresh session on initial render with a debounce mechanism
  useEffect(() => {
    let didCancel = false;
    let refreshAttempts = 0;
    const MAX_REFRESH_ATTEMPTS = 2;
    
    const initialRefresh = async () => {
      if (didCancel || refreshAttempts >= MAX_REFRESH_ATTEMPTS) return;
      
      refreshAttempts++;
      console.log(`[AuthProvider] Performing session refresh (attempt ${refreshAttempts}/${MAX_REFRESH_ATTEMPTS})`);
      
      try {
        await refreshSession();
      } catch (error) {
        console.error("[AuthProvider] Error refreshing session on init:", error);
      }
    };
    
    const timeoutId = setTimeout(initialRefresh, 500); // Small delay to let auth initialize first
    
    return () => {
      didCancel = true;
      clearTimeout(timeoutId);
    };
  }, []);

  // Periodically refresh session to prevent expiration using an adaptive interval
  useEffect(() => {
    if (!session) return;
    
    console.log("[AuthProvider] Setting up session refresh interval");
    
    // Calculate when the session will expire
    const expiresAt = session.expires_at;
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = expiresAt - now;
    
    // Refresh at least 5 minutes before expiry, but not more than every 10 minutes
    // This prevents refreshing too often but ensures we refresh before expiry
    const refreshInterval = Math.min(
      Math.max(timeUntilExpiry - 300, 300), // At least 5 min before expiry but min 5 min interval
      600 // Max 10 minutes
    ) * 1000;
    
    console.log(`[AuthProvider] Session refresh interval set to ${refreshInterval/1000} seconds`);
    
    const intervalId = setInterval(async () => {
      console.log("[AuthProvider] Refreshing auth session");
      try {
        await refreshSession();
      } catch (error) {
        console.error("[AuthProvider] Error refreshing session:", error);
      }
    }, refreshInterval);
    
    return () => {
      console.log("[AuthProvider] Clearing session refresh interval");
      clearInterval(intervalId);
    };
  }, [session]);

  // Verify admin status separately from profile, with improved stability
  useEffect(() => {
    // Only run admin verification if we have a user and haven't verified admin status yet
    if (!user || isAdminVerified) return;
    
    // Avoid race conditions by using a deterministic source of admin status
    if (profile?.is_admin === true) {
      console.log("[AuthProvider] Admin status verified from profile");
      setIsAdminVerified(true);
      return;
    }

    // Only proceed with direct admin check if profile exists but doesn't have admin
    // or if we haven't verified status yet
    const checkAdminStatus = async () => {
      try {
        console.log("[AuthProvider] Performing direct admin verification");
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
    
    const timeoutId = setTimeout(checkAdminStatus, 300);
    return () => clearTimeout(timeoutId);
  }, [user, profile, isAdminVerified, setIsAdminVerified, adminVerificationState]);

  // Force profile refresh when user or session changes, with debouncing
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
    isAdminVerified,
    adminVerificationState,
    isLoading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
