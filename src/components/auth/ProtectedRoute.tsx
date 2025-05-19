import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createProfileIfNotExists } from "@/services/profileService";
import { refreshSession, verifyAdminStatus } from "@/services/auth";

type ProtectedRouteProps = {
  requireAdmin?: boolean;
};

const ProtectedRoute = ({ requireAdmin = false }: ProtectedRouteProps) => {
  const { 
    user, 
    isAdmin, 
    isAdminVerified, 
    profile, 
    isLoading, 
    adminVerificationState, 
    refreshProfile,
    forceAdminVerification
  } = useAuth();
  
  const location = useLocation();
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [localAdminVerified, setLocalAdminVerified] = useState(false);
  
  // Enhanced verification for admin routes
  useEffect(() => {
    // Only perform verification for admin routes
    if (!requireAdmin) return;
    
    // Skip verification if already verified through the auth context
    if (isAdminVerified) {
      console.log("[ProtectedRoute] Admin already verified via context, allowing access");
      setLocalAdminVerified(true);
      return;
    }
    
    // If verification is in progress or we've determined admin status, don't re-verify
    if (verificationInProgress || localAdminVerified) return;
    
    const verifyAdminAccess = async () => {
      console.log("[ProtectedRoute] Verifying admin access", {
        isLoading,
        user: user ? user.id : "null",
        profile: profile ? "exists" : "null",
        isAdmin,
        adminVerificationState
      });
      
      // If auth is still loading, wait
      if (isLoading) {
        console.log("[ProtectedRoute] Auth still loading, waiting...");
        return;
      }
      
      // If no user, we'll redirect (handled in render)
      if (!user) {
        console.log("[ProtectedRoute] No user found, will redirect");
        return;
      }
      
      setVerificationInProgress(true);
      
      try {
        // First try force verification through the AuthContext
        console.log("[ProtectedRoute] Performing force admin verification");
        const isAdminUser = await forceAdminVerification();
        
        if (isAdminUser) {
          console.log("[ProtectedRoute] Force verification confirmed admin status");
          setLocalAdminVerified(true);
          return;
        }
        
        // If force verification failed, try a direct check
        console.log("[ProtectedRoute] Force verification failed, trying direct check");
        const directCheck = await verifyAdminStatus(user.id);
        
        if (directCheck) {
          console.log("[ProtectedRoute] Direct check confirmed admin status");
          setLocalAdminVerified(true);
        } else {
          // One last attempt - refresh profile and session
          console.log("[ProtectedRoute] Direct check failed, trying profile refresh");
          
          await refreshSession();
          if (!profile) {
            await createProfileIfNotExists(user.id);
          }
          await refreshProfile();
          
          // Final check
          const finalCheck = await verifyAdminStatus(user.id);
          setLocalAdminVerified(finalCheck);
          
          console.log("[ProtectedRoute] Final admin check result:", finalCheck);
        }
      } catch (error) {
        console.error("[ProtectedRoute] Error in admin verification:", error);
        setLocalAdminVerified(false);
      } finally {
        setVerificationInProgress(false);
      }
    };
    
    verifyAdminAccess();
  }, [
    user, 
    profile, 
    isAdmin, 
    isAdminVerified, 
    requireAdmin, 
    isLoading, 
    adminVerificationState,
    refreshProfile,
    verificationInProgress,
    localAdminVerified,
    forceAdminVerification
  ]);
  
  // Show loading state during verification
  if (isLoading || (requireAdmin && verificationInProgress)) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-accent-teal" />
          <p className="text-muted-foreground">
            {requireAdmin ? "Verifying admin permissions..." : "Checking authentication..."}
          </p>
        </div>
      </div>
    );
  }

  // If not logged in at all, redirect to auth
  if (!user) {
    console.log("[ProtectedRoute] User not authenticated, redirecting to auth page");
    toast.error("Please sign in to continue");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // For admin routes, check verification status
  if (requireAdmin && !isAdmin && !isAdminVerified && !localAdminVerified) {
    console.log("[ProtectedRoute] User not admin, access denied");
    toast.error("You don't have permission to access this area");
    return <Navigate to="/" replace />;
  }

  // Allow access if:
  // 1. Not an admin route, OR
  // 2. Admin route AND (isAdmin OR isAdminVerified OR localAdminVerified)
  console.log("[ProtectedRoute] Access granted to path:", location.pathname);
  return <Outlet />;
};

export default ProtectedRoute;
