
import React from 'react';
import ContentBlockEditor from '../ContentBlockEditor';
import { ContentBlock } from '@/types/course';
import { UseFormReturn } from 'react-hook-form';

interface ContentTabProps {
  contentBlocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  form?: UseFormReturn<any>;
}

export default function ContentTab({ contentBlocks, onChange, form }: ContentTabProps) {
  // Try to determine lesson type from form data or content
  const getLessonType = () => {
    if (!form) return undefined;
    
    const title = form.getValues('title')?.toLowerCase() || '';
    const content = form.getValues('content')?.toLowerCase() || '';
    
    if (title.includes('quiz') || title.includes('test') || title.includes('assessment')) {
      return 'assessment';
    }
    if (title.includes('tutorial') || title.includes('how to') || content.includes('step')) {
      return 'tutorial';
    }
    if (title.includes('introduction') || title.includes('intro') || title.includes('overview')) {
      return 'introduction';
    }
    if (title.includes('practice') || title.includes('exercise') || title.includes('drill')) {
      return 'practice';
    }
    
    return undefined;
  };

  return (
    <div className="space-y-4">
      <ContentBlockEditor 
        contentBlocks={contentBlocks}
        onChange={onChange}
        lessonType={getLessonType()}
      />
    </div>
  );
}
