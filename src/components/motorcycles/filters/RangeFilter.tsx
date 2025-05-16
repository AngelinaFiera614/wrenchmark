
import React from "react";
import { Slider } from "@/components/ui/slider";
import FilterSection from "./FilterSection";
import FilterReset from "./FilterReset";

interface RangeFilterProps {
  title: string;
  filterType: "engineSize" | "difficulty" | "weight" | "seatHeight" | "year";
  min: number;
  max: number;
  step: number;
  value: number[];
  defaultValue?: number[];
  onChange: (values: number[]) => void;
  labelStart?: string;
  labelEnd?: string;
  valueFormatter?: (value: number) => string;
}

export default function RangeFilter({ 
  title, 
  filterType,
  min, 
  max, 
  step,
  value, 
  defaultValue,
  onChange, 
  labelStart,
  labelEnd,
  valueFormatter = (v) => `${v}`
}: RangeFilterProps) {
  const isDefault = defaultValue && 
    ((value.length === 1 && value[0] === defaultValue[0]) ||
     (value.length === 2 && 
      value[0] === defaultValue[0] && 
      value[1] === defaultValue[1]));
      
  const isActive = !isDefault && 
    ((value.length === 1 && value[0] !== defaultValue?.[0]) || 
     (value.length === 2 && 
      (value[0] !== min || value[1] !== max)));
  
  return (
    <FilterSection 
      title={title}
      action={isActive ? <FilterReset filterType={filterType} /> : undefined}
    >
      <div className="px-2">
        <Slider 
          defaultValue={value}
          min={min}
          max={max}
          step={step}
          onValueChange={onChange}
          className={isActive ? "data-[active=true]:bg-primary" : ""}
          data-active={isActive}
        />
        <div className="flex justify-between mt-2 text-xs">
          <span className={isActive ? "font-medium text-white" : "text-white/80"}>
            {labelStart || valueFormatter(value[0])}
          </span>
          <span className={isActive ? "font-medium text-white" : "text-white/80"}>
            {labelEnd || (value.length > 1 ? valueFormatter(value[1]) : '')}
          </span>
        </div>
        {isActive && (
          <div className="text-xs text-center mt-1 text-accent-teal">
            Filter active
          </div>
        )}
      </div>
    </FilterSection>
  );
}
