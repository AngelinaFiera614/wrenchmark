
import React from "react";
import { Link } from "react-router-dom";

const DesktopNav = () => {
  return (
    <nav className="hidden md:flex space-x-6">
      <Link
        to="/motorcycles"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent-teal wrenchmark-link"
      >
        Motorcycles
      </Link>
      <Link
        to="/brands"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent-teal wrenchmark-link"
      >
        Brands
      </Link>
      <Link
        to="/about"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent-teal wrenchmark-link"
      >
        About
      </Link>
      <Link
        to="/contact"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent-teal wrenchmark-link"
      >
        Contact
      </Link>
    </nav>
  );
};

export default DesktopNav;
