
import { Outlet, Navigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { useAuth } from "@/context/auth";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { createProfileIfNotExists } from "@/services/profileService";

const AdminLayout = () => {
  const { isLoading, user, profile, isAdmin, refreshProfile } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  
  // Enhanced verification for admin access
  useEffect(() => {
    const verifyAdminAccess = async () => {
      console.log("AdminLayout: Verifying admin access", {
        isLoading,
        user: user ? "exists" : "null",
        profile: profile ? "exists" : "null",
        isAdmin,
      });
      
      // If auth is still loading, wait for it
      if (isLoading) return;
      
      // If no user, we'll redirect (handled below)
      if (!user) {
        setIsVerifying(false);
        return;
      }
      
      // If no profile, try to create one
      if (!profile) {
        try {
          console.log("AdminLayout: Creating profile for user");
          const createdProfile = await createProfileIfNotExists(user.id);
          if (createdProfile) {
            console.log("AdminLayout: Profile created, refreshing profile data");
            await refreshProfile();
          } else {
            console.error("AdminLayout: Failed to create profile");
          }
        } catch (error) {
          console.error("AdminLayout: Error in profile creation:", error);
        }
      } else {
        // We have a profile, verify it has admin flag
        console.log("AdminLayout: User has profile, admin status:", profile.is_admin);
      }
      
      setIsVerifying(false);
    };
    
    verifyAdminAccess();
  }, [isLoading, user, profile, isAdmin, refreshProfile]);
  
  // Show loading while either auth is loading or we're verifying admin
  if (isLoading || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-10 w-10 animate-spin text-accent-teal" />
          <p className="text-muted-foreground">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  // Double-check user and admin status
  if (!user) {
    console.log("AdminLayout: No user found, redirecting");
    toast.error("Authentication required to access admin area");
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    console.log("AdminLayout: User is not an admin, redirecting");
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
