
import { useState, useCallback } from "react";

export interface EngineFilterState {
  engineSizeRange: [number, number];
}

export function useEngineFilter(initialRange: [number, number] = [0, 2000]) {
  const [engineSizeRange, setEngineSizeRange] = useState<[number, number]>(initialRange);

  const handleEngineSizeRangeChange = useCallback((values: number[]) => {
    setEngineSizeRange([values[0], values[1]] as [number, number]);
  }, []);

  return {
    engineSizeRange,
    handleEngineSizeRangeChange
  };
}
