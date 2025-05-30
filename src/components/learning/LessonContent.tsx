
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StateRule } from '@/types/state';
import StateRulesSection from './StateRulesSection';
import LessonBlockContent from './LessonBlockContent';
import { ContentBlock } from '@/types/course';
import { SecureContentRenderer } from '@/components/security/SecureContentRenderer';

interface LessonContentProps {
  content?: string;
  contentBlocks?: ContentBlock[];
  stateRules?: StateRule[];
}

export const LessonContent = ({ content, contentBlocks = [], stateRules = [] }: LessonContentProps) => {
  // Determine if we should show legacy content or new content blocks
  const hasContentBlocks = contentBlocks && contentBlocks.length > 0;
  const hasLegacyContent = content && content.trim().length > 0;

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

  // Fallback to legacy content rendering with security
  if (!hasLegacyContent) {
    return <div className="text-muted-foreground">No content available for this lesson.</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="prose prose-invert max-w-none p-6">
          <SecureContentRenderer 
            content={content}
            type="markdown"
            className="lesson-content"
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
