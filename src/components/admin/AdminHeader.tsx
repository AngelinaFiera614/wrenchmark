
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";

export function AdminHeader() {
  const location = useLocation();
  
  // Generate breadcrumb items from current path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
    return { href, label };
  });

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b border-explorer-chrome/30 bg-explorer-card">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.href}>
              <BreadcrumbItem className="hidden md:block">
                {index === breadcrumbItems.length - 1 ? (
                  <BreadcrumbPage className="text-explorer-text">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    href={item.href}
                    className="text-explorer-text-muted hover:text-accent-teal"
                  >
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
