
import React from "react";
import RangeFilter from "./RangeFilter";

interface WeightFilterProps {
  weightRange: [number, number];
  onChange: (values: number[]) => void;
}

export default function WeightFilter({ 
  weightRange, 
  onChange 
}: WeightFilterProps) {
  return (
    <RangeFilter
      title="Weight"
      min={100}
      max={400}
      step={10}
      value={weightRange}
      onChange={onChange}
      valueFormatter={(v) => `${v} kg`}
    />
  );
}
