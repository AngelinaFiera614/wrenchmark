
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/context/auth";

export function AdminHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, profile } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 border-b border-border">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl text-accent-teal mr-2">
              WRENCHMARK
            </Link>
            <span className="hidden md:inline-block text-xs bg-accent-teal/20 text-accent-teal px-2 py-0.5 rounded-md">
              Admin
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {profile && (
              <div className="text-sm text-right">
                <p className="font-medium">{profile.username || user?.email}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-background border-r border-border">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-accent-teal font-bold">ADMIN PORTAL</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <AdminSidebar />
          </div>
        </div>
      )}
    </>
  );
}
