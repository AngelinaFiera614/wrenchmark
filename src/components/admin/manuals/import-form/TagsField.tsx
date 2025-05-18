
import React from 'react';
import { TagPicker } from '@/components/common/TagPicker';
import { ManualTag } from '@/services/manuals/tags';
import { Skeleton } from '@/components/ui/skeleton';

interface TagsFieldProps {
  tags: string[];
  availableTags: ManualTag[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onTagsChange?: (tags: string[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
  error?: string;
}

const TagsField: React.FC<TagsFieldProps> = ({
  tags,
  availableTags,
  onAddTag,
  onRemoveTag,
  onTagsChange,
  isLoading = false,
  disabled = false,
  error
}) => {
  // Handle tag selection changes
  const handleTagsChange = (selectedTags: string[]) => {
    // If we have an onTagsChange handler, use that
    if (onTagsChange) {
      onTagsChange(selectedTags);
      return;
    }
    
    // Otherwise use the add/remove handlers
    // First, find tags to add (tags that are in selectedTags but not in tags)
    const tagsToAdd = selectedTags.filter(tag => !tags.includes(tag));
    tagsToAdd.forEach(tag => onAddTag(tag));
    
    // Then, find tags to remove (tags that are in tags but not in selectedTags)
    const tagsToRemove = tags.filter(tag => !selectedTags.includes(tag));
    tagsToRemove.forEach(tag => onRemoveTag(tag));
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium">Tags</div>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Tags</div>
      <TagPicker
        selectedTags={tags}
        availableTags={availableTags}
        onTagsChange={handleTagsChange}
        placeholder="Select or create tags..."
        disabled={disabled || isLoading}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default TagsField;
