
import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebarComponent } from "./AdminSidebarComponent";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-explorer-dark">
        <AdminSidebarComponent />
        <main className="flex-1 flex flex-col">
          <div className="flex items-center p-4 border-b border-explorer-chrome/30">
            <SidebarTrigger className="text-explorer-text hover:bg-explorer-chrome/20" />
            <h1 className="ml-4 text-xl font-semibold text-explorer-text">Admin Panel</h1>
          </div>
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
