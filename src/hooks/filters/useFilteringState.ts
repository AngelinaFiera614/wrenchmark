
import { useState, useMemo } from "react";
import { MotorcycleFilters } from "@/types";
import { countActiveFilters } from "@/lib/filter-utils";

export function useFilteringState(filters: MotorcycleFilters) {
  const [isFiltering, setIsFiltering] = useState(countActiveFilters(filters) > 0);

  useMemo(() => {
    setIsFiltering(countActiveFilters(filters) > 0);
  }, [filters]);

  return { isFiltering };
}
