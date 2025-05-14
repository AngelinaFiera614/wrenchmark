
import { useState, useCallback } from "react";

export interface SearchFilterState {
  searchTerm: string;
}

export function useSearchFilter(initialTerm: string = "") {
  const [searchTerm, setSearchTerm] = useState<string>(initialTerm);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return {
    searchTerm,
    handleSearchChange
  };
}
