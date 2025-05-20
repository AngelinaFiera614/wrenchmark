
import React from "react";
import { Link } from "react-router-dom";
import { User, LogOut, ShieldCheck, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth";

const UserMenu = () => {
  const { user, profile, isAdmin, signOut } = useAuth();

  if (!user) {
    return (
      <Link to="/auth" className="hidden md:block">
        <Button variant="teal" size="sm" className="font-medium">
          Sign In / Sign Up
        </Button>
      </Link>
    );
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
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
  );
};

export default UserMenu;
