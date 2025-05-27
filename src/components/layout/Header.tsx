
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
  Home, GraduationCap, BookOpen, Settings, LogOut, User,
  LayoutDashboard, Bike, BookText, ShieldCheck
} from 'lucide-react';
import { GlassNav, GlassNavContent, GlassNavBrand, GlassNavMenu, GlassNavActions } from "@/components/ui/glass-nav";

const Header: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { isAdmin } = useAdminVerification();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
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
      icon: <Home className="w-4 h-4" />,
    },
    {
      href: '/motorcycles',
      label: 'Motorcycles',
      icon: <Bike className="w-4 h-4" />,
    },
    {
      href: '/courses',
      label: 'Courses',
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      href: '/manuals',
      label: 'Manuals',
      icon: <BookText className="w-4 h-4" />,
    },
    {
      href: '/glossary',
      label: 'Glossary',
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];
  
  if (isAdmin) {
    navigationLinks.push({
      href: '/admin',
      label: 'Admin',
      icon: <ShieldCheck className="w-4 h-4" />,
    });
  }

  return (
    <GlassNav variant="default">
      <GlassNavContent>
        <GlassNavBrand>
          <Link to="/" className="text-2xl font-bold">
            <span className="text-primary">WRENCH</span>
            <span className="text-white">MARK</span>
          </Link>
        </GlassNavBrand>

        <GlassNavMenu>
          <div className="hidden md:flex items-center space-x-1">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white/10 ${
                    isActive ? (link.href === '/admin' ? 'text-primary bg-primary/10 shadow-teal-glow/30' : 'text-primary bg-primary/10') : 
                    (link.href === '/admin' ? 'bg-primary/5 hover:bg-primary/15 text-primary' : 'text-secondary-muted hover:text-white')
                  }`
                }
              >
                {link.icon}
                <span className="text-sm font-medium">{link.label}</span>
              </NavLink>
            ))}
          </div>
        </GlassNavMenu>

        <GlassNavActions>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 p-0 rounded-full border border-white/20 hover:border-primary/40 hover:bg-white/10">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} alt={profile?.full_name || user.email} />
                    <AvatarFallback className="bg-primary/20 text-primary border border-primary/30">
                      {profile?.full_name?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-morphism border-white/20 backdrop-blur-xl">
                <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild className="text-white hover:bg-white/10 hover:text-primary">
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-white hover:bg-white/10 hover:text-primary">
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild className="text-primary hover:bg-primary/20">
                    <Link to="/admin">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={handleSignOut} className="text-white hover:bg-white/10 hover:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 hover:border-primary/40">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild variant="teal" className="shadow-teal-glow hover:shadow-teal-glow-lg">
                <Link to="/auth">Sign Up</Link>
              </Button>
            </div>
          )}
        </GlassNavActions>
      </GlassNavContent>
    </GlassNav>
  );
};

export default Header;
