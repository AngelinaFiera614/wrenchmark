
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="text-center py-8">
      <p className="text-red-500">Error: {error}</p>
      <Button 
        onClick={onRetry}
        variant="outline" 
        className="mt-2"
      >
        Retry
      </Button>
    </div>
  );
};

export default ErrorState;
