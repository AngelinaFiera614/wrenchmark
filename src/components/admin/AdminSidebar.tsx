
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink as RouterNavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Bike,
  BadgeCheck,
  Settings2,
  FileText,
  BookOpen,
  GraduationCap,
  Notebook,
  Users,
  ArrowLeft,
  Route,
  Hammer,
  Wrench,
} from "lucide-react";

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="w-64 min-h-screen border-r border-border/40 bg-background">
      <div className="p-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-accent-teal/20 rounded">
            <span className="text-accent-teal font-bold text-lg">WM</span>
          </div>
          <h1 className="text-xl font-bold">Admin</h1>
        </div>
      </div>
      
      <div className="p-2">
        <nav className="space-y-1">
          <NavLink to="/admin" end>
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </NavLink>
          
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Content
            </p>
          </div>
          
          <NavLink to="/admin/motorcycles">
            <Bike className="h-4 w-4 mr-2" />
            Motorcycles
          </NavLink>
          
          <NavLink to="/admin/brands">
            <BadgeCheck className="h-4 w-4 mr-2" />
            Brands
          </NavLink>
          
          <NavLink to="/admin/components">
            <Settings2 className="h-4 w-4 mr-2" />
            Components
          </NavLink>
          
          <NavLink to="/admin/accessories">
            <Wrench className="h-4 w-4 mr-2" />
            Accessories
          </NavLink>
          
          <NavLink to="/admin/manuals">
            <FileText className="h-4 w-4 mr-2" />
            Manuals
          </NavLink>
          
          <NavLink to="/admin/glossary">
            <BookOpen className="h-4 w-4 mr-2" />
            Glossary
          </NavLink>
          
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Learning
            </p>
          </div>
          
          <NavLink to="/admin/courses">
            <GraduationCap className="h-4 w-4 mr-2" />
            Courses
          </NavLink>
          
          <NavLink to="/admin/lessons">
            <Notebook className="h-4 w-4 mr-2" />
            Lessons
          </NavLink>
          
          <NavLink to="/admin/riding-skills">
            <Route className="h-4 w-4 mr-2" />
            Riding Skills
          </NavLink>
          
          <NavLink to="/admin/repair-skills">
            <Hammer className="h-4 w-4 mr-2" />
            Repair Skills
          </NavLink>
          
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              System
            </p>
          </div>
          
          <NavLink to="/admin/users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </NavLink>
        </nav>
      </div>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-border/40">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Site
        </Button>
      </div>
    </div>
  );
}

function NavLink({
  to,
  children,
  end = false,
}: {
  to: string;
  children: React.ReactNode;
  end?: boolean;
}) {
  const location = useLocation();
  const active = end ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <Button variant="ghost" asChild className="w-full justify-start" data-active={active}>
      <RouterNavLink to={to} end={end}>
        {children}
      </RouterNavLink>
    </Button>
  );
}
