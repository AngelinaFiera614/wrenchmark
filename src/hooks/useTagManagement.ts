
import { useState, useCallback, useEffect } from 'react';
import { ManualTag, createTag, getTags } from '@/services/manuals/tags';
import { useToast } from '@/hooks/use-toast';

export interface UseTagManagementProps {
  initialSelectedTags?: string[];
  onTagsChange?: (tags: string[]) => void;
}

export function useTagManagement({
  initialSelectedTags = [],
  onTagsChange
}: UseTagManagementProps = {}) {
  const [availableTags, setAvailableTags] = useState<ManualTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load all available tags
  useEffect(() => {
    const loadTags = async () => {
      try {
        setIsLoading(true);
        const fetchedTags = await getTags();
        setAvailableTags(fetchedTags);
        setError(null);
      } catch (err) {
        console.error("Error loading tags:", err);
        setError("Failed to load tags");
        toast({
          title: 'Error loading tags',
          description: 'There was a problem loading tags. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTags();
  }, [toast]);

  // Update selected tags
  const handleTagsChange = useCallback((tags: string[]) => {
    setSelectedTags(tags);
    if (onTagsChange) {
      onTagsChange(tags);
    }
  }, [onTagsChange]);

  // Create a new tag
  const handleCreateTag = useCallback(async (name: string) => {
    try {
      const newTag = await createTag({
        name,
        color: '#00D2B4', // Use the teal brand color as default
        description: `Tag for ${name}`
      });
      
      // Add new tag to available tags
      setAvailableTags(prev => [...prev, newTag]);
      
      toast({
        title: 'Tag created',
        description: `"${name}" tag has been created successfully`,
      });
      
      return newTag;
    } catch (err) {
      console.error("Error creating tag:", err);
      toast({
        title: 'Error creating tag',
        description: 'Failed to create tag. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  }, [toast]);

  return {
    availableTags,
    selectedTags,
    setSelectedTags: handleTagsChange,
    createTag: handleCreateTag,
    isLoading,
    error
  };
}

export default useTagManagement;
