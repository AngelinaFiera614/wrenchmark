
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createProfileIfNotExists } from "@/services/profileService";
import { refreshSession, verifyAdminStatus } from "@/services/authService";

type ProtectedRouteProps = {
  requireAdmin?: boolean;
};

const ProtectedRoute = ({ requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isAdmin, profile, isLoading, refreshProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [lastVerificationTime, setLastVerificationTime] = useState(0);
  const [directAdminCheck, setDirectAdminCheck] = useState<boolean | null>(null);
  
  // Enhanced verification for admin access
  useEffect(() => {
    if (!isLoading && verificationAttempts > 2) {
      // We've already tried multiple times, stop trying
      setIsVerifying(false);
      return;
    }

    const verifyAccess = async () => {
      console.log("[ProtectedRoute] Verifying access", {
        isLoading,
        user: user ? user.id : "null",
        profile: profile ? `exists (admin: ${profile.is_admin})` : "null",
        isAdmin,
        requireAdmin,
        path: location.pathname,
        verificationAttempts,
        directAdminCheck
      });
      
      // If auth is still loading, wait for it
      if (isLoading) {
        console.log("[ProtectedRoute] Auth still loading, waiting...");
        return;
      }
      
      // No user means we'll redirect (handled in render)
      if (!user) {
        console.log("[ProtectedRoute] No user found, will redirect to auth");
        setIsVerifying(false);
        return;
      }

      // For admin routes, do a direct verification check separate from profile
      if (requireAdmin && directAdminCheck === null) {
        try {
          // Do a direct check against the database for admin status
          console.log("[ProtectedRoute] Performing direct admin status check");
          const adminStatus = await verifyAdminStatus(user.id);
          setDirectAdminCheck(adminStatus);
          
          if (adminStatus) {
            console.log("[ProtectedRoute] Direct admin check confirmed admin status");
            setIsVerifying(false);
            return;
          } else if (verificationAttempts > 0) {
            console.log("[ProtectedRoute] Direct admin check denied admin status");
            setIsVerifying(false);
            return;
          }
          // If this is the first attempt and direct check failed, continue with normal verification
        } catch (error) {
          console.error("[ProtectedRoute] Error in direct admin check:", error);
        }
      }

      // Try to refresh session if we need admin access
      if (requireAdmin && verificationAttempts === 0) {
        try {
          console.log("[ProtectedRoute] Admin route - refreshing session first");
          await refreshSession();
          // Short delay to allow auth state to update
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error("[ProtectedRoute] Error refreshing session:", error);
        }
      }
      
      // If no profile but we have user, try to create/fetch profile
      if (!profile) {
        // Avoid rapid re-attempts
        const now = Date.now();
        if (now - lastVerificationTime < 1000) {
          console.log("[ProtectedRoute] Skipping verification - too soon");
          return;
        }
        
        setLastVerificationTime(now);
        setVerificationAttempts(prev => prev + 1);
        
        try {
          console.log("[ProtectedRoute] No profile found, creating/refreshing");
          
          // First try to refresh existing profile
          await refreshProfile();
          
          // If that didn't work, try to create a new profile
          if (!profile && verificationAttempts < 2) {
            console.log("[ProtectedRoute] Attempting to create profile");
            const createdProfile = await createProfileIfNotExists(user.id);
            
            if (createdProfile) {
              console.log("[ProtectedRoute] Successfully created profile, refreshing");
              await refreshProfile();
            } else {
              console.error("[ProtectedRoute] Failed to create profile");
            }
          }
        } catch (error) {
          console.error("[ProtectedRoute] Error in profile verification:", error);
        }
      } else if (requireAdmin && !isAdmin && verificationAttempts < 2 && directAdminCheck !== true) {
        // We have a profile but not admin rights - refresh to double-check
        console.log("[ProtectedRoute] Have profile but not admin, refreshing profile");
        setVerificationAttempts(prev => prev + 1);
        
        try {
          await refreshProfile();
        } catch (error) {
          console.error("[ProtectedRoute] Error refreshing profile for admin check:", error);
        }
      } else {
        // We have all the information we need
        setIsVerifying(false);
      }
    };
    
    verifyAccess();
  }, [isLoading, user, profile, isAdmin, requireAdmin, location.pathname, 
      refreshProfile, verificationAttempts, lastVerificationTime, directAdminCheck]);
  
  // Show appropriate loading message based on state
  if (isLoading || (isVerifying && verificationAttempts < 3)) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-accent-teal" />
          <p className="text-muted-foreground">
            {requireAdmin ? "Verifying admin permissions..." : "Checking authentication..."}
          </p>
          {verificationAttempts > 0 && (
            <p className="text-xs text-muted-foreground">
              Verification attempt {verificationAttempts}/3
            </p>
          )}
        </div>
      </div>
    );
  }

  // If we've tried multiple times and still verifying, stop and show error
  if ((isVerifying && verificationAttempts >= 3) || (requireAdmin && !isAdmin && directAdminCheck === false)) {
    console.error("[ProtectedRoute] Verification failed after multiple attempts or direct admin check failed");
    toast.error("Failed to verify permissions. Please try signing out and back in.");
    
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-red-500">Authentication verification failed</p>
          <button 
            className="px-4 py-2 bg-accent-teal text-black rounded" 
            onClick={() => navigate("/auth")}
          >
            Return to login
          </button>
        </div>
      </div>
    );
  }

  // If not logged in at all, redirect to auth
  if (!user) {
    console.log("[ProtectedRoute] User not authenticated, redirecting to auth page");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not an admin and direct check failed
  if (requireAdmin && !isAdmin && directAdminCheck !== true) {
    console.log("[ProtectedRoute] User not admin, access denied");
    toast.error("You don't have permission to access this area");
    return <Navigate to="/" replace />;
  }

  // Direct admin check passed or profile indicates admin
  if (requireAdmin && (directAdminCheck === true || isAdmin)) {
    console.log("[ProtectedRoute] Admin access granted to path:", location.pathname);
    return <Outlet />;
  }

  // Non-admin protected route
  console.log("[ProtectedRoute] Access granted to path:", location.pathname);
  return <Outlet />;
};

export default ProtectedRoute;
