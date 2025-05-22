
import React from "react";
import { useMeasurement } from "@/context/MeasurementContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Ruler } from "lucide-react";

interface MeasurementToggleProps {
  className?: string;
}

export function MeasurementToggle({ className }: MeasurementToggleProps) {
  const { unit, toggleUnit } = useMeasurement();
  
  return (
    <div className={`flex items-center space-x-2 ${className || ""}`}>
      <Ruler className="h-4 w-4 text-muted-foreground" />
      <Switch 
        id="measurement-toggle" 
        checked={unit === "imperial"} 
        onCheckedChange={toggleUnit} 
      />
      <Label 
        htmlFor="measurement-toggle"
        className="text-xs font-medium cursor-pointer"
      >
        {unit === "metric" ? "Metric" : "Imperial"}
      </Label>
    </div>
  );
}
