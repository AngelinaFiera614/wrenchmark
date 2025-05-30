
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Bike,
  Users,
  FileText,
  BookOpen,
  GraduationCap,
  Building2,
  PaintBucket,
  Wrench,
  Camera,
  Settings,
  Database,
} from "lucide-react";

const contentManagementItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Models", href: "/admin/models", icon: Bike },
  { name: "Brands", href: "/admin/brands", icon: Building2 },
];

const mediaItems = [
  { name: "Enhanced Media", href: "/admin/enhanced-media", icon: Camera },
  { name: "Images", href: "/admin/images", icon: Camera },
];

const learningItems = [
  { name: "Manuals", href: "/admin/manuals", icon: FileText },
  { name: "Riding Skills", href: "/admin/riding-skills", icon: GraduationCap },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Glossary", href: "/admin/glossary", icon: BookOpen },
];

const componentsItems = [
  { name: "Components", href: "/admin/components", icon: Wrench },
  { name: "Parts", href: "/admin/parts", icon: Wrench },
  { name: "Accessories", href: "/admin/accessories", icon: PaintBucket },
];

const systemItems = [
  { name: "Users", href: "/admin/users", icon: Users },
];

export default function ModernAdminSidebar() {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  const renderMenuGroup = (items: typeof contentManagementItems, groupLabel: string) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-explorer-text-muted text-xs font-medium uppercase tracking-wider">
        {groupLabel}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton 
                asChild 
                isActive={isActive(item.href)}
                className="data-[active=true]:bg-accent-teal/20 data-[active=true]:text-accent-teal hover:bg-explorer-chrome/10 hover:text-explorer-text transition-colors duration-200"
              >
                <Link to={item.href} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar className="border-r border-explorer-chrome/20 bg-explorer-dark">
      <SidebarHeader className="border-b border-explorer-chrome/20 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-teal/20">
            <Database className="h-4 w-4 text-accent-teal" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-explorer-text">ADMIN PORTAL</h2>
            <p className="text-xs text-explorer-text-muted">Content Management</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-explorer-dark">
        {renderMenuGroup(contentManagementItems, "Overview")}
        <SidebarSeparator className="bg-explorer-chrome/20" />
        {renderMenuGroup(mediaItems, "Media")}
        <SidebarSeparator className="bg-explorer-chrome/20" />
        {renderMenuGroup(learningItems, "Learning")}
        <SidebarSeparator className="bg-explorer-chrome/20" />
        {renderMenuGroup(componentsItems, "Components")}
        <SidebarSeparator className="bg-explorer-chrome/20" />
        {renderMenuGroup(systemItems, "System")}
      </SidebarContent>
      
      <SidebarFooter className="border-t border-explorer-chrome/20 p-4">
        <div className="text-center">
          <p className="text-xs text-explorer-text-muted">Wrenchmark Admin</p>
          <p className="text-xs text-accent-teal font-medium">v2.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
