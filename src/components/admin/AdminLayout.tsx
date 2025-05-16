
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  MotorcycleBike,
  Building,
  Wrench,
  FileText,
  Menu,
  Home,
  LogOut
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    title: "Motorcycles",
    href: "/admin/motorcycles",
    icon: <MotorcycleBike className="h-5 w-5" />,
  },
  {
    title: "Brands",
    href: "/admin/brands",
    icon: <Building className="h-5 w-5" />,
  },
  {
    title: "Repair Skills",
    href: "/admin/repair-skills",
    icon: <Wrench className="h-5 w-5" />,
  },
  {
    title: "Manuals",
    href: "/admin/manuals",
    icon: <FileText className="h-5 w-5" />,
  },
];

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex flex-col w-64 bg-sidebar-background border-r border-sidebar-border">
        <div className="p-6">
          <h1 className="text-xl font-bold text-accent-teal">WRENCHMARK</h1>
          <p className="text-sm text-muted-foreground">Admin Dashboard</p>
        </div>
        <div className="flex flex-col flex-1 py-4">
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm rounded-md",
                  location.pathname.startsWith(item.href)
                    ? "bg-accent-teal text-black font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <Home className="mr-2 h-5 w-5" />
              Back to Site
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              title="Sign Out"
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="md:hidden flex items-center h-16 px-4 border-b border-border">
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <h1 className="text-lg font-bold text-accent-teal">WRENCHMARK ADMIN</h1>
        </div>
        <SheetContent side="left" className="bg-sidebar-background border-sidebar-border p-0">
          <div className="p-6 border-b border-sidebar-border">
            <h2 className="text-xl font-bold text-accent-teal">WRENCHMARK</h2>
            <p className="text-sm text-muted-foreground">Admin Dashboard</p>
          </div>
          <nav className="flex flex-col p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm rounded-md",
                  location.pathname.startsWith(item.href)
                    ? "bg-accent-teal text-black font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.title}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-sidebar-border">
              <Link
                to="/"
                className="flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md"
                onClick={() => setOpen(false)}
              >
                <Home className="mr-3 h-5 w-5" />
                Back to Site
              </Link>
              <Button
                variant="ghost"
                className="flex w-full items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md justify-start"
                onClick={() => {
                  handleSignOut();
                  setOpen(false);
                }}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
