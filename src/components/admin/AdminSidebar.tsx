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
  Image,
  ListChecks,
  Database,
  GitBranch,
  LucideIcon,
  Bike,
  Shield
} from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, isActive }) => {
  return (
    <Link to={href} className="w-full">
      <Card
        className={`group flex items-center space-x-3 rounded-md border-0 p-2 transition-colors hover:bg-accent hover:text-accent-foreground ${
          isActive
            ? "bg-muted text-muted-foreground"
            : "bg-transparent text-secondary-foreground"
        }`}
      >
        <Icon className="h-4 w-4" />
        <p className="text-sm font-medium">{label}</p>
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
      isActive: location.pathname.startsWith('/admin/motorcycle-management')
    },
    {
      title: "Models",
      icon: FileText,
      href: "/admin/models",
      isActive: location.pathname.startsWith('/admin/models')
    },
    {
      title: "Components Library",
      icon: Component,
      href: "/admin/components",
      isActive: location.pathname.startsWith('/admin/components')
    },
    {
      title: "Component Assignments",
      icon: GitBranch,
      href: "/admin/assignments",
      isActive: location.pathname === '/admin/assignments'
    },
    {
      title: "Configurations",
      icon: Wrench,
      href: "/admin/configurations",
      isActive: location.pathname === '/admin/configurations'
    },
    {
      title: "Bulk Operations",
      icon: Database,
      href: "/admin/bulk-operations",
      isActive: location.pathname === '/admin/bulk-operations'
    },
    {
      title: "Categories",
      icon: Settings,
      href: "/admin/categories",
      isActive: location.pathname === '/admin/categories'
    },
    {
      title: "Tags",
      icon: Tag,
      href: "/admin/tags",
      isActive: location.pathname === '/admin/tags'
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
      description: "Audit logs and security monitoring"
    }
  ];

  return (
    <Card className="col-span-3 lg:col-span-1 bg-explorer-card border-explorer-chrome/30">
      <CardContent className="flex flex-col gap-4">
        {menuItems.map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon}
            label={item.title}
            href={item.href}
            isActive={item.isActive}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default AdminSidebar;
