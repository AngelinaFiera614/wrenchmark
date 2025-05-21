
import React, { useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GlossaryTerm } from '@/types/glossary';
import { Link } from 'react-router-dom';

export interface GlossaryTermTooltipProps {
  term: GlossaryTerm;
  termSelector: string;
}

const GlossaryTermTooltip: React.FC<GlossaryTermTooltipProps> = ({ term, termSelector }) => {
  useEffect(() => {
    // This effect finds all matching elements and applies tooltip behavior
    const elements = document.querySelectorAll(termSelector);
    
    // No elements found, nothing to do
    if (elements.length === 0) return;
    
    // Add a visual indicator to show this is a glossary term
    elements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.borderBottom = '1px dotted #00D2B4';
        el.style.cursor = 'help';
      }
    });
    
    return () => {
      // Clean up styles when component unmounts
      elements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.borderBottom = '';
          el.style.cursor = '';
        }
      });
    };
  }, [termSelector]);

  return null; // This component doesn't render anything directly, it enhances existing DOM elements
};

export default GlossaryTermTooltip;
