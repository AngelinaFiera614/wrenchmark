
import { Outlet, Navigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { useAuth } from "@/context/auth";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { createProfileIfNotExists } from "@/services/profileService";

const AdminLayout = () => {
  const { isLoading, user, profile, isAdmin } = useAuth();
  
  // Try to create profile if user exists but profile doesn't
  useEffect(() => {
    const ensureProfile = async () => {
      if (user && !profile && !isLoading) {
        console.log("AdminLayout: User exists but profile doesn't, attempting to create profile");
        try {
          const createdProfile = await createProfileIfNotExists(user.id);
          if (!createdProfile) {
            console.error("AdminLayout: Failed to create profile");
            toast.error("Failed to create user profile. Please try refreshing the page.");
          }
        } catch (error) {
          console.error("AdminLayout: Error creating profile:", error);
        }
      }
    };

    ensureProfile();
  }, [user, profile, isLoading]);
  
  // Only show loading state if auth is still loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-10 w-10 animate-spin text-accent-teal" />
          <p className="text-muted-foreground">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  // Double-check admin status even though ProtectedRoute should have handled this
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
