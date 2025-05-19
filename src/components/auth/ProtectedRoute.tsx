
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { createProfileIfNotExists } from "@/services/profileService";

type ProtectedRouteProps = {
  requireAdmin?: boolean;
};

const ProtectedRoute = ({ requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isAdmin, profile, isLoading } = useAuth();
  const location = useLocation();
  
  // Enhanced logging to diagnose issues
  useEffect(() => {
    console.log("ProtectedRoute - Auth state:", { 
      isLoading, 
      user: user ? user.id : "null",
      profile: profile ? `exists (admin: ${profile.is_admin})` : "null",
      isAdmin,
      requireAdmin,
      path: location.pathname 
    });
    
    if (requireAdmin && !isAdmin && user) {
      console.warn("User is authenticated but doesn't have admin privileges");
    }
  }, [isLoading, user, profile, isAdmin, requireAdmin, location.pathname]);

  // Try to create profile if user exists but profile doesn't
  useEffect(() => {
    const ensureProfile = async () => {
      if (user && !profile && !isLoading) {
        console.log("ProtectedRoute: User exists but profile doesn't, attempting to create profile");
        try {
          const createdProfile = await createProfileIfNotExists(user.id);
          if (createdProfile) {
            console.log("ProtectedRoute: Successfully created profile");
          } else {
            console.error("ProtectedRoute: Failed to create profile");
            toast.error("Failed to create user profile. Please try refreshing the page.");
          }
        } catch (error) {
          console.error("ProtectedRoute: Error creating profile:", error);
        }
      }
    };

    ensureProfile();
  }, [user, profile, isLoading]);

  // Show loading indicator while auth state is being determined
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-accent-teal" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not logged in at all, redirect to auth
  if (!user) {
    console.log("ProtectedRoute: User not authenticated, redirecting to auth page");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not an admin
  if (requireAdmin && !isAdmin) {
    console.log("ProtectedRoute: User not admin, access denied");
    toast.error("You don't have permission to access this area");
    return <Navigate to="/" replace />;
  }

  // If user is authenticated (and is admin if required), render the protected content
  console.log("ProtectedRoute: Access granted to path:", location.pathname);
  return <Outlet />;
};

export default ProtectedRoute;
