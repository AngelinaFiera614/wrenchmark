
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
      min={0}
      max={2000}
      step={50}
      value={engineSizeRange}
      onChange={onChange}
      valueFormatter={(v) => `${v} cc`}
    />
  );
}
