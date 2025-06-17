
import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import ModernAdminSidebar from "../admin/ModernAdminSidebar";
import { AdminHeader } from "../admin/AdminHeader";

const AdminLayout = () => {
  const { user, isAdmin, isAdminVerified, isLoading, session } = useAuth();
  const navigate = useNavigate();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  
  // Security check: Do we have a valid session?
  const hasValidSession = Boolean(session && user);
  
  // If user is not admin after loading completes, redirect
  useEffect(() => {
    if (!isLoading && hasValidSession && !hasCheckedAuth) {
      setHasCheckedAuth(true);
      
      // Give a small delay to ensure admin verification has completed
      const timer = setTimeout(() => {
        if (!isAdmin && !isAdminVerified) {
          console.log("[AdminLayout] User is not admin, redirecting");
          toast.error("You don't have permission to access the admin area");
          navigate("/", { replace: true });
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isAdmin, isAdminVerified, isLoading, hasValidSession, hasCheckedAuth, navigate]);
  
  // Show loading while auth verification is in progress
  if (isLoading || !hasCheckedAuth) {
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
  if (!hasValidSession) {
    console.log("[AdminLayout] No valid session found, redirecting to login");
    toast.error("Authentication required to access admin area");
    return <Navigate to="/login" replace />;
  }

  // Then check admin status - be more permissive during verification
  if (isAdmin || isAdminVerified) {
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
  }

  // Still loading admin verification - show loading state instead of redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-explorer-dark">
      <div className="flex flex-col items-center space-y-4">
        <Loader className="h-10 w-10 animate-spin text-accent-teal" />
        <p className="text-explorer-text-muted">Verifying admin permissions...</p>
      </div>
    </div>
  );
};

export default AdminLayout;
