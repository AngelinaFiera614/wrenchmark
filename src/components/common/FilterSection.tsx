
import React, { ReactNode } from 'react';

interface FilterSectionProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function FilterSection({ 
  title, 
  children, 
  action, 
  className = "" 
}: FilterSectionProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
