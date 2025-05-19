
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { useAuth } from "@/context/auth";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

const AdminLayout = () => {
  const { isLoading, user, isAdmin, isAdminVerified, adminVerificationState, forceAdminVerification } = useAuth();
  const navigate = useNavigate();
  
  // Verify admin status once when component mounts
  useEffect(() => {
    // Skip if already verified or no user
    if (isAdminVerified || !user) return;
    
    const verifyAdminStatus = async () => {
      try {
        console.log("[AdminLayout] Verifying admin status");
        const isAdminUser = await forceAdminVerification();
        
        if (!isAdminUser) {
          console.log("[AdminLayout] Admin verification failed");
          toast.error("You don't have permission to access the admin area");
          navigate("/", { replace: true });
        } else {
          console.log("[AdminLayout] Admin verification succeeded");
        }
      } catch (error) {
        console.error("[AdminLayout] Error verifying admin status:", error);
        toast.error("Error verifying permissions");
        navigate("/", { replace: true });
      }
    };

    // Add a small delay before verification to let auth initialize
    const timeoutId = setTimeout(verifyAdminStatus, 100);
    return () => clearTimeout(timeoutId);
  }, [user, isAdminVerified, navigate, forceAdminVerification]);
  
  // Show loading while auth or admin verification is in progress
  if (isLoading || (adminVerificationState === 'pending')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-10 w-10 animate-spin text-accent-teal" />
          <p className="text-muted-foreground">Loading admin portal...</p>
          <p className="text-xs text-muted-foreground">
            Verifying admin permissions...
          </p>
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
