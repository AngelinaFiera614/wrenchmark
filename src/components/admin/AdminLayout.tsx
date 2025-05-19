
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { useAuth } from "@/context/auth";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { createProfileIfNotExists } from "@/services/profileService";
import { refreshSession, verifyAdminStatus } from "@/services/authService";

const AdminLayout = () => {
  const { isLoading, user, profile, isAdmin, isAdminVerified, adminVerificationState, refreshProfile } = useAuth();
  const [localVerified, setLocalVerified] = useState(false);
  const navigate = useNavigate();
  
  // Enhanced verification for admin access - within the component only
  useEffect(() => {
    if (isAdminVerified) {
      console.log("[AdminLayout] Admin already verified, allowing access");
      setLocalVerified(true);
      return;
    }
    
    // If we've confirmed user is admin from auth context
    if (isAdmin && adminVerificationState === 'verified') {
      console.log("[AdminLayout] Admin verified via context, allowing access");
      setLocalVerified(true);
      return;
    }

    const verifyAdminAccess = async () => {
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
        return;
      }
      
      // If no user, we'll redirect (handled in render)
      if (!user) {
        console.log("[AdminLayout] No user found, will redirect");
        return;
      }

      try {
        // Do a direct check against the database for admin status as a fallback
        console.log("[AdminLayout] Performing final admin status check");
        const adminStatus = await verifyAdminStatus(user.id);
        
        if (adminStatus) {
          console.log("[AdminLayout] Direct admin check confirmed admin status");
          setLocalVerified(true);
        } else {
          console.log("[AdminLayout] Direct admin check denied admin status");
          setLocalVerified(false);
          
          // Force a profile refresh as a last resort
          if (profile === null) {
            console.log("[AdminLayout] No profile found, attempting to create/refresh");
            try {
              await createProfileIfNotExists(user.id);
              await refreshProfile();
            } catch (error) {
              console.error("[AdminLayout] Error creating/refreshing profile:", error);
            }
          }
        }
      } catch (error) {
        console.error("[AdminLayout] Error in direct admin check:", error);
      }
    };
    
    verifyAdminAccess();
  }, [isLoading, user, profile, isAdmin, adminVerificationState, isAdminVerified, refreshProfile]);
  
  // Show loading while verification is in progress
  if (isLoading || (!localVerified && adminVerificationState === 'pending')) {
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

  // If we've verified admin status locally or through context
  if (localVerified || isAdminVerified || isAdmin) {
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
