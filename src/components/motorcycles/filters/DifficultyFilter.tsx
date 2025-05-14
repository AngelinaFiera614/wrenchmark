
import React from "react";
import RangeFilter from "./RangeFilter";

interface DifficultyFilterProps {
  difficultyLevel: number;
  onChange: (values: number[]) => void;
}

export default function DifficultyFilter({ 
  difficultyLevel, 
  onChange 
}: DifficultyFilterProps) {
  return (
    <RangeFilter
      title="Difficulty Level"
      min={1}
      max={5}
      step={1}
      value={[difficultyLevel]}
      onChange={onChange}
      labelStart="Beginner"
      labelEnd="Expert"
    />
  );
}
