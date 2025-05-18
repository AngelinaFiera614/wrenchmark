
import React from 'react';
import { TagPicker } from './TagPicker';
import useTagManagement from '@/hooks/useTagManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const TagPickerDemo = () => {
  const {
    availableTags,
    selectedTags,
    setSelectedTags,
    createTag,
    isLoading
  } = useTagManagement();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tag Picker Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TagPicker
          selectedTags={selectedTags}
          availableTags={availableTags}
          onTagsChange={setSelectedTags}
          onCreateTag={createTag}
          placeholder="Select tags..."
          allowCreation={true}
          disabled={isLoading}
        />
        
        <div className="mt-8">
          <h4 className="text-sm font-medium mb-2">Selected Tags:</h4>
          <pre className="p-4 bg-slate-800 text-slate-100 rounded overflow-auto">
            {JSON.stringify(selectedTags, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default TagPickerDemo;
