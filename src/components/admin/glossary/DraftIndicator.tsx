
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Save, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraftIndicatorProps {
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  onSaveDraft: () => void;
  className?: string;
}

export function DraftIndicator({
  lastSaved,
  hasUnsavedChanges,
  onSaveDraft,
  className
}: DraftIndicatorProps) {
  const getStatusText = () => {
    if (hasUnsavedChanges) {
      return 'Unsaved changes';
    }
    if (lastSaved) {
      const now = new Date();
      const diffMs = now.getTime() - lastSaved.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) {
        return 'Saved just now';
      } else if (diffMins < 60) {
        return `Saved ${diffMins}m ago`;
      } else {
        return `Saved ${Math.floor(diffMins / 60)}h ago`;
      }
    }
    return 'No draft saved';
  };

  const getStatusIcon = () => {
    if (hasUnsavedChanges) {
      return <AlertCircle className="h-3 w-3" />;
    }
    if (lastSaved) {
      return <Clock className="h-3 w-3" />;
    }
    return <Save className="h-3 w-3" />;
  };

  const getStatusVariant = () => {
    if (hasUnsavedChanges) {
      return 'destructive' as const;
    }
    if (lastSaved) {
      return 'secondary' as const;
    }
    return 'outline' as const;
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge variant={getStatusVariant()} className="gap-1">
        {getStatusIcon()}
        {getStatusText()}
      </Badge>
      
      {hasUnsavedChanges && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onSaveDraft}
          className="h-7 text-xs"
        >
          <Save className="h-3 w-3 mr-1" />
          Save Draft
        </Button>
      )}
    </div>
  );
}
