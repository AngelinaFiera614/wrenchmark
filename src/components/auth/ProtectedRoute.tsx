
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
  
  // Add logging to help diagnose issues
  useEffect(() => {
    console.log("ProtectedRoute - Auth state:", { 
      isLoading, 
      user: user ? "exists" : "null",
      profile: profile ? "exists" : "null",
      isAdmin,
      requireAdmin,
      path: location.pathname 
    });
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
            // The auth context will update the profile state via onAuthStateChange
            // so we don't need to do anything else here
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

  if (!user) {
    console.log("ProtectedRoute: User not authenticated, redirecting to auth page");
    // Save the location they tried to access for redirecting after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Try to proceed even if profile doesn't exist yet, as we're attempting to create it
  if (requireAdmin && !isAdmin) {
    // If admin access is required but user is not an admin
    console.log("ProtectedRoute: User not admin, access denied");
    toast.error("You don't have permission to access this area");
    return <Navigate to="/" replace />;
  }

  // If user is authenticated (and is admin if required), render the protected content
  console.log("ProtectedRoute: Access granted");
  return <Outlet />;
};

export default ProtectedRoute;
