
import { Motorcycle } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GaugeCircle, Activity, Gauge, CircleArrowUp } from "lucide-react";
import { SpecificationItem } from "./SpecificationItem";

interface PerformanceSpecificationsProps {
  motorcycle: Motorcycle;
}

export function PerformanceSpecifications({ motorcycle }: PerformanceSpecificationsProps) {
  const { engine_cc, horsepower_hp, torque_nm, top_speed_kph } = motorcycle;
  
  return (
    <Card className="border border-border/50 bg-card/70 backdrop-blur-sm overflow-hidden animate-in slide-in-from-bottom-5 duration-500 delay-100 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <GaugeCircle className="h-5 w-5 text-accent-teal" />
          <span>Performance Specifications</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <SpecificationItem 
            label="Engine" 
            value={`${engine_cc} cc`} 
            icon={<GaugeCircle className="h-4 w-4" />}
            tooltip="Engine displacement in cubic centimeters, indicating the size of the engine"
          />
          <SpecificationItem 
            label="Horsepower" 
            value={`${horsepower_hp} hp`} 
            icon={<Activity className="h-4 w-4" />}
            tooltip="Maximum power output of the engine"
          />
          <SpecificationItem 
            label="Torque" 
            value={`${torque_nm} Nm`} 
            icon={<CircleArrowUp className="h-4 w-4" />}
            tooltip="Rotational force produced by the engine"
          />
          <SpecificationItem 
            label="Top Speed" 
            value={`${top_speed_kph} km/h`} 
            icon={<Gauge className="h-4 w-4" />}
            tooltip="Maximum speed the motorcycle can achieve"
          />
        </div>
      </CardContent>
    </Card>
  );
}
