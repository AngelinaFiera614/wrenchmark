
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
  Bike
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

  return (
    <Card className="col-span-3 lg:col-span-1 bg-explorer-card border-explorer-chrome/30">
      <CardContent className="flex flex-col gap-4">
        <SidebarItem
          icon={LayoutDashboard}
          label="Dashboard"
          href="/admin"
          isActive={location.pathname === '/admin'}
        />
        <SidebarItem 
          icon={Bike} 
          label="Motorcycle Management" 
          href="/admin/motorcycle-management" 
          isActive={location.pathname.startsWith('/admin/motorcycle-management')}
        />
        <SidebarItem 
          icon={FileText} 
          label="Models" 
          href="/admin/models" 
          isActive={location.pathname.startsWith('/admin/models')}
        />
        <SidebarItem 
          icon={Component} 
          label="Components Library" 
          href="/admin/components" 
          isActive={location.pathname.startsWith('/admin/components')}
        />
        <SidebarItem
          icon={GitBranch}
          label="Component Assignments"
          href="/admin/assignments"
          isActive={location.pathname === '/admin/assignments'}
        />
        <SidebarItem
          icon={Wrench}
          label="Configurations"
          href="/admin/configurations"
          isActive={location.pathname === '/admin/configurations'}
        />
        <SidebarItem
          icon={Database}
          label="Bulk Operations"
          href="/admin/bulk-operations"
          isActive={location.pathname === '/admin/bulk-operations'}
        />
        <SidebarItem 
          icon={Settings} 
          label="Categories" 
          href="/admin/categories" 
          isActive={location.pathname === '/admin/categories'}
        />
        <SidebarItem
          icon={Tag}
          label="Tags"
          href="/admin/tags"
          isActive={location.pathname === '/admin/tags'}
        />
         <SidebarItem
          icon={ListChecks}
          label="Audit Log"
          href="/admin/audit-log"
          isActive={location.pathname === '/admin/audit-log'}
        />
      </CardContent>
    </Card>
  );
};

export default AdminSidebar;
