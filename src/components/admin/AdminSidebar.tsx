import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Bike,
  BookOpenCheck,
  Building,
  Map,
  Package,
  Settings,
  SlidersHorizontal,
  Users,
  Wrench,
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();
  
  const navigationLinks = [
    {
      name: "Motorcycles",
      href: "/admin/motorcycles",
      icon: <Bike className="h-5 w-5" />,
    },
    {
      name: "Components",
      href: "/admin/components",
      icon: <Wrench className="h-5 w-5" />,
    },
    {
      name: "Brands",
      href: "/admin/brands",
      icon: <Building className="h-5 w-5" />,
    },
    {
      name: "Manuals",
      href: "/admin/manuals",
      icon: <BookOpenCheck className="h-5 w-5" />,
    },
    {
      name: "Parts & Accessories",
      href: "/admin/parts",
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: "Repair Skills",
      href: "/admin/repair-skills",
      icon: <Wrench className="h-5 w-5" />,
    },
    {
      name: "Riding Skills",
      href: "/admin/riding-skills",
      icon: <Map className="h-5 w-5" />,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="w-64 min-w-64 h-screen bg-black border-r border-r-accent-teal/10 flex flex-col">
      <div className="p-6">
        <h2 className="text-lg font-bold text-accent-teal tracking-tight">
          WRENCHMARK
        </h2>
        <p className="text-xs text-muted-foreground">Admin Dashboard</p>
      </div>
      
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navigationLinks.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-teal text-black"
                  : "hover:bg-accent-teal/10 text-gray-300 hover:text-white"
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-accent-teal/10">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-accent-teal/20 flex items-center justify-center text-accent-teal">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-white">Admin Mode</p>
            <p className="text-xs text-gray-400">Database Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
