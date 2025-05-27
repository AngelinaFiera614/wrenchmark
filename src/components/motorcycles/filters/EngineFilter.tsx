
import React from "react";
import RangeSlider from "@/components/common/RangeSlider";

interface EngineFilterProps {
  engineSizeRange: [number, number];
  onChange: (values: number[]) => void;
}

export default function EngineFilter({ engineSizeRange, onChange }: EngineFilterProps) {
  return (
    <RangeSlider
      title="Engine Size"
      values={engineSizeRange}
      min={0}
      max={2000}
      step={25}
      unit="cc"
      onChange={onChange}
      filterType="engineSize"
    />
  );
}
