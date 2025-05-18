
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'react-router-dom';
import { GlossaryTerm } from '@/types/glossary';

interface GlossaryTermTooltipProps {
  term: GlossaryTerm;
  children: React.ReactNode;
}

export default function GlossaryTermTooltip({ term, children }: GlossaryTermTooltipProps) {
  // Truncate the definition if it's too long
  const truncatedDefinition = term.definition.length > 150
    ? `${term.definition.substring(0, 150)}...`
    : term.definition;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span className="cursor-help border-b border-dotted border-accent-teal text-accent-teal">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm bg-background border-border">
          <div className="space-y-2">
            <p className="font-medium">{term.term}</p>
            <p className="text-sm text-muted-foreground">{truncatedDefinition}</p>
            <Link 
              to={`/glossary/${term.slug}`}
              className="text-xs text-accent-teal hover:underline block text-right"
            >
              View full definition
            </Link>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
