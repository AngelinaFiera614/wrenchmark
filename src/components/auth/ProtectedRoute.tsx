
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

type ProtectedRouteProps = {
  requireAdmin?: boolean;
};

const ProtectedRoute = ({ requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  
  // Add logging to help diagnose issues
  useEffect(() => {
    console.log("ProtectedRoute - Auth state:", { 
      isLoading, 
      user: user ? "exists" : "null", 
      isAdmin,
      requireAdmin,
      path: location.pathname 
    });
  }, [isLoading, user, isAdmin, requireAdmin, location.pathname]);

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
