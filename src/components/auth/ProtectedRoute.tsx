
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ProtectedRouteProps = {
  requireAdmin?: boolean;
};

const ProtectedRoute = ({ requireAdmin = false }: ProtectedRouteProps) => {
  const { 
    user, 
    isAdmin, 
    isAdminVerified, 
    isLoading, 
    adminVerificationState, 
    forceAdminVerification
  } = useAuth();
  
  const location = useLocation();
  const [adminVerified, setAdminVerified] = useState(false);
  
  // Enhanced verification for admin routes
  useEffect(() => {
    // Only perform verification for admin routes
    if (!requireAdmin) return;
    
    // Skip verification if already verified through the auth context
    if (isAdminVerified) {
      console.log("[ProtectedRoute] Admin already verified via context");
      setAdminVerified(true);
      return;
    }
    
    // If user isn't logged in or verification isn't required, skip verification
    if (!user || !requireAdmin || adminVerified) return;
    
    const verifyAdminAccess = async () => {
      try {
        // Use the forceAdminVerification function from auth context
        const isAdminUser = await forceAdminVerification();
        console.log("[ProtectedRoute] Force admin verification result:", isAdminUser);
        setAdminVerified(isAdminUser);
      } catch (error) {
        console.error("[ProtectedRoute] Error in admin verification:", error);
        setAdminVerified(false);
      }
    };
    
    verifyAdminAccess();
  }, [user, isAdminVerified, requireAdmin, adminVerified, forceAdminVerification]);
  
  // Show loading state during auth or admin verification
  if (isLoading || (requireAdmin && !isAdminVerified && !adminVerified && user)) {
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

  // If not logged in, redirect to auth
  if (!user) {
    console.log("[ProtectedRoute] User not authenticated, redirecting to auth page");
    toast.error("Please sign in to continue");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // For admin routes, check if user has admin permissions
  if (requireAdmin && !isAdmin && !isAdminVerified && !adminVerified) {
    console.log("[ProtectedRoute] User not admin, access denied");
    toast.error("You don't have permission to access this area");
    return <Navigate to="/" replace />;
  }

  // Allow access
  return <Outlet />;
};

export default ProtectedRoute;
