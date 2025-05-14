
import React from "react";
import RangeFilter from "./RangeFilter";

interface YearFilterProps {
  yearRange: [number, number];
  onChange: (values: number[]) => void;
}

export default function YearFilter({ 
  yearRange, 
  onChange 
}: YearFilterProps) {
  return (
    <RangeFilter
      title="Year"
      min={1980}
      max={2025}
      step={1}
      value={yearRange}
      onChange={onChange}
      valueFormatter={(v) => `${v}`}
    />
  );
}
