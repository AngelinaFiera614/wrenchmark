
import React from 'react';
import { Link } from 'react-router-dom';
import { DesktopNav } from './navigation/DesktopNav';
import { MobileNav } from './navigation/MobileNav';

const Header: React.FC = () => {
  return (
    <header className="bg-background border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="text-2xl font-bold">
          <span className="text-accent-teal">WRENCH</span>MARK
        </Link>

        <div className="flex items-center space-x-4">
          {/* Desktop Navigation */}
          <DesktopNav />
          
          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
