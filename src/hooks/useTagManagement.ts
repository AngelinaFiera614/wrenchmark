
import { useState, useCallback, useEffect } from 'react';
import { ManualTag, createTag, getTags } from '@/services/manuals/tags';

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
      } finally {
        setIsLoading(false);
      }
    };

    loadTags();
  }, []);

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
      
      return newTag;
    } catch (err) {
      console.error("Error creating tag:", err);
      throw err;
    }
  }, []);

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
