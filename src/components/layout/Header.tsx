
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useProfile } from '@/context/profile/ProfileProvider';
import { useAdminVerification } from '@/hooks/auth/useAdminVerification';
import { signOut } from '@/services/auth/authenticationService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  LogOut, User, LayoutDashboard
} from 'lucide-react';

const Header: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { isAdmin } = useAdminVerification();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Explicitly navigate to home page after sign out to ensure redirect works
      navigate('/', { replace: true });
      toast.success('Signed out successfully.');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out.');
    }
  };

  const navigationLinks = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/motorcycles',
      label: 'Motorcycles',
    },
    {
      href: '/courses',
      label: 'Courses',
    },
    {
      href: '/manuals',
      label: 'Manuals',
    },
    {
      href: '/glossary',
      label: 'Glossary',
    },
  ];
  
  // Add admin link directly to the navigationLinks array if the user is an admin
  if (isAdmin) {
    navigationLinks.push({
      href: '/admin',
      label: 'Admin',
    });
  }

  return (
    <header className="bg-background border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="text-2xl font-bold">
          <span className="text-accent-teal">WRENCH</span>MARK
        </Link>

        <nav className="flex items-center space-x-4">
          {/* Main navigation links */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `font-bold text-sm px-2 py-1 rounded transition-colors ${
                    isActive ? (link.href === '/admin' ? 'text-accent-teal bg-accent-teal/10' : 'text-accent-teal') : 
                    (link.href === '/admin' ? 'text-muted-foreground hover:text-accent-teal hover:bg-accent-teal/10' : 'text-muted-foreground hover:text-foreground')
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile navigation is hidden here */}
          <div className="md:hidden">
            {/* If needed, implement a mobile menu button here */}
          </div>

          {/* User menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} alt={profile?.full_name || user.email} />
                    <AvatarFallback>{profile?.full_name?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
