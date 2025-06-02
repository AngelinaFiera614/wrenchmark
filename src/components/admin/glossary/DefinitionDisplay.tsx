
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DefinitionDisplayProps {
  definition: string;
  maxLength?: number;
  className?: string;
}

export function DefinitionDisplay({
  definition,
  maxLength = 100,
  className = ""
}: DefinitionDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = definition.length > maxLength;
  const displayText = shouldTruncate && !isExpanded 
    ? definition.substring(0, maxLength) + '...'
    : definition;

  if (!shouldTruncate) {
    return <div className={className}>{definition}</div>;
  }

  return (
    <div className={className}>
      <div>{displayText}</div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-auto p-0 mt-1 text-xs text-muted-foreground hover:text-foreground"
      >
        {isExpanded ? (
          <>
            Show less <ChevronUp className="h-3 w-3 ml-1" />
          </>
        ) : (
          <>
            Show more <ChevronDown className="h-3 w-3 ml-1" />
          </>
        )}
      </Button>
    </div>
  );
}
