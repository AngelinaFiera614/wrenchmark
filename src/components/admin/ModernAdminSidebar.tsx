
import React from "react";
import {
  LayoutDashboard,
  Bike,
  Wrench,
  Building2,
  Calendar,
  Palette,
  Tag,
  BookOpen,
  GraduationCap,
  Target,
  Hammer,
  FileText,
  Database,
  Archive,
  Users,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const ModernAdminSidebar = () => {
  const navigationItems = [
    {
      title: "Overview",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
      ]
    },
    {
      title: "Content Management",
      items: [
        { icon: Bike, label: "Motorcycles", href: "/admin/motorcycles" },
        { icon: Wrench, label: "Parts & Configs", href: "/admin/parts", badge: "Updated" },
        { icon: Building2, label: "Brands", href: "/admin/brands" },
        { icon: Calendar, label: "Models", href: "/admin/models" },
        { icon: Palette, label: "Colors", href: "/admin/colors" },
        { icon: Tag, label: "Tags", href: "/admin/tags" },
      ]
    },
    {
      title: "Learning Content",
      items: [
        { icon: BookOpen, label: "Courses", href: "/admin/courses" },
        { icon: GraduationCap, label: "Lessons", href: "/admin/lessons" },
        { icon: Target, label: "Riding Skills", href: "/admin/riding-skills" },
        { icon: Hammer, label: "Repair Skills", href: "/admin/repair-skills" },
        { icon: FileText, label: "Manuals", href: "/admin/manuals" },
      ]
    },
    {
      title: "Legacy Tools",
      items: [
        { icon: Database, label: "Component Library", href: "/admin/component-library" },
        { icon: Archive, label: "Parts (Legacy)", href: "/admin/parts-legacy" },
        { icon: Archive, label: "Parts (Enhanced)", href: "/admin/parts-enhanced" },
        { icon: Archive, label: "Parts (Phase 3)", href: "/admin/parts-phase3" },
      ]
    },
    {
      title: "System",
      items: [
        { icon: Users, label: "Users", href: "/admin/users" },
        { icon: Settings, label: "System Settings", href: "/admin/system" },
      ]
    }
  ];

  return (
    <Sidebar className="border-r border-explorer-chrome/30 bg-explorer-card">
      <SidebarHeader className="border-b border-explorer-chrome/30 p-4">
        <div className="flex items-center justify-center">
          <span className="text-lg font-bold text-explorer-text">
            Admin Portal
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {navigationItems.map((section, index) => (
          <SidebarGroup key={index}>
            <Collapsible defaultOpen>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="font-medium text-explorer-text hover:text-accent-teal cursor-pointer">
                  {section.title}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={item.href}
                            className={({ isActive }) =>
                              `flex items-center space-x-2 py-2 px-2 rounded-md transition-colors duration-200 w-full
                              ${
                                isActive
                                  ? "text-accent-teal bg-accent-teal/10 font-semibold"
                                  : "text-explorer-text hover:bg-explorer-chrome/20"
                              }`
                            }
                          >
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="ml-auto">
                                {item.badge}
                              </Badge>
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
            {index < navigationItems.length - 1 && <SidebarSeparator />}
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export default ModernAdminSidebar;
