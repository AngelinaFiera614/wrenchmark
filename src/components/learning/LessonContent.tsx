
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import GlossaryTermTooltip from './GlossaryTermTooltip';
import { useGlossaryTerms } from '@/hooks/useGlossaryTerms';
import { Card, CardContent } from '@/components/ui/card';
import { StateRule } from '@/types/state';
import StateRulesSection from './StateRulesSection';
import LessonBlockContent from './LessonBlockContent';
import { ContentBlock } from '@/types/course';

interface LessonContentProps {
  content?: string;
  contentBlocks?: ContentBlock[];
  stateRules?: StateRule[];
}

export const LessonContent = ({ content, contentBlocks = [], stateRules = [] }: LessonContentProps) => {
  const [renderedContent, setRenderedContent] = useState('');
  const { terms, isLoading } = useGlossaryTerms();

  // Determine if we should show legacy content or new content blocks
  const hasContentBlocks = contentBlocks && contentBlocks.length > 0;
  const hasLegacyContent = content && content.trim().length > 0;

  useEffect(() => {
    if (!hasLegacyContent || isLoading || terms.length === 0) return;
    
    const processContent = async () => {
      let processedContent = content;

      // Process glossary term highlights
      if (terms && terms.length > 0) {
        terms.forEach(term => {
          // Skip if term name is empty
          if (!term.term) return;
          
          // Create regex to find the term with word boundaries
          const regex = new RegExp(`\\b${term.term}\\b`, 'gi');
          
          // Replace with tooltip component
          processedContent = processedContent.replace(regex, 
            `<span class="glossary-term" data-term-id="${term.id}">${term.term}</span>`
          );
        });
      }

      // Convert markdown to HTML
      try {
        const htmlContent = await marked(processedContent);
        setRenderedContent(htmlContent);
      } catch (error) {
        console.error('Error parsing markdown:', error);
        setRenderedContent(content); // Fallback to raw content
      }
    };

    processContent();
  }, [content, terms, isLoading, hasLegacyContent]);

  // If we have content blocks, use the new system
  if (hasContentBlocks) {
    return (
      <div className="space-y-6">
        <LessonBlockContent contentBlocks={contentBlocks} />
        
        {/* Display state rules if available */}
        {stateRules && stateRules.length > 0 && (
          <StateRulesSection stateRules={stateRules} />
        )}
      </div>
    );
  }

  // Fallback to legacy content rendering
  if (!hasLegacyContent) {
    return <div className="text-muted-foreground">No content available for this lesson.</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="prose prose-invert max-w-none p-6">
          <div 
            className="lesson-content"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />
        </CardContent>
      </Card>

      {/* Display state rules if available */}
      {stateRules && stateRules.length > 0 && (
        <StateRulesSection stateRules={stateRules} />
      )}
    </div>
  );
};

export default LessonContent;
