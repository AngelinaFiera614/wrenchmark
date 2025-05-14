
import { useState, useCallback } from "react";

export interface WeightFilterState {
  weightRange: [number, number];
}

export function useWeightFilter(initialRange: [number, number] = [100, 400]) {
  const [weightRange, setWeightRange] = useState<[number, number]>(initialRange);

  const handleWeightRangeChange = useCallback((values: number[]) => {
    setWeightRange([values[0], values[1]] as [number, number]);
  }, []);

  return {
    weightRange,
    handleWeightRangeChange
  };
}
