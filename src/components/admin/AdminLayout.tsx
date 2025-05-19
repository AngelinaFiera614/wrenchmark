
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { useAuth } from "@/context/auth";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { createProfileIfNotExists } from "@/services/profileService";
import { refreshSession } from "@/services/authService";

const AdminLayout = () => {
  const { isLoading, user, profile, isAdmin, refreshProfile } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const navigate = useNavigate();
  
  // Enhanced verification for admin access
  useEffect(() => {
    const verifyAdminAccess = async () => {
      console.log("[AdminLayout] Verifying admin access", {
        isLoading,
        user: user ? "exists" : "null",
        profile: profile ? "exists" : "null",
        isAdmin,
        verificationAttempts
      });
      
      // If auth is still loading, wait for it
      if (isLoading) {
        console.log("[AdminLayout] Auth still loading, waiting...");
        return;
      }
      
      // If no user, we'll redirect (handled in render)
      if (!user) {
        setIsVerifying(false);
        return;
      }

      // First try refreshing the session if this is our first attempt
      if (verificationAttempts === 0) {
        try {
          console.log("[AdminLayout] First verification attempt, refreshing session");
          await refreshSession();
          // Short delay to let auth state update
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error("[AdminLayout] Error refreshing session:", error);
        }
      }
      
      // If no profile, try to create one or refresh existing
      if (!profile) {
        try {
          console.log("[AdminLayout] Creating or refreshing profile for user");
          
          // First try refreshing profile
          await refreshProfile();
          
          // If still no profile and this is not our last attempt, try creating one
          if (!profile && verificationAttempts < 2) {
            console.log("[AdminLayout] Creating profile for user");
            const createdProfile = await createProfileIfNotExists(user.id);
            
            if (createdProfile) {
              console.log("[AdminLayout] Profile created, refreshing profile data");
              await refreshProfile();
            } else {
              console.error("[AdminLayout] Failed to create profile");
            }
          }
        } catch (error) {
          console.error("[AdminLayout] Error in profile creation:", error);
        }
      }
      
      // Check if we have all the information needed after this attempt
      if (verificationAttempts >= 2 || (user && profile !== null)) {
        console.log("[AdminLayout] Verification complete, admin status:", profile?.is_admin);
        setIsVerifying(false);
      } else {
        // Increment attempts counter for next round
        setVerificationAttempts(prev => prev + 1);
      }
    };
    
    verifyAdminAccess();
  }, [isLoading, user, profile, isAdmin, refreshProfile, verificationAttempts]);
  
  // Show loading while either auth is loading or we're verifying admin
  if (isLoading || (isVerifying && verificationAttempts < 3)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-10 w-10 animate-spin text-accent-teal" />
          <p className="text-muted-foreground">Loading admin portal...</p>
          {verificationAttempts > 0 && (
            <p className="text-xs text-muted-foreground">
              Verifying admin permissions... {verificationAttempts}/3
            </p>
          )}
        </div>
      </div>
    );
  }

  // If we've tried verification multiple times and still don't have what we need
  if (isVerifying && verificationAttempts >= 3) {
    console.error("[AdminLayout] Admin verification failed after multiple attempts");
    
    // Emergency fallback - if we have a user, allow access
    if (user) {
      console.warn("[AdminLayout] Using emergency fallback for admin access");
      return (
        <div className="min-h-screen flex flex-col">
          <AdminHeader />
          <div className="bg-red-500/20 p-4 m-4 rounded border border-red-500">
            <p className="text-center text-red-500">
              Warning: Admin verification failed. Some features may be limited.
            </p>
          </div>
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
    
    // Show error and redirect
    toast.error("Failed to verify admin permissions. Please try signing out and back in.");
    return <Navigate to="/auth" replace />;
  }

  // Double-check user and admin status
  if (!user) {
    console.log("[AdminLayout] No user found, redirecting");
    toast.error("Authentication required to access admin area");
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    console.log("[AdminLayout] User is not an admin, redirecting");
    toast.error("You don't have permission to access the admin area");
    return <Navigate to="/" replace />;
  }
  
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
};

export default AdminLayout;
