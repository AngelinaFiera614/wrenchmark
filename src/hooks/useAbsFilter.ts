
import { useState, useCallback } from "react";

export interface AbsFilterState {
  abs: boolean | null;
}

export function useAbsFilter(initialValue: boolean | null = null) {
  const [abs, setAbs] = useState<boolean | null>(initialValue);

  const handleAbsChange = useCallback((checked: boolean) => {
    setAbs(checked ? true : null);
  }, []);

  return {
    abs,
    handleAbsChange
  };
}
