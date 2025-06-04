
import React, { useState } from "react";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  LayoutDashboard,
  Bike,
  Users,
  FileText,
  BookOpen,
  GraduationCap,
  Building2,
  PaintBucket,
  Camera,
  Settings,
  Database,
} from "lucide-react";

const navigationGroups = [
  {
    id: "overview",
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Models", href: "/admin/models", icon: Bike },
      { name: "Brands", href: "/admin/brands", icon: Building2 },
      { name: "Configurations", href: "/admin/parts", icon: Settings },
    ]
  },
  {
    id: "media",
    label: "Media",
    items: [
      { name: "Enhanced Media", href: "/admin/enhanced-media", icon: Camera },
      { name: "Images", href: "/admin/images", icon: Camera },
    ]
  },
  {
    id: "learning",
    label: "Learning",
    items: [
      { name: "Manuals", href: "/admin/manuals", icon: FileText },
      { name: "Riding Skills", href: "/admin/riding-skills", icon: GraduationCap },
      { name: "Courses", href: "/admin/courses", icon: BookOpen },
      { name: "Glossary", href: "/admin/glossary", icon: BookOpen },
    ]
  },
  {
    id: "marketplace",
    label: "Marketplace",
    items: [
      { name: "Accessories", href: "/admin/accessories", icon: PaintBucket },
    ]
  },
  {
    id: "system",
    label: "System",
    items: [
      { name: "Users", href: "/admin/users", icon: Users },
    ]
  }
];

export default function ModernAdminSidebar() {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["overview"]);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  // Determine which groups should be expanded based on current route
  const getDefaultExpandedGroups = () => {
    const currentPath = location.pathname;
    const activeGroups = navigationGroups
      .filter(group => 
        group.items.some(item => isActive(item.href))
      )
      .map(group => group.id);
    
    return activeGroups.length > 0 ? activeGroups : ["overview"];
  };

  React.useEffect(() => {
    setExpandedGroups(getDefaultExpandedGroups());
  }, [location.pathname]);

  const handleAccordionChange = (value: string[]) => {
    setExpandedGroups(value);
  };

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
      
      <SidebarContent className="bg-explorer-dark overflow-hidden">
        <div className="p-2">
          <Accordion 
            type="multiple" 
            value={expandedGroups} 
            onValueChange={handleAccordionChange}
            className="space-y-1"
          >
            {navigationGroups.map((group) => (
              <AccordionItem 
                key={group.id} 
                value={group.id}
                className="border-none"
              >
                <AccordionTrigger className="px-3 py-2 text-explorer-text-muted text-xs font-medium uppercase tracking-wider hover:no-underline hover:bg-explorer-chrome/10 rounded-md">
                  {group.label}
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  <SidebarMenu className="space-y-1">
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton 
                          asChild 
                          isActive={isActive(item.href)}
                          className="data-[active=true]:bg-accent-teal/20 data-[active=true]:text-accent-teal hover:bg-explorer-chrome/10 hover:text-explorer-text transition-colors duration-200"
                        >
                          <Link to={item.href} className="flex items-center gap-3 px-3 py-2">
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
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
