
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { useAuth } from "@/context/auth";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

const AdminLayout = () => {
  const { user, isAdmin, isAdminVerified, adminVerificationState, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // If auth state indicates a problem with admin access, redirect to home
  useEffect(() => {
    if (!isLoading && user && adminVerificationState === 'failed') {
      console.log("[AdminLayout] Admin verification failed, redirecting");
      toast.error("You don't have permission to access the admin area");
      navigate("/", { replace: true });
    }
  }, [adminVerificationState, isLoading, user, navigate]);
  
  // Show loading while auth verification is in progress
  if (isLoading || adminVerificationState === 'pending') {
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

  // Admin verification failed
  console.log("[AdminLayout] User is not an admin, redirecting");
  toast.error("You don't have permission to access the admin area");
  return <Navigate to="/" replace />;
};

export default AdminLayout;
