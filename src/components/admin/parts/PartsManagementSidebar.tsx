
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Component,
  Settings,
  Database,
  Wrench,
  LucideIcon
} from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: boolean;
  description: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  href, 
  isActive, 
  description 
}) => {
  return (
    <Link to={href} className="w-full">
      <Card
        className={`group transition-colors hover:bg-accent hover:text-accent-foreground ${
          isActive
            ? "bg-accent-teal/20 border-accent-teal text-accent-teal"
            : "bg-explorer-card border-explorer-chrome/30 text-explorer-text hover:border-accent-teal/50"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-explorer-text-muted mt-1 line-clamp-2">
                {description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const PartsManagementSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      icon: Component,
      label: "Components Library",
      href: "/admin/parts/components",
      description: "Manage engines, brakes, frames, suspension, and wheels",
      isActive: location.pathname === '/admin/parts/components'
    },
    {
      icon: Settings,
      label: "Model Assignments",
      href: "/admin/parts/assignments",
      description: "Set default components for motorcycle models",
      isActive: location.pathname === '/admin/parts/assignments'
    },
    {
      icon: Wrench,
      label: "Configuration Manager",
      href: "/admin/parts/configurations",
      description: "Manage trim configurations and component overrides",
      isActive: location.pathname === '/admin/parts/configurations'
    },
    {
      icon: Database,
      label: "Bulk Operations",
      href: "/admin/parts/bulk",
      description: "Mass assignment and data management tools",
      isActive: location.pathname === '/admin/parts/bulk'
    }
  ];

  return (
    <div className="w-80 bg-explorer-dark p-6 space-y-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-explorer-text mb-2">
          Parts Management
        </h2>
        <p className="text-sm text-explorer-text-muted">
          Manage motorcycle components and configurations
        </p>
      </div>
      
      {menuItems.map((item) => (
        <SidebarItem
          key={item.href}
          icon={item.icon}
          label={item.label}
          href={item.href}
          isActive={item.isActive}
          description={item.description}
        />
      ))}
    </div>
  );
};

export default PartsManagementSidebar;
