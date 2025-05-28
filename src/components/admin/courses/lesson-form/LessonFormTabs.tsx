
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentBlock } from '@/types/course';
import BasicInfoTab from './BasicInfoTab';
import ContentTab from './ContentTab';
import SettingsTab from './SettingsTab';
import { LessonFormValues } from './useLessonForm';

interface LessonFormTabsProps {
  form: UseFormReturn<LessonFormValues>;
  isEditing: boolean;
  contentBlocks: ContentBlock[];
  setContentBlocks: (blocks: ContentBlock[]) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function LessonFormTabs({ 
  form, 
  isEditing, 
  contentBlocks, 
  setContentBlocks, 
  onTitleChange 
}: LessonFormTabsProps) {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="content">Content Blocks</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic">
        <BasicInfoTab 
          form={form} 
          isEditing={isEditing} 
          onTitleChange={onTitleChange} 
        />
      </TabsContent>

      <TabsContent value="content">
        <ContentTab 
          contentBlocks={contentBlocks}
          onChange={setContentBlocks}
        />
      </TabsContent>

      <TabsContent value="settings">
        <SettingsTab form={form} />
      </TabsContent>
    </Tabs>
  );
}
