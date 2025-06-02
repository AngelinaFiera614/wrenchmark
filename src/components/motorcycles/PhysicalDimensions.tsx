
import { Motorcycle } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, MoveDown, MoveUp } from "lucide-react";
import { DimensionSpecItem } from "./dimensions/DimensionSpecItem";
import { useDimensionData } from "./dimensions/useDimensionData";

interface PhysicalDimensionsProps {
  motorcycle: Motorcycle;
  selectedConfiguration?: any;
}

export function PhysicalDimensions({ motorcycle, selectedConfiguration }: PhysicalDimensionsProps) {
  const { weight, seatHeight, wheelbase, groundClearance, fuelCapacity, unit } = useDimensionData(motorcycle, selectedConfiguration);
  
  return (
    <Card className="border border-border/50 bg-card/70 backdrop-blur-sm overflow-hidden animate-in slide-in-from-bottom-5 duration-500 delay-150 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <MoveUp className="h-5 w-5 text-accent-teal" />
          <span>Physical Dimensions</span>
          {selectedConfiguration && (
            <span className="text-sm text-muted-foreground font-normal">
              ({selectedConfiguration.name || 'Configuration'})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <DimensionSpecItem 
            label="Weight" 
            value={weight} 
            icon={<MoveDown className="h-4 w-4" />}
            tooltip={`Dry weight without fluids or rider, measured in ${unit === 'metric' ? 'kilograms' : 'pounds'}`}
          />
          <DimensionSpecItem 
            label="Seat Height" 
            value={seatHeight} 
            icon={<ArrowUp className="h-4 w-4" />}
            tooltip={`Height of seat from the ground, affects rider comfort and accessibility (${unit === 'metric' ? 'mm' : 'inches'})`}
          />
          <DimensionSpecItem 
            label="Wheelbase" 
            value={wheelbase} 
            icon={<ChevronUp className="h-4 w-4" />}
            tooltip={`Distance between the centers of the front and rear wheels, affects stability (${unit === 'metric' ? 'mm' : 'inches'})`}
          />
          <DimensionSpecItem 
            label="Ground Clearance" 
            value={groundClearance} 
            icon={<ArrowDown className="h-4 w-4" />}
            tooltip={`Distance between the lowest point of the motorcycle and the ground, important for off-road riding (${unit === 'metric' ? 'mm' : 'inches'})`}
          />
          <DimensionSpecItem 
            label="Fuel Capacity" 
            value={fuelCapacity} 
            icon={<ChevronDown className="h-4 w-4" />}
            tooltip={`Total fuel the tank can hold in ${unit === 'metric' ? 'liters' : 'gallons'}, affects range between refueling`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
