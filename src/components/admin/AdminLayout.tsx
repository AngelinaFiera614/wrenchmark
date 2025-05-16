
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

const AdminLayout = () => {
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
