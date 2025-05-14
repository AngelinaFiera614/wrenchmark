
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
      filterType="weight"
      min={100}
      max={400}
      step={10}
      value={weightRange}
      defaultValue={[100, 400]}
      onChange={onChange}
      valueFormatter={(v) => `${v} kg`}
    />
  );
}
