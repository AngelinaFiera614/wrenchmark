
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bike,
  Users,
  FileText,
  BookOpen,
  GraduationCap,
  Building2,
  PaintBucket,
  Settings,
  Camera,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Models", href: "/admin/models", icon: Bike },
  { name: "Brands", href: "/admin/brands", icon: Building2 },
  { name: "Configurations", href: "/admin/parts", icon: Settings },
  { name: "Enhanced Media", href: "/admin/enhanced-media", icon: Camera },
  { name: "Images", href: "/admin/images", icon: Camera },
  { name: "Manuals", href: "/admin/manuals", icon: FileText },
  { name: "Riding Skills", href: "/admin/riding-skills", icon: GraduationCap },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Glossary", href: "/admin/glossary", icon: BookOpen },
  { name: "Accessories", href: "/admin/accessories", icon: PaintBucket },
  { name: "Users", href: "/admin/users", icon: Users },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
      </div>
      <nav className="mt-5 flex-1 px-2 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
              location.pathname === item.href
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon
              className={cn(
                "mr-3 flex-shrink-0 h-6 w-6",
                location.pathname === item.href
                  ? "text-gray-500"
                  : "text-gray-400 group-hover:text-gray-500"
              )}
            />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
