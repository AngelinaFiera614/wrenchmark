
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NavLink } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

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
    <aside className="fixed left-0 top-0 z-50 flex flex-col h-full bg-explorer-card border-r border-explorer-chrome/30 transition-transform duration-300 ease-in-out w-64">
      <div className="flex items-center justify-center h-16 border-b border-explorer-chrome/30">
        <span className="text-lg font-bold text-explorer-text">
          Admin Portal
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {navigationItems.map((section, index) => (
          <Accordion type="single" collapsible key={index} className="w-full">
            <AccordionItem value={`section-${index}`}>
              <AccordionTrigger className="font-medium text-explorer-text hover:underline">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="pl-4">
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          `flex items-center space-x-2 py-2 rounded-md transition-colors duration-200
                          ${
                            isActive
                              ? "text-accent-teal bg-accent-teal/10 font-semibold"
                              : "text-explorer-text hover:bg-explorer-chrome/20"
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary">{item.badge}</Badge>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </nav>
    </aside>
  );
};

export default ModernAdminSidebar;
