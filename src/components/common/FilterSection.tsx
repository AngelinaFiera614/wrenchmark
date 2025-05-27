
import React, { ReactNode } from 'react';

/**
 * A reusable section component for filter UI elements
 * Provides consistent styling and layout for filter sections with optional actions
 * 
 * @param title - The heading text for the filter section
 * @param children - The filter controls or content to display
 * @param action - Optional action element (usually a reset button)
 * @param className - Additional CSS classes to apply
 */
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
