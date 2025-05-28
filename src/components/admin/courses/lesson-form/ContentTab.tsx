
import React from 'react';
import ContentBlockEditor from '../ContentBlockEditor';
import { ContentBlock } from '@/types/course';

interface ContentTabProps {
  contentBlocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export default function ContentTab({ contentBlocks, onChange }: ContentTabProps) {
  return (
    <div className="space-y-4">
      <ContentBlockEditor 
        contentBlocks={contentBlocks}
        onChange={onChange}
      />
    </div>
  );
}
