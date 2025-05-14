
import { useState, useCallback } from "react";

export interface MakeFilterState {
  make: string;
}

export function useMakeFilter(initialMake: string = "") {
  const [make, setMake] = useState<string>(initialMake);

  const handleMakeChange = useCallback((makeValue: string) => {
    setMake(makeValue);
  }, []);

  return {
    make,
    handleMakeChange
  };
}
