
import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * A reusable loading spinner component with configurable size and text
 * Provides consistent loading states across the application
 * 
 * @param size - Size variant: 'sm', 'md', or 'lg'
 * @param className - Additional CSS classes
 * @param text - Optional loading text to display below spinner
 */
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  className = '',
  text
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-accent-teal`} />
      {text && (
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
}
