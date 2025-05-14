
import { useState, useCallback } from "react";
import { useDebounce } from "./useDebounce";

export interface SearchFilterState {
  searchTerm: string;
  debouncedSearchTerm: string;
  isSearching: boolean;
}

export function useSearchFilter(initialTerm: string = "", debounceMs: number = 300) {
  const [searchTerm, setSearchTerm] = useState<string>(initialTerm);
  const debouncedSearchTerm = useDebounce<string>(searchTerm, debounceMs);
  const isSearching = searchTerm !== debouncedSearchTerm;

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return {
    searchTerm,
    debouncedSearchTerm,
    isSearching,
    handleSearchChange
  };
}
