
import React from "react";
import RangeFilter from "./RangeFilter";

interface SeatHeightFilterProps {
  seatHeightRange: [number, number];
  onChange: (values: number[]) => void;
}

export default function SeatHeightFilter({ 
  seatHeightRange, 
  onChange 
}: SeatHeightFilterProps) {
  return (
    <RangeFilter
      title="Seat Height"
      min={650}
      max={950}
      step={10}
      value={seatHeightRange}
      onChange={onChange}
      valueFormatter={(v) => `${v} mm`}
    />
  );
}
