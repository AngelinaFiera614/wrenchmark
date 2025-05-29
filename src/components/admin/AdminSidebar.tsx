
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
    <li className="mb-1">
      <Link
        to={to}
        className={cn(
          "group flex items-center space-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 ease-in-out hover:scale-[1.02]",
          isActive 
            ? "bg-gradient-to-r from-accent-teal/20 to-accent-teal/10 text-accent-teal border-l-4 border-accent-teal shadow-lg shadow-accent-teal/20" 
            : "text-gray-300 hover:bg-white/5 hover:text-accent-teal hover:shadow-md backdrop-blur-sm"
        )}
      >
        <div className={cn(
          "flex items-center justify-center w-6 h-6 transition-all duration-200",
          isActive 
            ? "text-accent-teal drop-shadow-lg" 
            : "text-gray-400 group-hover:text-accent-teal group-hover:drop-shadow-sm"
        )}>
          {icon}
        </div>
        <span className={cn(
          "font-medium tracking-wide transition-all duration-200",
          isActive ? "text-accent-teal font-semibold" : "group-hover:text-accent-teal"
        )}>
          {children}
        </span>
        {isActive && (
          <div className="ml-auto w-2 h-2 rounded-full bg-accent-teal shadow-lg shadow-accent-teal/50 animate-pulse" />
        )}
      </Link>
    </li>
  );
};

const AdminSidebar = () => {
  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-gray-900 via-gray-900/95 to-black border-r border-gray-800/50 backdrop-blur-xl">
      {/* Header Section */}
      <div className="flex-shrink-0 p-6 border-b border-gray-800/50">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-teal to-accent-teal/70 flex items-center justify-center shadow-lg">
              <LayoutDashboard className="h-4 w-4 text-black font-bold" />
            </div>
            <h2 className="text-lg font-bold tracking-wider text-white">
              ADMIN
            </h2>
          </div>
          <div className="h-px bg-gradient-to-r from-accent-teal/50 via-accent-teal/30 to-transparent" />
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
            Content Management Portal
          </p>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <nav className="space-y-1">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 px-3">
              Overview
            </h3>
            <ul className="space-y-1">
              <SidebarItem to="/admin" icon={<LayoutDashboard className="h-5 w-5" />}>
                Dashboard
              </SidebarItem>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 px-3">
              Content Management
            </h3>
            <ul className="space-y-1">
              <SidebarItem to="/admin/brands" icon={<Building2 className="h-5 w-5" />}>
                Brands
              </SidebarItem>
              <SidebarItem to="/admin/motorcycles" icon={<Bike className="h-5 w-5" />}>
                Motorcycles
              </SidebarItem>
              <SidebarItem to="/admin/manuals" icon={<FileText className="h-5 w-5" />}>
                Manuals
              </SidebarItem>
              <SidebarItem to="/admin/glossary" icon={<BookOpen className="h-5 w-5" />}>
                Glossary
              </SidebarItem>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 px-3">
              Learning & Skills
            </h3>
            <ul className="space-y-1">
              <SidebarItem to="/admin/riding-skills" icon={<Target className="h-5 w-5" />}>
                Riding Skills
              </SidebarItem>
              <SidebarItem to="/admin/courses" icon={<GraduationCap className="h-5 w-5" />}>
                Courses
              </SidebarItem>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 px-3">
              Media & Assets
            </h3>
            <ul className="space-y-1">
              <SidebarItem to="/admin/images" icon={<ImageIcon className="h-5 w-5" />}>
                Images
              </SidebarItem>
            </ul>
          </div>
        </nav>
      </div>

      {/* Footer Section */}
      <div className="flex-shrink-0 p-4 border-t border-gray-800/50">
        <div className="rounded-lg bg-gradient-to-r from-accent-teal/10 to-transparent p-3 border border-accent-teal/20">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
            <span className="text-xs text-gray-400 font-medium">
              System Active
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            All services operational
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
