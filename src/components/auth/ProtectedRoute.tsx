
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
  const { user, isAdmin, isAdminVerified, profile, isLoading, adminVerificationState, refreshProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [localVerified, setLocalVerified] = useState(false);
  
  // Enhanced verification for admin access - within the component only
  useEffect(() => {
    // Only perform additional verification for admin routes
    if (!requireAdmin) return;
    
    // If already verified through the auth context
    if (isAdminVerified) {
      console.log("[ProtectedRoute] Admin already verified via context, allowing access");
      setLocalVerified(true);
      return;
    }
    
    // If we have confirmation user is admin from profile
    if (isAdmin && adminVerificationState === 'verified') {
      console.log("[ProtectedRoute] Admin verified via profile, allowing access");
      setLocalVerified(true);
      return;
    }

    const verifyAccess = async () => {
      console.log("[ProtectedRoute] Verifying admin access", {
        isLoading,
        user: user ? user.id : "null",
        profile: profile ? `exists (admin: ${profile.is_admin})` : "null",
        isAdmin,
        requireAdmin,
        path: location.pathname,
        adminVerificationState
      });
      
      // If auth is still loading, wait for it
      if (isLoading) {
        console.log("[ProtectedRoute] Auth still loading, waiting...");
        return;
      }
      
      // No user means we'll redirect (handled in render)
      if (!user) {
        console.log("[ProtectedRoute] No user found, will redirect to auth");
        return;
      }

      try {
        // Do a direct check against the database for admin status as a final verification
        console.log("[ProtectedRoute] Performing direct admin status check");
        const adminStatus = await verifyAdminStatus(user.id);
        
        if (adminStatus) {
          console.log("[ProtectedRoute] Direct admin check confirmed admin status");
          setLocalVerified(true);
        } else {
          console.log("[ProtectedRoute] Direct admin check denied admin status");
          
          // Final attempt to refresh profile and session
          try {
            await refreshSession();
            
            // If no profile, try to create one
            if (!profile) {
              await createProfileIfNotExists(user.id);
            }
            
            await refreshProfile();
            
            // Check admin status one last time
            const finalCheck = await verifyAdminStatus(user.id);
            setLocalVerified(finalCheck);
          } catch (error) {
            console.error("[ProtectedRoute] Error in final verification attempt:", error);
            setLocalVerified(false);
          }
        }
      } catch (error) {
        console.error("[ProtectedRoute] Error in direct admin check:", error);
      }
    };
    
    verifyAccess();
  }, [isLoading, user, profile, isAdmin, requireAdmin, location.pathname, 
      refreshProfile, adminVerificationState, isAdminVerified]);
  
  // Show loading state during verification
  if (isLoading || (requireAdmin && adminVerificationState === 'pending' && !localVerified && !isAdminVerified)) {
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
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // For admin routes, check both context verification and local verification
  if (requireAdmin && !isAdmin && !isAdminVerified && !localVerified) {
    console.log("[ProtectedRoute] User not admin, access denied");
    toast.error("You don't have permission to access this area");
    return <Navigate to="/" replace />;
  }

  // Allow access if:
  // 1. Not an admin route, OR
  // 2. Admin route AND (isAdmin OR isAdminVerified OR localVerified)
  console.log("[ProtectedRoute] Access granted to path:", location.pathname);
  return <Outlet />;
};

export default ProtectedRoute;
