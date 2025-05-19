import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, LayoutDashboard, Users, Settings, CircleUserRound, Car, FileText } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
}

interface NavSection {
  title: string;
  links: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: "General",
    links: [
      { href: "/admin", label: "Dashboard" },
    ],
  },
  {
    title: "Content",
    links: [
      { href: "/admin/motorcycles", label: "Motorcycles" },
      { href: "/admin/motorcycles/grid", label: "Grid Editor" },
      { href: "/admin/brands", label: "Brands" },
      { href: "/admin/manuals", label: "Manuals" },
    ],
  },
  {
    title: "Users",
    links: [
      { href: "/admin/users", label: "Manage Users" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/admin/settings", label: "Settings" },
    ],
  },
];

export const AdminSidebar: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 border-r flex-shrink-0 h-screen py-8 px-4">
      <nav className="space-y-6">
        {navigation.map((section, index) => (
          <div key={index} className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground px-2">{section.title}</h3>
            <ul className="space-y-1">
              {section.links.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href ? "bg-accent text-accent-foreground" : "text-foreground"
                    )}
                  >
                    {item.href === "/admin" && <LayoutDashboard className="mr-2 h-4 w-4" />}
                    {item.href === "/admin/motorcycles" && <Car className="mr-2 h-4 w-4" />}
                    {item.href === "/admin/motorcycles/grid" && <LayoutDashboard className="mr-2 h-4 w-4" />}
                    {item.href === "/admin/brands" && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>}
                    {item.href === "/admin/users" && <Users className="mr-2 h-4 w-4" />}
                    {item.href === "/admin/settings" && <Settings className="mr-2 h-4 w-4" />}
                    {item.href === "/admin/manuals" && <FileText className="mr-2 h-4 w-4" />}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};
