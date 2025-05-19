
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { Loader } from "lucide-react";
import { toast } from "sonner";

type ProtectedRouteProps = {
  requireAdmin?: boolean;
};

const ProtectedRoute = ({ requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isAdmin, isAdminVerified, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading state during auth verification
  if (isLoading) {
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
  if (requireAdmin && !isAdmin && !isAdminVerified) {
    console.log("[ProtectedRoute] User not admin, access denied");
    toast.error("You don't have permission to access this area");
    return <Navigate to="/" replace />;
  }

  // Allow access
  return <Outlet />;
};

export default ProtectedRoute;
