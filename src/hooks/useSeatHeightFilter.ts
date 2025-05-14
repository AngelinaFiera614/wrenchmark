
import { useState, useCallback } from "react";

export interface SeatHeightFilterState {
  seatHeightRange: [number, number];
}

export function useSeatHeightFilter(initialRange: [number, number] = [650, 950]) {
  const [seatHeightRange, setSeatHeightRange] = useState<[number, number]>(initialRange);

  const handleSeatHeightRangeChange = useCallback((values: number[]) => {
    setSeatHeightRange([values[0], values[1]] as [number, number]);
  }, []);

  return {
    seatHeightRange,
    handleSeatHeightRangeChange
  };
}
