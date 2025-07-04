
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Component, 
  Zap, 
  Image, 
  Palette,
  ChevronRight,
  Info
} from "lucide-react";

const PartsManagementSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Component Library",
      href: "/admin/parts/components",
      icon: Component,
      description: "Create & manage components"
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
      title: "Color Management",
      href: "/admin/parts/colors",
      icon: Palette,
      description: "Manage color variants"
    }
  ];

  return (
    <div className="w-64 bg-explorer-card border-r border-explorer-chrome/30 flex-shrink-0">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-explorer-text mb-4">
          Component Library
        </h2>
        
        {/* Info box about component assignment */}
        <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-400">
              <div className="font-medium mb-1">Component Assignment</div>
              <div>Components are assigned to motorcycles in the Motorcycle Management section.</div>
            </div>
          </div>
        </div>

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
