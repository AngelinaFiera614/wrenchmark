
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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

export function MobileNav() {
  const { user, isLoading } = useAuth();
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
        <MeasurementToggle className="pr-2" />
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
          <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-3 mt-4">
              {mobileNavLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      "px-2 py-1 text-lg rounded-md transition-colors",
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
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
