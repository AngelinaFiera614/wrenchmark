
import { createContext, useContext } from "react";
import type { MotorcycleCategory, MotorcycleFilters as FiltersType } from "@/types";

interface FiltersContextType {
  filters: FiltersType;
  onFilterChange: (filters: FiltersType) => void;
  categories: MotorcycleCategory[];
  commonMakes: string[];
}

export const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function useFiltersContext() {
  const context = useContext(FiltersContext);
  
  if (context === undefined) {
    throw new Error("useFiltersContext must be used within a FiltersProvider");
  }
  
  return context;
}
