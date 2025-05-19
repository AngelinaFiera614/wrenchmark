
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
  const { isLoading, user, profile, isAdmin, refreshProfile } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [directAdminCheck, setDirectAdminCheck] = useState<boolean | null>(null);
  const navigate = useNavigate();
  
  // Enhanced verification for admin access
  useEffect(() => {
    if (!isLoading && verificationAttempts > 2) {
      // We've already tried multiple times, stop trying
      setIsVerifying(false);
      return;
    }

    const verifyAdminAccess = async () => {
      console.log("[AdminLayout] Verifying admin access", {
        isLoading,
        user: user ? "exists" : "null",
        profile: profile ? "exists" : "null",
        isAdmin,
        verificationAttempts,
        directAdminCheck
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

      // For direct admin verification check
      if (directAdminCheck === null) {
        try {
          // Do a direct check against the database for admin status
          console.log("[AdminLayout] Performing direct admin status check");
          const adminStatus = await verifyAdminStatus(user.id);
          setDirectAdminCheck(adminStatus);
          
          if (adminStatus) {
            console.log("[AdminLayout] Direct admin check confirmed admin status");
            setIsVerifying(false);
            return;
          } else if (verificationAttempts > 0) {
            console.log("[AdminLayout] Direct admin check denied admin status");
            setIsVerifying(false);
            return;
          }
          // If this is our first attempt and direct check failed, continue with normal verification
        } catch (error) {
          console.error("[AdminLayout] Error in direct admin check:", error);
        }
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
      if (verificationAttempts >= 2) {
        console.log("[AdminLayout] Verification complete after multiple attempts");
        setIsVerifying(false);
      } else {
        // Increment attempts counter for next round
        setVerificationAttempts(prev => prev + 1);
      }
    };
    
    verifyAdminAccess();
  }, [isLoading, user, profile, isAdmin, refreshProfile, verificationAttempts, directAdminCheck]);
  
  // Show loading while either auth is loading or we're verifying admin
  if (isLoading || (isVerifying && verificationAttempts < 3)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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
    toast.error("Failed to verify admin permissions. Please try signing out and back in.");
    return <Navigate to="/auth" replace />;
  }

  // Double-check user
  if (!user) {
    console.log("[AdminLayout] No user found, redirecting");
    toast.error("Authentication required to access admin area");
    return <Navigate to="/auth" replace />;
  }

  // Direct admin check passed or profile indicates admin
  if (directAdminCheck === true || isAdmin) {
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

  // User is not an admin
  console.log("[AdminLayout] User is not an admin, redirecting");
  toast.error("You don't have permission to access the admin area");
  return <Navigate to="/" replace />;
};

export default AdminLayout;
