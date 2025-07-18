
import React from 'react';
import { Link } from 'react-router-dom';
import { DesktopNav } from './navigation/DesktopNav';
import { MobileNav } from './navigation/MobileNav';

const Header: React.FC = () => {
  return (
    <header className="bg-background border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center">
          <img 
            src="/wrenchmark-logo-full-dark.png" 
            alt="Wrenchmark logo" 
            className="h-10 md:h-12 w-auto"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = document.createElement('span');
              fallback.textContent = 'WRENCHMARK';
              fallback.className = 'text-xl font-bold text-accent-teal';
              target.parentNode?.appendChild(fallback);
            }}
          />
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
