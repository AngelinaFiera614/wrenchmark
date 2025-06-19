
import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Wrench,
  Tag,
  Component,
  ListChecks,
  Database,
  GitBranch,
  Bike,
  TestTube,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Users,
  Palette,
} from "lucide-react";

const AdminSidebarComponent = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: "Overview",
      items: [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          href: "/admin",
          isActive: location.pathname === '/admin'
        },
        {
          icon: TestTube,
          label: "Testing Suite",
          href: "/admin/testing",
          isActive: location.pathname.startsWith('/admin/testing')
        }
      ]
    },
    {
      title: "Motorcycle Data",
      items: [
        {
          icon: Bike,
          label: "Motorcycle Management",
          href: "/admin/motorcycle-management",
          isActive: location.pathname.startsWith('/admin/motorcycle-management')
        },
        {
          icon: Tag,
          label: "Brands",
          href: "/admin/brands",
          isActive: location.pathname.startsWith('/admin/brands')
        },
        {
          icon: Palette,
          label: "Colors",
          href: "/admin/colors",
          isActive: location.pathname.startsWith('/admin/colors')
        }
      ]
    },
    {
      title: "Components & Parts",
      items: [
        {
          icon: Component,
          label: "Parts Hub",
          href: "/admin/parts",
          isActive: location.pathname.startsWith('/admin/parts')
        }
      ]
    },
    {
      title: "Learning Content",
      items: [
        {
          icon: GraduationCap,
          label: "Courses",
          href: "/admin/courses",
          isActive: location.pathname.startsWith('/admin/courses')
        },
        {
          icon: BookOpen,
          label: "Lessons",
          href: "/admin/lessons",
          isActive: location.pathname.startsWith('/admin/lessons')
        },
        {
          icon: Bike,
          label: "Riding Skills",
          href: "/admin/riding-skills",
          isActive: location.pathname.startsWith('/admin/riding-skills')
        },
        {
          icon: Wrench,
          label: "Repair Skills",
          href: "/admin/repair-skills",
          isActive: location.pathname.startsWith('/admin/repair-skills')
        },
        {
          icon: FileText,
          label: "Manuals",
          href: "/admin/manuals",
          isActive: location.pathname.startsWith('/admin/manuals')
        },
        {
          icon: BookOpen,
          label: "Glossary",
          href: "/admin/glossary",
          isActive: location.pathname.startsWith('/admin/glossary')
        }
      ]
    },
    {
      title: "System",
      items: [
        {
          icon: Users,
          label: "Users",
          href: "/admin/users",
          isActive: location.pathname.startsWith('/admin/users')
        },
        {
          icon: Settings,
          label: "System Settings",
          href: "/admin/system",
          isActive: location.pathname.startsWith('/admin/system')
        }
      ]
    }
  ];

  return (
    <Sidebar className="bg-explorer-card border-r border-explorer-chrome/30">
      <SidebarHeader className="p-4 border-b border-explorer-chrome/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-teal rounded-md flex items-center justify-center">
            <span className="text-black font-bold text-sm">W</span>
          </div>
          <span className="font-semibold text-explorer-text">WRENCHMARK</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {menuItems.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex}>
            <SidebarGroupLabel className="text-explorer-text-muted">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item, itemIndex) => (
                  <SidebarMenuItem key={itemIndex}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={item.isActive}
                      className={item.isActive ? "bg-accent-teal/20 text-accent-teal" : "text-explorer-text hover:bg-explorer-chrome/20"}
                    >
                      <Link to={item.href} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                        {item.isActive && <ChevronRight className="h-3 w-3 ml-auto" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export { AdminSidebarComponent };
