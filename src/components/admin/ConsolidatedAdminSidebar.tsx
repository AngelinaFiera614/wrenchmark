
import React from "react";
import {
  LayoutDashboard,
  Bike,
  Wrench,
  Building2,
  Palette,
  BookOpen,
  GraduationCap,
  Target,
  Hammer,
  FileText,
  Users,
  Settings,
  TestTube,
  Database,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const ConsolidatedAdminSidebar = () => {
  const navigationItems = [
    {
      title: "Overview",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
      ]
    },
    {
      title: "Motorcycle Data",
      items: [
        { icon: Bike, label: "Motorcycle Management", href: "/admin/motorcycle-management" },
        { icon: Wrench, label: "Parts & Components", href: "/admin/parts" },
        { icon: Building2, label: "Brands", href: "/admin/brands" },
        { icon: Palette, label: "Colors", href: "/admin/colors" },
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
      title: "System",
      items: [
        { icon: Users, label: "Users", href: "/admin/users" },
        { icon: TestTube, label: "Testing Suite", href: "/admin/testing" },
        { icon: Settings, label: "System Settings", href: "/admin/system" },
      ]
    }
  ];

  return (
    <Sidebar className="border-r border-explorer-chrome/30 bg-explorer-card">
      <SidebarHeader className="border-b border-explorer-chrome/30 p-4">
        <div className="flex items-center justify-center">
          <span className="text-lg font-bold text-explorer-text">
            WRENCHMARK Admin
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

export default ConsolidatedAdminSidebar;
