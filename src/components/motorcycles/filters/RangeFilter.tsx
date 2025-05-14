
import React from "react";
import { Slider } from "@/components/ui/slider";
import FilterSection from "./FilterSection";

interface RangeFilterProps {
  title: string;
  min: number;
  max: number;
  step: number;
  value: number[];
  onChange: (values: number[]) => void;
  labelStart?: string;
  labelEnd?: string;
  valueFormatter?: (value: number) => string;
}

export default function RangeFilter({ 
  title, 
  min, 
  max, 
  step,
  value, 
  onChange, 
  labelStart,
  labelEnd,
  valueFormatter = (v) => `${v}`
}: RangeFilterProps) {
  return (
    <FilterSection title={title}>
      <div className="px-2">
        <Slider 
          defaultValue={value}
          min={min}
          max={max}
          step={step}
          onValueChange={onChange}
        />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{labelStart || valueFormatter(value[0])}</span>
          <span>{labelEnd || (value.length > 1 ? valueFormatter(value[1]) : '')}</span>
        </div>
      </div>
    </FilterSection>
  );
}
