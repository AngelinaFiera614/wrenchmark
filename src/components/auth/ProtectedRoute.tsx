
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "user" | "admin";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = "user" 
}) => {
  const { user, isAdmin, isLoading } = useAuth();

  // If auth is still loading, show nothing or loading indicator
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If admin role is required but user is not admin
  if (requiredRole === "admin" && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render children
  return <>{children}</>;
};

export default ProtectedRoute;
