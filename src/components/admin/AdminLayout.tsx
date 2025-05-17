
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";

const AdminLayout = () => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("AdminLayout - Auth state:", { isAdmin, isLoading });
    
    if (!isLoading && !isAdmin) {
      console.log("AdminLayout: User not admin, redirecting to home");
      navigate("/");
    }
  }, [isAdmin, isLoading, navigate]);
  
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
