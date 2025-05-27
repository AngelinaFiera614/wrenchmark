
import { Motorcycle } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, MoveDown, MoveUp } from "lucide-react";
import { SpecificationItem } from "./SpecificationItem";
import { useMeasurement } from "@/context/MeasurementContext";

interface PhysicalDimensionsProps {
  motorcycle: Motorcycle;
}

export function PhysicalDimensions({ motorcycle }: PhysicalDimensionsProps) {
  const { 
    weight_kg, 
    weight_lbs,
    seat_height_mm, 
    seat_height_in,
    wheelbase_mm,
    wheelbase_in, 
    ground_clearance_mm,
    ground_clearance_in,
    fuel_capacity_l,
    fuel_capacity_gal
  } = motorcycle;
  
  const { unit } = useMeasurement();
  
  // Helper functions to format values based on unit preference
  const formatWeight = () => {
    if (unit === "metric") {
      if (!weight_kg || weight_kg <= 0) return "N/A";
      return `${weight_kg.toFixed(1)} kg`;
    } else {
      if (!weight_lbs || weight_lbs <= 0) return "N/A";
      return `${weight_lbs.toFixed(1)} lbs`;
    }
  };

  const formatSeatHeight = () => {
    if (unit === "metric") {
      if (!seat_height_mm || seat_height_mm <= 0) return "N/A";
      return `${seat_height_mm} mm`;
    } else {
      if (!seat_height_in || seat_height_in <= 0) return "N/A";
      return `${seat_height_in.toFixed(1)} in`;
    }
  };

  const formatWheelbase = () => {
    if (unit === "metric") {
      if (!wheelbase_mm || wheelbase_mm <= 0) return "N/A";
      return `${wheelbase_mm} mm`;
    } else {
      if (!wheelbase_in || wheelbase_in <= 0) return "N/A";
      return `${wheelbase_in.toFixed(1)} in`;
    }
  };

  const formatGroundClearance = () => {
    if (unit === "metric") {
      if (!ground_clearance_mm || ground_clearance_mm <= 0) return "N/A";
      return `${ground_clearance_mm} mm`;
    } else {
      if (!ground_clearance_in || ground_clearance_in <= 0) return "N/A";
      return `${ground_clearance_in.toFixed(1)} in`;
    }
  };

  const formatFuelCapacity = () => {
    if (unit === "metric") {
      if (!fuel_capacity_l || fuel_capacity_l <= 0) return "N/A";
      return `${fuel_capacity_l.toFixed(1)} L`;
    } else {
      if (!fuel_capacity_gal || fuel_capacity_gal <= 0) return "N/A";
      return `${fuel_capacity_gal.toFixed(1)} gal`;
    }
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
            tooltip={`Dry weight without fluids or rider, measured in ${unit === 'metric' ? 'kilograms' : 'pounds'}`}
          />
          <SpecificationItem 
            label="Seat Height" 
            value={formatSeatHeight()} 
            icon={<ArrowUp className="h-4 w-4" />}
            tooltip={`Height of seat from the ground, affects rider comfort and accessibility (${unit === 'metric' ? 'mm' : 'inches'})`}
          />
          <SpecificationItem 
            label="Wheelbase" 
            value={formatWheelbase()} 
            icon={<ChevronUp className="h-4 w-4" />}
            tooltip={`Distance between the centers of the front and rear wheels, affects stability (${unit === 'metric' ? 'mm' : 'inches'})`}
          />
          <SpecificationItem 
            label="Ground Clearance" 
            value={formatGroundClearance()} 
            icon={<ArrowDown className="h-4 w-4" />}
            tooltip={`Distance between the lowest point of the motorcycle and the ground, important for off-road riding (${unit === 'metric' ? 'mm' : 'inches'})`}
          />
          <SpecificationItem 
            label="Fuel Capacity" 
            value={formatFuelCapacity()} 
            icon={<ChevronDown className="h-4 w-4" />}
            tooltip={`Total fuel the tank can hold in ${unit === 'metric' ? 'liters' : 'gallons'}, affects range between refueling`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
