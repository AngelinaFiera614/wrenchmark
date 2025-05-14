
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
      filterType="year"
      min={1980}
      max={2025}
      step={1}
      value={yearRange}
      defaultValue={[1980, 2023]}
      onChange={onChange}
      valueFormatter={(v) => `${v}`}
    />
  );
}
