
import { useState, useCallback } from "react";

export interface YearFilterState {
  yearRange: [number, number];
}

export function useYearFilter(initialRange: [number, number] = [1980, 2023]) {
  const [yearRange, setYearRange] = useState<[number, number]>(initialRange);

  const handleYearRangeChange = useCallback((values: number[]) => {
    setYearRange([values[0], values[1]] as [number, number]);
  }, []);

  return {
    yearRange,
    handleYearRangeChange
  };
}
