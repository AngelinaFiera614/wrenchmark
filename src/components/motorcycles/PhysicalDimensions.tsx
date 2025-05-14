
import { Motorcycle } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, CircleArrowDown } from "lucide-react";
import { SpecificationItem } from "./SpecificationItem";

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
  
  return (
    <Card className="border border-border/50 bg-card/70 backdrop-blur-sm overflow-hidden animate-in slide-in-from-bottom-5 duration-500 delay-150 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <ArrowDown className="h-5 w-5 text-primary" />
          <span>Physical Dimensions</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <SpecificationItem 
            label="Weight" 
            value={`${weight_kg} kg`} 
            icon={<ArrowDown className="h-4 w-4" />}
            tooltip="Dry weight without fluids or rider"
          />
          <SpecificationItem 
            label="Seat Height" 
            value={`${seat_height_mm} mm`} 
            icon={<ArrowUp className="h-4 w-4" />}
            tooltip="Height of seat from the ground, affects rider comfort and accessibility"
          />
          <SpecificationItem 
            label="Wheelbase" 
            value={`${wheelbase_mm} mm`} 
            icon={<CircleArrowDown className="h-4 w-4" />}
            tooltip="Distance between the centers of the front and rear wheels"
          />
          <SpecificationItem 
            label="Ground Clearance" 
            value={`${ground_clearance_mm} mm`} 
            icon={<ArrowDown className="h-4 w-4" />}
            tooltip="Distance between the lowest point of the motorcycle and the ground"
          />
          <SpecificationItem 
            label="Fuel Capacity" 
            value={`${fuel_capacity_l} L`} 
            icon={<CircleArrowDown className="h-4 w-4" />}
            tooltip="Total fuel the tank can hold"
          />
        </div>
      </CardContent>
    </Card>
  );
}
