
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Bike, 
  Building2, 
  Wrench, 
  FileText, 
  Component, 
  Users, 
  ChevronRight,
  Compass,
  BookOpen
} from "lucide-react";

interface AdminSidebarItemProps {
  title: string;
  icon: React.ReactNode;
  href: string;
  active: boolean;
}

const AdminSidebarItem = ({ title, icon, href, active }: AdminSidebarItemProps) => (
  <Link
    to={href}
    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
      active 
        ? "bg-accent-teal/20 text-accent-teal"
        : "hover:bg-accent-teal/10 hover:text-accent-teal"
    }`}
  >
    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
      {icon}
    </div>
    <span className="text-sm font-medium">{title}</span>
    {active && <ChevronRight className="ml-auto h-4 w-4" />}
  </Link>
);

export function AdminSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin",
    },
    {
      title: "Motorcycles",
      icon: <Bike className="h-5 w-5" />,
      href: "/admin/motorcycles",
    },
    {
      title: "Brands",
      icon: <Building2 className="h-5 w-5" />,
      href: "/admin/brands",
    },
    {
      title: "Repair Skills",
      icon: <Wrench className="h-5 w-5" />,
      href: "/admin/repair-skills",
    },
    {
      title: "Riding Skills",
      icon: <Compass className="h-5 w-5" />,
      href: "/admin/riding-skills",
    },
    {
      title: "Glossary",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/admin/glossary",
    },
    {
      title: "Manuals",
      icon: <FileText className="h-5 w-5" />,
      href: "/admin/manuals",
    },
    {
      title: "Parts Reference",
      icon: <Component className="h-5 w-5" />,
      href: "/admin/parts",
    },
    {
      title: "Users",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/users",
    }
  ];

  return (
    <div className="w-full lg:w-64 p-4 border-r border-border">
      <div className="mb-6 px-3">
        <h2 className="text-accent-teal text-lg font-bold">ADMIN PORTAL</h2>
        <p className="text-sm text-muted-foreground">Manage Wrenchmark content</p>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <AdminSidebarItem
            key={item.href}
            title={item.title}
            icon={item.icon}
            href={item.href}
            active={currentPath === item.href || currentPath.startsWith(`${item.href}/`)}
          />
        ))}
      </nav>
    </div>
  );
}
