
import React from 'react';
import { ContentBlock } from '@/types/course';
import BlockRenderer from './BlockRenderer';

interface LessonBlockContentProps {
  contentBlocks: ContentBlock[];
}

export default function LessonBlockContent({ contentBlocks }: LessonBlockContentProps) {
  if (!contentBlocks || contentBlocks.length === 0) {
    return null;
  }

  // Sort blocks by order
  const sortedBlocks = [...contentBlocks].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {sortedBlocks.map((block) => (
        <div key={block.id} className="animate-fade-in">
          <BlockRenderer block={block} />
        </div>
      ))}
    </div>
  );
}
