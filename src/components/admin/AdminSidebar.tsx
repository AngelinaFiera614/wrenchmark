
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Wrench,
  Tag,
  Component,
  ListChecks,
  Database,
  LucideIcon,
  Bike,
  Shield
} from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: boolean;
  description?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, isActive, description }) => {
  return (
    <Link to={href} className="w-full">
      <Card
        className={`group flex items-center space-x-3 rounded-md border-0 p-3 transition-colors hover:bg-accent hover:text-accent-foreground ${
          isActive
            ? "bg-muted text-muted-foreground"
            : "bg-transparent text-secondary-foreground"
        }`}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground truncate">{description}</p>
          )}
        </div>
      </Card>
    </Link>
  );
};

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      isActive: location.pathname === '/admin'
    },
    {
      title: "Motorcycle Management",
      icon: Bike,
      href: "/admin/motorcycle-management",
      isActive: location.pathname.startsWith('/admin/motorcycle-management'),
      description: "Models, years, trims & assignments"
    },
    {
      title: "Component Library",
      icon: Component,
      href: "/admin/components",
      isActive: location.pathname.startsWith('/admin/components'),
      description: "Create & manage component definitions"
    },
    {
      title: "Models Directory",
      icon: FileText,
      href: "/admin/models",
      isActive: location.pathname.startsWith('/admin/models'),
      description: "Browse & edit individual models"
    },
    {
      title: "Bulk Operations",
      icon: Database,
      href: "/admin/bulk-operations",
      isActive: location.pathname === '/admin/bulk-operations'
    },
    {
      title: "Categories & Tags",
      icon: Tag,
      href: "/admin/categories",
      isActive: location.pathname === '/admin/categories'
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings",
      isActive: location.pathname === '/admin/settings'
    },
    {
      title: "Audit Log",
      icon: ListChecks,
      href: "/admin/audit-log",
      isActive: location.pathname === '/admin/audit-log'
    },
    {
      title: "Security",
      icon: Shield,
      href: "/admin/security",
      isActive: location.pathname === '/admin/security'
    }
  ];

  return (
    <Card className="col-span-3 lg:col-span-1 bg-explorer-card border-explorer-chrome/30">
      <CardContent className="flex flex-col gap-2 p-4">
        {menuItems.map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon}
            label={item.title}
            href={item.href}
            isActive={item.isActive}
            description={item.description}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default AdminSidebar;
