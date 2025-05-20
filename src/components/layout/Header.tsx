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
import { useProfile } from '@/hooks/auth/useProfile';
import { useAdminVerification } from '@/hooks/auth/useAdminVerification';
import { signOut } from '@/services/auth/authenticationService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Home, GraduationCap, BookOpen, Gear, LogOut, User,
  LayoutDashboard, MapPin
} from 'lucide-react';

const Header: React.FC = () => {
  const { user, profile } = useAuth();
  const { isAdmin, isAdminVerified, verifyAdminStatus } = useAdminVerification(user, profile);
  const { refreshProfile } = useProfile(user);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
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
      icon: <Home className="w-4 h-4" />,
    },
    {
      href: '/courses',
      label: 'Courses',
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      href: '/manuals',
      label: 'Manuals',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      href: '/state-laws',
      label: 'State Laws',
      icon: <MapPin className="w-4 h-4" />,
    },
  ];

  return (
    <header className="bg-background border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="text-2xl font-bold">
          <span className="text-accent-teal">WRENCH</span>MARK
        </Link>

        <nav className="flex items-center space-x-4">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-secondary ${
                  isActive ? 'text-accent-teal' : ''
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}

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
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
