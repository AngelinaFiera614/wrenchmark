
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";
import CompareButton from "./CompareButton";
import { MeasurementToggle } from "@/components/theme/MeasurementToggle";
import { Settings } from "lucide-react";

const mainNavLinks = [
  { label: "Motorcycles", href: "/motorcycles" },
  { label: "Brands", href: "/brands" },
  { label: "Manuals", href: "/manuals" },
  { label: "Skills", href: "/riding-skills" },
  { label: "Courses", href: "/courses" },
  { label: "Glossary", href: "/glossary" },
];

export function DesktopNav() {
  const { user, isAdmin, isLoading } = useAuth();
  
  return (
    <nav className="hidden lg:flex items-center space-x-4">
      <div className="flex items-center space-x-4">
        {mainNavLinks.map((link) => (
          <NavLink
            to={link.href}
            key={link.href}
            className={({ isActive }) =>
              cn(
                "text-md transition-colors hover:text-accent-teal",
                isActive 
                  ? "text-accent-teal font-medium" 
                  : "text-muted-foreground"
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      
      <div className="flex items-center ml-auto space-x-4">
        <MeasurementToggle />
        <ThemeToggle />
        
        <CompareButton />
        
        {/* Admin Access Button - Show for admin users only */}
        {isAdmin && (
          <Button asChild variant="outline" className="bg-accent-teal/10 border-accent-teal/30 text-accent-teal hover:bg-accent-teal/20">
            <Link to="/admin" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Admin
            </Link>
          </Button>
        )}
        
        {user ? (
          <UserMenu />
        ) : (
          !isLoading && (
            <Button asChild variant="outline" className="bg-accent-teal/10 border-accent-teal/30 text-accent-teal hover:bg-accent-teal/20">
              <Link to="/login">Sign In</Link>
            </Button>
          )
        )}
      </div>
    </nav>
  );
}
