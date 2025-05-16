import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  Search,
  X,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComparison } from "@/context/ComparisonContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthNav } from "./AuthNav";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { motorcyclesToCompare } = useComparison();
  const compareCount = motorcyclesToCompare.length;
  const location = useLocation();
  const { user, profile, isAdmin, signOut } = useAuth();

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

          <nav className="hidden md:flex space-x-6">
            <Link
              to="/motorcycles"
              className="text-sm font-medium transition-colors hover:text-accent-teal"
            >
              Motorcycles
            </Link>
            <Link
              to="/brands"
              className="text-sm font-medium transition-colors hover:text-accent-teal"
            >
              Brands
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium transition-colors hover:text-accent-teal"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium transition-colors hover:text-accent-teal"
            >
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {compareCount > 0 && !location.pathname.includes('/compare') && (
            <Link to="/compare">
              <Button variant="outline" size="sm">
                Compare ({compareCount})
              </Button>
            </Link>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {profile?.username || user.email?.split('@')[0]}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full flex items-center">
                    <User className="h-4 w-4 mr-2" /> My Profile
                  </Link>
                </DropdownMenuItem>
                
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="w-full flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-2" /> Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth" className="hidden md:block">
              <Button variant="teal" size="sm" className="font-medium">
                Sign In / Sign Up
              </Button>
            </Link>
          )}

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
          <nav className="flex flex-col p-6 space-y-6">
            <Link
              to="/motorcycles"
              className="text-lg font-medium transition-colors hover:text-accent-teal"
              onClick={closeMenu}
            >
              Motorcycles
            </Link>
            <Link
              to="/brands"
              className="text-lg font-medium transition-colors hover:text-accent-teal"
              onClick={closeMenu}
            >
              Brands
            </Link>
            <Link
              to="/about"
              className="text-lg font-medium transition-colors hover:text-accent-teal"
              onClick={closeMenu}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-lg font-medium transition-colors hover:text-accent-teal"
              onClick={closeMenu}
            >
              Contact
            </Link>

            {!user && (
              <Link
                to="/auth"
                className="text-lg font-medium transition-colors text-accent-teal"
                onClick={closeMenu}
              >
                Sign In / Sign Up
              </Link>
            )}

            {user && (
              <>
                <Link
                  to="/profile"
                  className="text-lg font-medium transition-colors hover:text-accent-teal"
                  onClick={closeMenu}
                >
                  My Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-lg font-medium transition-colors hover:text-accent-teal"
                    onClick={closeMenu}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-lg font-medium text-red-500 text-left"
                >
                  Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
      )}

      <div className="md:hidden border-t border-border">
        <AuthNav />
      </div>
    </header>
  );
};

export default Header;
