
import React from "react";
import RangeSlider from "@/components/common/RangeSlider";

interface YearFilterProps {
  yearRange: [number, number];
  onChange: (values: number[]) => void;
}

export default function YearFilter({ yearRange, onChange }: YearFilterProps) {
  return (
    <RangeSlider
      title="Year"
      values={yearRange}
      min={1980}
      max={2025}
      step={1}
      onChange={onChange}
      filterType="year"
    />
  );
}
