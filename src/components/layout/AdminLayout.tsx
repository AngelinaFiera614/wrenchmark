
import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import ConsolidatedAdminSidebar from "@/components/admin/ConsolidatedAdminSidebar";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-explorer-dark">
        <ConsolidatedAdminSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
