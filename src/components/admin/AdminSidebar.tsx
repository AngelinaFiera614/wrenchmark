
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Bike,
  FileText,
  BookOpen,
  Target,
  GraduationCap,
  ImageIcon
} from "lucide-react";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SidebarItem = ({ to, icon, children }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        className={cn(
          "flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-secondary hover:text-accent-teal",
          isActive ? "bg-secondary text-accent-teal" : "text-muted-foreground"
        )}
      >
        {icon}
        <span>{children}</span>
      </Link>
    </li>
  );
};

const AdminSidebar = () => {
  return (
    <div className="flex h-full w-64 flex-col border-r border-border/50 bg-secondary">
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex flex-col space-y-1">
          <h2 className="text-sm font-semibold tracking-widest">
            Administration
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage your store settings and content.
          </p>
        </div>
        <nav className="space-y-2">
          <SidebarItem to="/admin" icon={<LayoutDashboard className="h-4 w-4" />}>
            Dashboard
          </SidebarItem>
          <SidebarItem to="/admin/brands" icon={<Building2 className="h-4 w-4" />}>
            Brands
          </SidebarItem>
          <SidebarItem to="/admin/motorcycles" icon={<Bike className="h-4 w-4" />}>
            Motorcycles
          </SidebarItem>
          <SidebarItem to="/admin/manuals" icon={<FileText className="h-4 w-4" />}>
            Manuals
          </SidebarItem>
          <SidebarItem to="/admin/glossary" icon={<BookOpen className="h-4 w-4" />}>
            Glossary
          </SidebarItem>
          <SidebarItem to="/admin/riding-skills" icon={<Target className="h-4 w-4" />}>
            Riding Skills
          </SidebarItem>
          <SidebarItem to="/admin/courses" icon={<GraduationCap className="h-4 w-4" />}>
            Courses
          </SidebarItem>
          <SidebarItem to="/admin/images" icon={<ImageIcon className="h-4 w-4" />}>
            Images
          </SidebarItem>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
