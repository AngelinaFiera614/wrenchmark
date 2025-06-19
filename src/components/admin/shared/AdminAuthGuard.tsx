
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import LoadingSpinner from "./LoadingSpinner";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const { user, isAdmin, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-explorer-dark flex items-center justify-center">
        <LoadingSpinner size="lg" text="Verifying admin access..." />
      </div>
    );
  }

  // Redirect to admin auth if not authenticated or not admin
  if (!user || !isAdmin) {
    return <Navigate to="/admin/auth" replace />;
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
