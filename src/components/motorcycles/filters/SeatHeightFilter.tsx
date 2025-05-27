
import React from "react";
import RangeSlider from "@/components/common/RangeSlider";

interface SeatHeightFilterProps {
  seatHeightRange: [number, number];
  onChange: (values: number[]) => void;
}

export default function SeatHeightFilter({ seatHeightRange, onChange }: SeatHeightFilterProps) {
  return (
    <RangeSlider
      title="Seat Height"
      values={seatHeightRange}
      min={650}
      max={950}
      step={5}
      unit="mm"
      onChange={onChange}
      filterType="seatHeight"
    />
  );
}
