
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { useAuth } from "@/context/auth";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { verifyAdminStatus } from "@/services/authService";

const AdminLayout = () => {
  const { isLoading, user, profile, isAdmin, isAdminVerified, adminVerificationState, forceAdminVerification } = useAuth();
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [localVerified, setLocalVerified] = useState(false);
  const navigate = useNavigate();
  
  // Enhanced verification for admin access - within the component only
  useEffect(() => {
    // Skip verification if already verified
    if (isAdminVerified) {
      console.log("[AdminLayout] Admin already verified via context, allowing access");
      setLocalVerified(true);
      return;
    }
    
    // Skip if already locally verified
    if (localVerified) {
      console.log("[AdminLayout] Admin already verified locally, allowing access");
      return;
    }
    
    // Skip if verification is in progress
    if (verificationInProgress) return;
    
    const verifyAdminAccess = async () => {
      setVerificationInProgress(true);
      
      console.log("[AdminLayout] Verifying admin access", {
        isLoading,
        user: user ? "exists" : "null",
        profile: profile ? "exists" : "null",
        isAdmin,
        adminVerificationState
      });
      
      // If auth is still loading, wait for it
      if (isLoading) {
        console.log("[AdminLayout] Auth still loading, waiting...");
        setVerificationInProgress(false);
        return;
      }
      
      // If no user, we'll redirect (handled in render)
      if (!user) {
        console.log("[AdminLayout] No user found, will redirect");
        setVerificationInProgress(false);
        return;
      }

      try {
        // First try the force verification through AuthContext
        console.log("[AdminLayout] Performing force admin verification");
        const isAdminUser = await forceAdminVerification();
        
        if (isAdminUser) {
          console.log("[AdminLayout] Force verification confirmed admin status");
          setLocalVerified(true);
          setVerificationInProgress(false);
          return;
        }
        
        // Try direct database check as backup
        console.log("[AdminLayout] Force verification failed, trying direct check");
        const directCheck = await verifyAdminStatus(user.id);
        
        if (directCheck) {
          console.log("[AdminLayout] Direct admin check confirmed admin status");
          setLocalVerified(true);
        } else {
          console.log("[AdminLayout] Direct admin check denied admin status");
          setLocalVerified(false);
          
          // Force client-side navigation to home
          toast.error("You don't have permission to access the admin area");
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("[AdminLayout] Error in admin verification:", error);
        setLocalVerified(false);
        
        // Force client-side navigation on error
        navigate("/", { replace: true });
      } finally {
        setVerificationInProgress(false);
      }
    };
    
    // Add a small delay before verification to let other processes complete
    const timeoutId = setTimeout(verifyAdminAccess, 100);
    return () => clearTimeout(timeoutId);
  }, [
    isLoading, 
    user, 
    profile, 
    isAdmin, 
    adminVerificationState, 
    isAdminVerified, 
    navigate, 
    localVerified, 
    verificationInProgress,
    forceAdminVerification
  ]);
  
  // Show loading while verification is in progress
  if (isLoading || verificationInProgress) {
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

  // If we've verified admin status
  if (isAdminVerified || localVerified || isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <AdminHeader />
        
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Sidebar - hidden on mobile, shown on larger screens */}
          <div className="hidden md:block">
            <AdminSidebar />
          </div>
          
          {/* Main content area */}
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  // Double-check user
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
