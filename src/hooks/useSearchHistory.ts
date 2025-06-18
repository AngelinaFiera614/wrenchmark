
import { useState, useEffect } from 'react';

interface SavedSearch {
  name: string;
  query: string;
  filters?: any;
  timestamp: number;
}

export const useSearchHistory = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const recent = localStorage.getItem('wrenchmark_recent_searches');
    const saved = localStorage.getItem('wrenchmark_saved_searches');
    
    if (recent) {
      try {
        setRecentSearches(JSON.parse(recent));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
    
    if (saved) {
      try {
        setSavedSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved searches:', error);
      }
    }
  }, []);

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('wrenchmark_recent_searches', JSON.stringify(updated));
  };

  const saveSearch = (name: string, query: string, filters?: any) => {
    const newSearch: SavedSearch = {
      name,
      query,
      filters,
      timestamp: Date.now()
    };
    
    const updated = [newSearch, ...savedSearches.filter(s => s.name !== name)].slice(0, 20);
    setSavedSearches(updated);
    localStorage.setItem('wrenchmark_saved_searches', JSON.stringify(updated));
  };

  const removeSavedSearch = (name: string) => {
    const updated = savedSearches.filter(s => s.name !== name);
    setSavedSearches(updated);
    localStorage.setItem('wrenchmark_saved_searches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('wrenchmark_recent_searches');
  };

  return {
    recentSearches,
    savedSearches,
    addRecentSearch,
    saveSearch,
    removeSavedSearch,
    clearRecentSearches
  };
};
