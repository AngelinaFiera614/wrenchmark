
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
      filterType="seatHeight"
      min={650}
      max={950}
      step={10}
      value={seatHeightRange}
      defaultValue={[650, 950]}
      onChange={onChange}
      valueFormatter={(v) => `${v} mm`}
    />
  );
}
