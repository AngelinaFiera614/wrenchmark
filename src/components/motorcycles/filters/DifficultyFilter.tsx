
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
      filterType="difficulty"
      min={1}
      max={5}
      step={1}
      value={[difficultyLevel]}
      defaultValue={[5]}
      onChange={onChange}
      labelStart="Beginner"
      labelEnd="Expert"
    />
  );
}
