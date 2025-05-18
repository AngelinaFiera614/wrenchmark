
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type MobileNavProps = {
  closeMenu: () => void;
  handleSignOut: () => Promise<void>;
};

const MobileNav = ({ closeMenu, handleSignOut }: MobileNavProps) => {
  const { user, isAdmin } = useAuth();

  return (
    <nav className="flex flex-col p-6 space-y-6">
      <Link
        to="/motorcycles"
        className="text-lg font-medium text-muted-foreground transition-colors hover:text-accent-teal"
        onClick={closeMenu}
      >
        Motorcycles
      </Link>
      <Link
        to="/brands"
        className="text-lg font-medium text-muted-foreground transition-colors hover:text-accent-teal"
        onClick={closeMenu}
      >
        Brands
      </Link>
      <Link
        to="/courses"
        className="text-lg font-medium text-muted-foreground transition-colors hover:text-accent-teal"
        onClick={closeMenu}
      >
        Courses
      </Link>
      <Link
        to="/riding-skills"
        className="text-lg font-medium text-muted-foreground transition-colors hover:text-accent-teal"
        onClick={closeMenu}
      >
        Riding Skills
      </Link>
      <Link
        to="/glossary"
        className="text-lg font-medium text-muted-foreground transition-colors hover:text-accent-teal"
        onClick={closeMenu}
      >
        Glossary
      </Link>
      <Link
        to="/about"
        className="text-lg font-medium text-muted-foreground transition-colors hover:text-accent-teal"
        onClick={closeMenu}
      >
        About
      </Link>
      <Link
        to="/contact"
        className="text-lg font-medium text-muted-foreground transition-colors hover:text-accent-teal"
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
  );
};

export default MobileNav;
