
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";

type ProtectedRouteProps = {
  requireAdmin?: boolean;
};

const ProtectedRoute = ({ requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Show loading indicator while auth state is being determined
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-8 w-8 animate-spin text-accent-teal" />
      </div>
    );
  }

  if (!user) {
    // Save the location they tried to access for redirecting after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    // If admin access is required but user is not an admin
    return <Navigate to="/" replace />;
  }

  // If user is authenticated (and is admin if required), render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
