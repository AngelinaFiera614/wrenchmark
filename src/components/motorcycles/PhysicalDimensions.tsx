
import { Motorcycle } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, MoveDown, MoveUp } from "lucide-react";
import { SpecificationItem } from "./SpecificationItem";
import { useMeasurement } from "@/context/MeasurementContext";
import { formatLength, formatWeight, formatVolume } from "@/utils/unitConverters";

interface PhysicalDimensionsProps {
  motorcycle: Motorcycle;
}

export function PhysicalDimensions({ motorcycle }: PhysicalDimensionsProps) {
  const { 
    weight_kg, 
    seat_height_mm, 
    wheelbase_mm, 
    ground_clearance_mm,
    fuel_capacity_l
  } = motorcycle;
  
  const { unit } = useMeasurement();
  
  return (
    <Card className="border border-border/50 bg-card/70 backdrop-blur-sm overflow-hidden animate-in slide-in-from-bottom-5 duration-500 delay-150 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <MoveUp className="h-5 w-5 text-accent-teal" />
          <span>Physical Dimensions</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <SpecificationItem 
            label="Weight" 
            value={formatWeight(weight_kg, unit)} 
            icon={<MoveDown className="h-4 w-4" />}
            tooltip={`Dry weight without fluids or rider, measured in ${unit === 'metric' ? 'kilograms' : 'pounds'}`}
          />
          <SpecificationItem 
            label="Seat Height" 
            value={formatLength(seat_height_mm, unit)} 
            icon={<ArrowUp className="h-4 w-4" />}
            tooltip={`Height of seat from the ground, affects rider comfort and accessibility (${unit === 'metric' ? 'mm' : 'inches'})`}
          />
          <SpecificationItem 
            label="Wheelbase" 
            value={formatLength(wheelbase_mm, unit)} 
            icon={<ChevronUp className="h-4 w-4" />}
            tooltip={`Distance between the centers of the front and rear wheels, affects stability (${unit === 'metric' ? 'mm' : 'inches'})`}
          />
          <SpecificationItem 
            label="Ground Clearance" 
            value={formatLength(ground_clearance_mm, unit)} 
            icon={<ArrowDown className="h-4 w-4" />}
            tooltip={`Distance between the lowest point of the motorcycle and the ground, important for off-road riding (${unit === 'metric' ? 'mm' : 'inches'})`}
          />
          <SpecificationItem 
            label="Fuel Capacity" 
            value={formatVolume(fuel_capacity_l, unit)} 
            icon={<ChevronDown className="h-4 w-4" />}
            tooltip={`Total fuel the tank can hold in ${unit === 'metric' ? 'liters' : 'gallons'}, affects range between refueling`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
