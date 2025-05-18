
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Home, 
  Bike, 
  Book, 
  Award, 
  Layers, 
  Info, 
  MessageSquareMore, 
  User, 
  LayoutDashboard, 
  LogOut 
} from "lucide-react";

type MobileNavProps = {
  closeMenu: () => void;
  handleSignOut: () => Promise<void>;
};

const MobileNav = ({ closeMenu, handleSignOut }: MobileNavProps) => {
  const { user, isAdmin } = useAuth();

  const navItems = [
    { to: "/", icon: <Home className="w-5 h-5 mr-3" />, label: "Home" },
    { to: "/motorcycles", icon: <Bike className="w-5 h-5 mr-3" />, label: "Motorcycles" },
    { to: "/brands", icon: <Award className="w-5 h-5 mr-3" />, label: "Brands" },
    { to: "/courses", icon: <Book className="w-5 h-5 mr-3" />, label: "Courses" },
    { to: "/riding-skills", icon: <Layers className="w-5 h-5 mr-3" />, label: "Riding Skills" },
    { to: "/glossary", icon: <Layers className="w-5 h-5 mr-3" />, label: "Glossary" },
    { to: "/about", icon: <Info className="w-5 h-5 mr-3" />, label: "About" },
    { to: "/contact", icon: <MessageSquareMore className="w-5 h-5 mr-3" />, label: "Contact" }
  ];

  return (
    <div className="flex flex-col h-full">
      <nav className="flex flex-col p-6 space-y-4 overflow-y-auto flex-1">
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center py-3 px-4 text-lg font-medium text-muted-foreground transition-colors hover:text-accent-teal hover:bg-accent-teal/10 rounded-lg"
              onClick={closeMenu}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="border-t border-border/40 pt-4 mt-4">
          {!user ? (
            <Link
              to="/auth"
              className="flex items-center py-3 px-4 text-lg font-medium text-accent-teal bg-accent-teal/10 rounded-lg"
              onClick={closeMenu}
            >
              <User className="w-5 h-5 mr-3" />
              Sign In / Sign Up
            </Link>
          ) : (
            <div className="space-y-2">
              <Link
                to="/profile"
                className="flex items-center py-3 px-4 text-lg font-medium transition-colors hover:text-accent-teal hover:bg-accent-teal/10 rounded-lg"
                onClick={closeMenu}
              >
                <User className="w-5 h-5 mr-3" />
                My Profile
              </Link>
              
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center py-3 px-4 text-lg font-medium transition-colors hover:text-accent-teal hover:bg-accent-teal/10 rounded-lg"
                  onClick={closeMenu}
                >
                  <LayoutDashboard className="w-5 h-5 mr-3" />
                  Admin Dashboard
                </Link>
              )}
              
              <button
                onClick={handleSignOut}
                className="flex items-center py-3 px-4 text-lg font-medium text-red-500 hover:bg-red-500/10 w-full text-left rounded-lg"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default MobileNav;
