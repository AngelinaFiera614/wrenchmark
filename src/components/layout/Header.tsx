
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/auth";
import DesktopNav from "./navigation/DesktopNav";
import MobileNav from "./navigation/MobileNav";
import UserMenu from "./navigation/UserMenu";
import CompareButton from "./navigation/CompareButton";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { signOut, isAdmin } = useAuth();
  const location = useLocation();
  const isMobile = useMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    closeMenu();
  };

  return (
    <header className={`sticky top-0 z-30 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border wrenchmark-header transition-shadow ${isScrolled ? "shadow-md" : ""}`}>
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-2xl text-accent-teal mr-6" onClick={closeMenu}>
            {isMobile ? "WM" : "WRENCHMARK"}
          </Link>

          <DesktopNav />
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <ThemeToggle />
          <CompareButton />
          
          {isAdmin && location.pathname.startsWith("/admin") && (
            <div className="hidden md:flex">
              <span className="bg-accent-teal/20 text-accent-teal text-xs px-2 py-0.5 rounded-full">
                Admin Mode
              </span>
            </div>
          )}
          
          <UserMenu handleSignOut={handleSignOut} />

          <button
            className="md:hidden p-1 bg-background/80 rounded-md"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu - improved with smooth transition */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-20 bg-background/95 backdrop-blur-md animate-fade-in supports-[backdrop-filter]:bg-background/80 md:hidden">
          <MobileNav closeMenu={closeMenu} handleSignOut={handleSignOut} />
        </div>
      )}
    </header>
  );
};

export default Header;
