
import React from "react";
import RangeFilter from "./RangeFilter";

interface EngineFilterProps {
  engineSizeRange: [number, number];
  onChange: (values: number[]) => void;
}

export default function EngineFilter({ 
  engineSizeRange, 
  onChange 
}: EngineFilterProps) {
  return (
    <RangeFilter
      title="Engine Size"
      filterType="engineSize"
      min={0}
      max={2000}
      step={50}
      value={engineSizeRange}
      defaultValue={[0, 2000]}
      onChange={onChange}
      valueFormatter={(v) => `${v} cc`}
    />
  );
}
