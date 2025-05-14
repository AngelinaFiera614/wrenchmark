
import { useState, useCallback } from "react";

export interface DifficultyFilterState {
  difficultyLevel: number;
}

export function useDifficultyFilter(initialLevel: number = 5) {
  const [difficultyLevel, setDifficultyLevel] = useState<number>(initialLevel);

  const handleDifficultyChange = useCallback((values: number[]) => {
    setDifficultyLevel(values[0]);
  }, []);

  return {
    difficultyLevel,
    handleDifficultyChange
  };
}
