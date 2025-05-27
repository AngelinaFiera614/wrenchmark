
import React from "react";
import { SpecificationItem } from "../SpecificationItem";

interface DimensionSpecItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  tooltip: string;
}

export function DimensionSpecItem({ 
  label, 
  value, 
  icon, 
  tooltip 
}: DimensionSpecItemProps) {
  return (
    <SpecificationItem 
      label={label}
      value={value}
      icon={icon}
      tooltip={tooltip}
    />
  );
}
