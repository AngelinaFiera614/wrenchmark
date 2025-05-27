
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";
import CompareButton from "./CompareButton";
import { MeasurementToggle } from "@/components/theme/MeasurementToggle";
import { GlassNav, GlassNavContent, GlassNavBrand, GlassNavMenu, GlassNavActions } from "@/components/ui/glass-nav";

const mainNavLinks = [
  { label: "Motorcycles", href: "/motorcycles" },
  { label: "Brands", href: "/brands" },
  { label: "Manuals", href: "/manuals" },
  { label: "Skills", href: "/riding-skills" },
  { label: "Courses", href: "/courses" },
  { label: "Glossary", href: "/glossary" },
];

export function EnhancedDesktopNav() {
  const { user, isLoading } = useAuth();
  
  return (
    <GlassNav variant="floating" className="mx-0 mt-0 rounded-none">
      <GlassNavContent>
        <GlassNavBrand>
          <Link to="/" className="text-2xl font-bold">
            <span className="text-primary">WRENCH</span>
            <span className="text-white">MARK</span>
          </Link>
        </GlassNavBrand>
        
        <GlassNavMenu>
          {mainNavLinks.map((link) => (
            <NavLink
              to={link.href}
              key={link.href}
              className={({ isActive }) =>
                cn(
                  "relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
                  "hover:bg-white/10 hover:text-primary",
                  isActive 
                    ? "text-primary bg-primary/10 shadow-teal-glow/30" 
                    : "text-secondary-muted"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </GlassNavMenu>
        
        <GlassNavActions>
          <MeasurementToggle />
          <ThemeToggle />
          <CompareButton />
          
          {user ? (
            <UserMenu />
          ) : (
            !isLoading && (
              <Button 
                asChild 
                variant="teal" 
                size="sm"
                className="shadow-teal-glow hover:shadow-teal-glow-lg"
              >
                <Link to="/login">Sign In</Link>
              </Button>
            )
          )}
        </GlassNavActions>
      </GlassNavContent>
    </GlassNav>
  );
}
