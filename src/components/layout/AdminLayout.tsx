
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { ErrorBoundary } from "@/components/admin/shared/ErrorBoundary";
import LoadingSpinner from "@/components/admin/shared/LoadingSpinner";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

const AdminLayout = () => {
  const { user, isAdmin, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-explorer-dark flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  // Redirect to admin auth if not authenticated or not admin
  if (!user || !isAdmin) {
    return <Navigate to="/admin/auth" replace />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-explorer-dark flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdminLayout;
