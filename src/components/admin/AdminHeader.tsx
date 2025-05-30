
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth";
import { Badge } from "@/components/ui/badge";

export function AdminHeader() {
  const { user, profile } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center h-16 bg-explorer-dark/95 backdrop-blur supports-[backdrop-filter]:bg-explorer-dark/90 px-4 border-b border-explorer-chrome/20">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-explorer-text hover:text-accent-teal transition-colors" />
        
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/wrenchmark-monogram.png" 
              alt="Wrenchmark logo" 
              className="h-8 w-auto group-hover:opacity-80 transition-opacity"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = document.createElement('span');
                fallback.textContent = 'W';
                fallback.className = 'text-xl font-bold text-accent-teal';
                target.parentNode?.appendChild(fallback);
              }}
            />
            <span className="hidden md:block text-sm text-explorer-text-muted group-hover:text-explorer-text transition-colors">
              Back to App
            </span>
          </Link>
          
          <Badge variant="outline" className="bg-accent-teal/20 text-accent-teal border-accent-teal/30">
            Admin Portal
          </Badge>
        </div>
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        {profile && (
          <div className="text-sm text-right">
            <p className="font-medium text-explorer-text">{profile.username || user?.email}</p>
            <p className="text-xs text-explorer-text-muted">Administrator</p>
          </div>
        )}
      </div>
    </header>
  );
}

export default AdminHeader;
