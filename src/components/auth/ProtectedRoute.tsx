
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createProfileIfNotExists } from "@/services/profileService";
import { refreshSession } from "@/services/authService";

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
  
  // Enhanced verification for admin access
  useEffect(() => {
    const verifyAccess = async () => {
      console.log("[ProtectedRoute] Verifying access", {
        isLoading,
        user: user ? user.id : "null",
        profile: profile ? `exists (admin: ${profile.is_admin})` : "null",
        isAdmin,
        requireAdmin,
        path: location.pathname,
        verificationAttempts
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

      // Try to refresh session if we need admin access
      if (requireAdmin && verificationAttempts === 0) {
        try {
          console.log("[ProtectedRoute] Admin route - refreshing session first");
          await refreshSession();
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
      } else if (requireAdmin && !isAdmin && verificationAttempts < 2) {
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
      refreshProfile, verificationAttempts, lastVerificationTime]);
  
  // Show appropriate loading message based on state
  if (isLoading || (isVerifying && verificationAttempts < 3)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-accent-teal" />
          <p className="text-muted-foreground">
            {isVerifying ? "Verifying permissions..." : "Checking authentication..."}
          </p>
          {verificationAttempts > 1 && (
            <p className="text-xs text-muted-foreground">
              This is taking longer than expected...
            </p>
          )}
        </div>
      </div>
    );
  }

  // If we've tried multiple times and still verifying, stop and show error
  if (isVerifying && verificationAttempts >= 3) {
    console.error("[ProtectedRoute] Verification failed after multiple attempts");
    toast.error("Failed to verify permissions. Please try signing out and back in.");
    
    // Fallback for admin access - allow access if we have a user
    if (requireAdmin && user) {
      console.warn("[ProtectedRoute] Allowing admin access as fallback after verification failure");
      return <Outlet />;
    }
    
    return (
      <div className="flex justify-center items-center h-screen">
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

  // If admin access is required but user is not an admin
  if (requireAdmin && !isAdmin) {
    console.log("[ProtectedRoute] User not admin, access denied");
    toast.error("You don't have permission to access this area");
    return <Navigate to="/" replace />;
  }

  // If user is authenticated (and is admin if required), render the protected content
  console.log("[ProtectedRoute] Access granted to path:", location.pathname);
  return <Outlet />;
};

export default ProtectedRoute;
