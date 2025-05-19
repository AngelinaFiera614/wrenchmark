
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { useAuth } from "@/context/auth";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const AdminLayout = () => {
  const { user, isAdmin, isAdminVerified, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // If user is not admin after loading completes, redirect
  useEffect(() => {
    if (!isLoading && user && !isAdmin && !isAdminVerified) {
      console.log("[AdminLayout] User is not admin, redirecting");
      toast.error("You don't have permission to access the admin area");
      navigate("/", { replace: true });
    }
  }, [isAdmin, isAdminVerified, isLoading, user, navigate]);
  
  // Show loading while auth verification is in progress
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-10 w-10 animate-spin text-accent-teal" />
          <p className="text-muted-foreground">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  // If admin verification is successful, render admin layout
  if (isAdminVerified || isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <AdminHeader />
        
        <div className="flex-1 flex flex-col md:flex-row">
          <div className="hidden md:block">
            <AdminSidebar />
          </div>
          
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  // If no user, redirect to auth
  if (!user) {
    console.log("[AdminLayout] No user found, redirecting");
    toast.error("Authentication required to access admin area");
    return <Navigate to="/auth" replace />;
  }

  // Default fallback - redirect to home
  return <Navigate to="/" replace />;
};

export default AdminLayout;
