
import React from "react";
import RangeSlider from "@/components/common/RangeSlider";

interface WeightFilterProps {
  weightRange: [number, number];
  onChange: (values: number[]) => void;
}

export default function WeightFilter({ weightRange, onChange }: WeightFilterProps) {
  return (
    <RangeSlider
      title="Weight"
      values={weightRange}
      min={100}
      max={400}
      step={5}
      unit="kg"
      onChange={onChange}
      filterType="weight"
    />
  );
}
