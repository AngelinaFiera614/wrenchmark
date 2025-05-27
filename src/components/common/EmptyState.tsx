
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

/**
 * A reusable empty state component for when no data is available
 * Provides consistent messaging and optional action buttons
 * 
 * @param icon - Optional icon element to display
 * @param title - Main heading text
 * @param description - Descriptive text explaining the empty state
 * @param action - Optional action button configuration
 * @param className - Additional CSS classes
 */
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon && (
        <div className="flex justify-center mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
