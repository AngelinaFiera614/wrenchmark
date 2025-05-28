
import React from "react";
import { useMeasurement } from "@/context/MeasurementContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ruler, Scale } from "lucide-react";

interface MeasurementToggleProps {
  className?: string;
}

export function MeasurementToggle({ className }: MeasurementToggleProps) {
  const { unit, toggleUnit } = useMeasurement();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`h-9 w-9 rounded-full ${className || ""}`}>
          <Ruler className="h-5 w-5 rotate-0 scale-100 transition-all data-[state=imperial]:rotate-90 data-[state=imperial]:scale-0" data-state={unit} />
          <Scale className="absolute h-5 w-5 rotate-90 scale-0 transition-all data-[state=imperial]:rotate-0 data-[state=imperial]:scale-100" data-state={unit} />
          <span className="sr-only">Toggle measurement unit</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => unit !== "metric" && toggleUnit()}>
          <Ruler className="mr-2 h-4 w-4" />
          <span>Metric (kg, km/h, mm)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => unit !== "imperial" && toggleUnit()}>
          <Scale className="mr-2 h-4 w-4" />
          <span>Imperial (lbs, mph, in)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
