
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import FilterSection from './FilterSection';
import FilterReset from '../motorcycles/filters/FilterReset';

interface RangeSliderProps {
  title: string;
  values: [number, number];
  min: number;
  max: number;
  step?: number;
  unit?: string;
  formatValue?: (value: number) => string;
  onChange: (values: number[]) => void;
  filterType?: "all" | "categories" | "make" | "engineSize" | "difficulty" | 
                "weight" | "seatHeight" | "year" | "abs" | "search";
}

export default function RangeSlider({
  title,
  values,
  min,
  max,
  step = 1,
  unit = '',
  formatValue,
  onChange,
  filterType
}: RangeSliderProps) {
  const hasActiveFilter = values[0] !== min || values[1] !== max;
  
  const displayValue = (value: number) => {
    if (formatValue) return formatValue(value);
    return `${value}${unit}`;
  };

  return (
    <FilterSection 
      title={title}
      action={hasActiveFilter && filterType ? 
        <FilterReset filterType={filterType} /> : 
        undefined
      }
    >
      <div className="space-y-3">
        <Slider
          value={values}
          onValueChange={onChange}
          max={max}
          min={min}
          step={step}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-white/70">
          <span>{displayValue(values[0])}</span>
          <span>{displayValue(values[1])}</span>
        </div>
        {hasActiveFilter && (
          <Badge variant="outline" className="w-fit text-xs">
            Active: {displayValue(values[0])} - {displayValue(values[1])}
          </Badge>
        )}
      </div>
    </FilterSection>
  );
}
