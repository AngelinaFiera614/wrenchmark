
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useAuth } from "@/context/auth";

const AdminAccessButton = () => {
  const { user, isAdmin, isLoading } = useAuth();

  // Don't show anything while loading
  if (isLoading) {
    return null;
  }

  // Show admin button only if user is authenticated and is admin
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <Link to="/admin">
      <Button variant="outline" size="sm" className="border-accent-teal text-accent-teal hover:bg-accent-teal hover:text-black">
        <Shield className="h-4 w-4 mr-2" />
        Admin
      </Button>
    </Link>
  );
};

export default AdminAccessButton;
