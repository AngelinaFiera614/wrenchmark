
import { useState, useCallback } from "react";

export interface StyleTagFilterState {
  styleTags: string[];
}

export function useStyleTagFilter(initialTags: string[] = []) {
  const [styleTags, setStyleTags] = useState<string[]>(initialTags);

  const handleStyleTagChange = useCallback((tag: string, checked: boolean) => {
    setStyleTags(prevTags => {
      if (checked) {
        return [...prevTags, tag];
      } else {
        return prevTags.filter(t => t !== tag);
      }
    });
  }, []);

  const handleStyleTagsChange = useCallback((tags: string[]) => {
    setStyleTags(tags);
  }, []);

  return {
    styleTags,
    handleStyleTagChange,
    handleStyleTagsChange
  };
}
