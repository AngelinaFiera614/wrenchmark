
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
          href: "/admin/testing-suite",
          isActive: location.pathname.startsWith('/admin/testing-suite')
        }
      ]
    },
    {
      title: "Content Management",
      items: [
        {
          icon: Bike,
          label: "Motorcycle Management",
          href: "/admin/motorcycle-management",
          isActive: location.pathname.startsWith('/admin/motorcycle-management')
        },
        {
          icon: FileText,
          label: "Models",
          href: "/admin/models",
          isActive: location.pathname.startsWith('/admin/models')
        }
      ]
    },
    {
      title: "Components & Parts",
      items: [
        {
          icon: Component,
          label: "Components Library",
          href: "/admin/components",
          isActive: location.pathname.startsWith('/admin/components')
        },
        {
          icon: GitBranch,
          label: "Component Assignments",
          href: "/admin/assignments",
          isActive: location.pathname === '/admin/assignments'
        },
        {
          icon: Wrench,
          label: "Configurations",
          href: "/admin/configurations",
          isActive: location.pathname === '/admin/configurations'
        }
      ]
    },
    {
      title: "System Management",
      items: [
        {
          icon: Database,
          label: "Bulk Operations",
          href: "/admin/bulk-operations",
          isActive: location.pathname === '/admin/bulk-operations'
        },
        {
          icon: Settings,
          label: "Categories",
          href: "/admin/categories",
          isActive: location.pathname === '/admin/categories'
        },
        {
          icon: Tag,
          label: "Tags",
          href: "/admin/tags",
          isActive: location.pathname === '/admin/tags'
        },
        {
          icon: ListChecks,
          label: "Audit Log",
          href: "/admin/audit-log",
          isActive: location.pathname === '/admin/audit-log'
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
