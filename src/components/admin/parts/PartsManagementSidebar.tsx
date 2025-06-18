
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Component, 
  Settings, 
  Layers, 
  Zap, 
  Image, 
  Palette,
  Wrench,
  ChevronRight
} from "lucide-react";

const PartsManagementSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Component Library",
      href: "/admin/parts/components",
      icon: Component,
      description: "Browse all components"
    },
    {
      title: "Component Management", 
      href: "/admin/parts/component-management",
      icon: Wrench,
      description: "Full CRUD for components"
    },
    {
      title: "Model Assignments",
      href: "/admin/parts/assignments", 
      icon: Settings,
      description: "Assign components to models"
    },
    {
      title: "Configurations",
      href: "/admin/parts/configurations",
      icon: Layers,
      description: "Manage model configurations"
    },
    {
      title: "Bulk Operations",
      href: "/admin/parts/bulk",
      icon: Zap,
      description: "Mass import/export tools"
    },
    {
      title: "Media Library",
      href: "/admin/parts/media",
      icon: Image,
      description: "Manage uploaded content"
    },
    {
      title: "Color Options",
      href: "/admin/parts/colors",
      icon: Palette,
      description: "Manage motorcycle colors"
    }
  ];

  return (
    <div className="w-64 bg-explorer-card border-r border-explorer-chrome/30 flex-shrink-0">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-explorer-text mb-6">
          Parts Management
        </h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                  isActive 
                    ? "bg-accent-teal text-black" 
                    : "text-explorer-text hover:bg-explorer-chrome/20"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.title}</div>
                  <div className={cn(
                    "text-xs truncate",
                    isActive ? "text-black/70" : "text-explorer-text-muted"
                  )}>
                    {item.description}
                  </div>
                </div>
                <ChevronRight className={cn(
                  "h-4 w-4 flex-shrink-0 transition-transform",
                  isActive && "rotate-90"
                )} />
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default PartsManagementSidebar;
