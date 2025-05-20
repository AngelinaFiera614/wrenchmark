
// Same file but add the State Rules link
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  LayoutDashboard, Motorcycle, Book, Truck, BookOpen, 
  Activity, FileText, Bookmark, Map, Menu
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  icon,
  label,
  to,
  active,
  onClick
}) => (
  <Button
    variant={active ? 'secondary' : 'ghost'}
    className={cn(
      'w-full justify-start',
      active ? 'bg-accent-teal/10 text-accent-teal hover:bg-accent-teal/20' : ''
    )}
    asChild
    onClick={onClick}
  >
    <Link to={to}>
      {icon}
      <span className="ml-2">{label}</span>
    </Link>
  </Button>
);

interface AdminSidebarProps {
  className?: string;
  // Adding onClose for mobile sidebar
  onMobileClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ className, onMobileClose }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', to: '/admin' },
    { icon: <Motorcycle size={20} />, label: 'Motorcycles', to: '/admin/motorcycles' },
    { icon: <Truck size={20} />, label: 'Brands', to: '/admin/brands' },
    { icon: <Activity size={20} />, label: 'Riding Skills', to: '/admin/riding-skills' },
    { icon: <Book size={20} />, label: 'Courses', to: '/admin/courses' },
    { icon: <BookOpen size={20} />, label: 'Lessons', to: '/admin/lessons' },
    { icon: <FileText size={20} />, label: 'Manuals', to: '/admin/manuals' },
    { icon: <Bookmark size={20} />, label: 'Glossary', to: '/admin/glossary' },
    { icon: <Map size={20} />, label: 'State Rules', to: '/admin/state-rules' },
  ];

  const renderSidebarLinks = () => (
    <div className="flex flex-col space-y-1 pt-4">
      {sidebarItems.map((item) => (
        <SidebarLink
          key={item.to}
          icon={item.icon}
          label={item.label}
          to={item.to}
          active={isActive(item.to)}
          onClick={onMobileClose}
        />
      ))}
    </div>
  );

  // Desktop sidebar
  const DesktopSidebar = (
    <aside className={cn('hidden md:flex md:flex-col md:w-64 p-4 border-r', className)}>
      <div className="text-2xl font-bold mb-6 flex items-center">
        <span className="text-accent-teal">WRENCH</span>MARK 
      </div>
      {renderSidebarLinks()}
    </aside>
  );

  // Mobile sidebar (using Sheet component)
  const MobileSidebar = (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <div className="p-4">
            <div className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-accent-teal">WRENCH</span>MARK
            </div>
            {renderSidebarLinks()}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <>
      {MobileSidebar}
      {DesktopSidebar}
    </>
  );
};

export default AdminSidebar;
