
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { AuthNav } from "./AuthNav";
import DesktopNav from "./navigation/DesktopNav";
import MobileNav from "./navigation/MobileNav";
import UserMenu from "./navigation/UserMenu";
import CompareButton from "./navigation/CompareButton";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut } = useAuth();

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
    <header className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-2xl text-accent-teal mr-6">
            WRENCHMARK
          </Link>

          <DesktopNav />
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <CompareButton />
          <UserMenu handleSignOut={handleSignOut} />

          <button
            className="md:hidden p-1"
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

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
          <MobileNav closeMenu={closeMenu} handleSignOut={handleSignOut} />
        </div>
      )}

      <div className="md:hidden border-t border-border">
        <AuthNav />
      </div>
    </header>
  );
};

export default Header;
