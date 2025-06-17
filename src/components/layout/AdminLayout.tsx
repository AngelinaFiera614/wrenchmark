
import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import ModernAdminSidebar from "../admin/ModernAdminSidebar";
import { AdminHeader } from "../admin/AdminHeader";

const AdminLayout = () => {
  const { user, isAdmin, isLoading, session } = useAuth();
  const navigate = useNavigate();
  
  // Show loading while auth is still loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-explorer-dark">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-10 w-10 animate-spin text-accent-teal" />
          <p className="text-explorer-text-muted">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  // Check authentication first
  if (!session || !user) {
    console.log("[AdminLayout] No valid session found, redirecting to login");
    toast.error("Authentication required to access admin area");
    return <Navigate to="/login" replace />;
  }

  // Check admin status - simplified logic
  if (!isAdmin) {
    console.log("[AdminLayout] User is not admin, redirecting");
    toast.error("You don't have permission to access the admin area");
    return <Navigate to="/" replace />;
  }

  // Render admin interface
  return (
    <div className="min-h-screen bg-explorer-dark">
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <ModernAdminSidebar />
          <SidebarInset className="flex flex-col flex-1 min-w-0">
            <AdminHeader />
            <main className="flex-1 p-6 overflow-auto bg-explorer-dark">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
