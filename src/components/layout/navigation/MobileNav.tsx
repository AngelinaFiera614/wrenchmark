
import React, { useState } from "react";
import { Menu, X, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth";
import CompareButton from "./CompareButton";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { MeasurementToggle } from "@/components/theme/MeasurementToggle";

const mobileNavLinks = [
  { label: "Motorcycles", href: "/motorcycles" },
  { label: "Brands", href: "/brands" },
  { label: "Manuals", href: "/manuals" },
  { label: "Skills", href: "/riding-skills" },
  { label: "Courses", href: "/courses" },
  { label: "Glossary", href: "/glossary" },
];

const adminNavLinks = [
  { label: "Dashboard", href: "/admin", icon: Settings },
  { label: "Motorcycles", href: "/admin/motorcycles" },
  { label: "Parts & Components", href: "/admin/parts" },
  { label: "Brands", href: "/admin/brands" },
  { label: "Users", href: "/admin/users" },
];

export function MobileNav() {
  const { user, isAdmin, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Close menu when route changes
  React.useEffect(() => {
    setIsOpen(false);
  }, [location]);
  
  return (
    <div className="lg:hidden flex items-center">
      <div className="flex-1 flex justify-end items-center space-x-2">
        <ThemeToggle />
        <MeasurementToggle />
        <CompareButton />
        
        {user ? (
          <Link to="/profile" className="mr-2">
            <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border">
              {/* Avatar content */}
            </Button>
          </Link>
        ) : (
          !isLoading && (
            <Button 
              asChild 
              variant="outline" 
              size="sm" 
              className="mr-2 bg-accent-teal/10 border-accent-teal/30 text-accent-teal hover:bg-accent-teal/20"
            >
              <Link to="/login">Sign In</Link>
            </Button>
          )
        )}
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80vw] sm:w-[350px]">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>
            
            <div className="flex flex-col space-y-3 mt-4">
              {/* Main Navigation */}
              <div className="space-y-3">
                {mobileNavLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    className={({ isActive }) =>
                      cn(
                        "px-2 py-1 text-lg rounded-md transition-colors block",
                        isActive 
                          ? "bg-accent-teal/10 text-accent-teal font-medium" 
                          : "text-foreground hover:bg-muted"
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              {/* Admin Section for Admin Users */}
              {isAdmin && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-2 py-1">
                      <Shield className="h-4 w-4 text-accent-teal" />
                      <span className="text-sm font-medium text-accent-teal">Administrator</span>
                    </div>
                    
                    {adminNavLinks.map((link) => (
                      <NavLink
                        key={link.href}
                        to={link.href}
                        className={({ isActive }) =>
                          cn(
                            "px-2 py-1 text-md rounded-md transition-colors block pl-6",
                            isActive 
                              ? "bg-accent-teal/10 text-accent-teal font-medium" 
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )
                        }
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </div>
                </>
              )}
              
              {/* User Account Section */}
              {user && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        cn(
                          "px-2 py-1 text-lg rounded-md transition-colors block",
                          isActive 
                            ? "bg-accent-teal/10 text-accent-teal font-medium" 
                            : "text-foreground hover:bg-muted"
                        )
                      }
                    >
                      Profile
                    </NavLink>
                  </div>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
