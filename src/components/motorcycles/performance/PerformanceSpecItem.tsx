
import React from "react";
import { SpecificationItem } from "../SpecificationItem";

interface PerformanceSpecItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  tooltip: string;
}

export function PerformanceSpecItem({ 
  label, 
  value, 
  icon, 
  tooltip 
}: PerformanceSpecItemProps) {
  return (
    <SpecificationItem 
      label={label}
      value={value}
      icon={icon}
      tooltip={tooltip}
    />
  );
}
