
import { Motorcycle } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, MoveDown, MoveUp } from "lucide-react";
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
  
  // Format values to handle zero or undefined values gracefully
  const formatWeight = () => {
    if (!weight_kg || weight_kg <= 0) return "N/A";
    return `${weight_kg} kg`;
  };
  
  const formatSeatHeight = () => {
    if (!seat_height_mm || seat_height_mm <= 0) return "N/A";
    return `${seat_height_mm} mm`;
  };
  
  const formatWheelbase = () => {
    if (!wheelbase_mm || wheelbase_mm <= 0) return "N/A";
    return `${wheelbase_mm} mm`;
  };
  
  const formatGroundClearance = () => {
    if (!ground_clearance_mm || ground_clearance_mm <= 0) return "N/A";
    return `${ground_clearance_mm} mm`;
  };
  
  const formatFuelCapacity = () => {
    if (!fuel_capacity_l || fuel_capacity_l <= 0) return "N/A";
    return `${fuel_capacity_l} L`;
  };
  
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
            value={formatWeight()} 
            icon={<MoveDown className="h-4 w-4" />}
            tooltip="Dry weight without fluids or rider, measured in kilograms"
          />
          <SpecificationItem 
            label="Seat Height" 
            value={formatSeatHeight()} 
            icon={<ArrowUp className="h-4 w-4" />}
            tooltip="Height of seat from the ground, affects rider comfort and accessibility"
          />
          <SpecificationItem 
            label="Wheelbase" 
            value={formatWheelbase()} 
            icon={<ChevronUp className="h-4 w-4" />}
            tooltip="Distance between the centers of the front and rear wheels, affects stability"
          />
          <SpecificationItem 
            label="Ground Clearance" 
            value={formatGroundClearance()} 
            icon={<ArrowDown className="h-4 w-4" />}
            tooltip="Distance between the lowest point of the motorcycle and the ground, important for off-road riding"
          />
          <SpecificationItem 
            label="Fuel Capacity" 
            value={formatFuelCapacity()} 
            icon={<ChevronDown className="h-4 w-4" />}
            tooltip="Total fuel the tank can hold in liters, affects range between refueling"
          />
        </div>
      </CardContent>
    </Card>
  );
}
