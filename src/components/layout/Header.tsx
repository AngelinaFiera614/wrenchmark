
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthNav } from "./AuthNav";

const NavItem = ({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={cn(
        "text-sm font-medium transition-colors focus:outline-none px-4 py-2 rounded",
        isActive
          ? "bg-white/10 text-white"
          : "text-white/80 hover:text-white hover:bg-white/10",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full backdrop-blur bg-background/80">
      <div className="container flex h-16 items-center justify-between p-4">
        <div className="flex gap-6 md:gap-10 items-center">
          <Link to="/" className="hidden md:block">
            <h1 className="text-xl font-bold tracking-wider text-accent-teal">
              WRENCHMARK
            </h1>
          </Link>
          <Link to="/" className="md:hidden">
            <h1 className="text-xl font-bold tracking-wider text-accent-teal">
              WM
            </h1>
          </Link>
          <nav className="hidden md:flex gap-1 items-center">
            <NavItem href="/motorcycles">Motorcycles</NavItem>
            <NavItem href="/brands">Brands</NavItem>
            <NavItem href="/compare">Compare</NavItem>
            <NavItem href="/about">About</NavItem>
            <NavItem href="/contact">Contact</NavItem>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <AuthNav />
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="h-auto">
              <div className="flex flex-col my-4 space-y-4 items-center">
                <NavItem href="/motorcycles" onClick={() => setIsOpen(false)}>Motorcycles</NavItem>
                <NavItem href="/brands" onClick={() => setIsOpen(false)}>Brands</NavItem>
                <NavItem href="/compare" onClick={() => setIsOpen(false)}>Compare</NavItem>
                <NavItem href="/about" onClick={() => setIsOpen(false)}>About</NavItem>
                <NavItem href="/contact" onClick={() => setIsOpen(false)}>Contact</NavItem>
                <div className="pt-4">
                  <AuthNav />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
