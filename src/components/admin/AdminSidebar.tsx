
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Book,
  BookOpen,
  Car,
  FileText,
  Pen,
  Settings,
  ShieldCheck,
  Users,
  BookText
} from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Settings,
  },
  {
    title: "Courses",
    href: "/admin/courses",
    icon: Book,
  },
  {
    title: "Lessons",
    href: "/admin/lessons",
    icon: BookOpen,
  },
  {
    title: "Motorcycles",
    href: "/admin/motorcycles",
    icon: Car,
  },
  {
    title: "Brands",
    href: "/admin/brands",
    icon: ShieldCheck,
  },
  {
    title: "Riding Skills",
    href: "/admin/riding-skills",
    icon: Pen,
  },
  {
    title: "Manuals",
    href: "/admin/manuals",
    icon: FileText,
  },
  {
    title: "Glossary",
    href: "/admin/glossary",
    icon: BookText,
  },
  {
    title: "State Rules",
    href: "/admin/state-rules",
    icon: FileText,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border h-full">
      <div className="p-4">
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/admin' && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                  isActive 
                    ? "bg-accent-teal/10 text-accent-teal" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className={cn("h-4 w-4 mr-2", isActive ? "text-accent-teal" : "text-muted-foreground")} />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
