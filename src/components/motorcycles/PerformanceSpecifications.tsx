
import { Motorcycle } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GaugeCircle, Zap, Gauge, Timer } from "lucide-react";
import { PerformanceSpecItem } from "./performance/PerformanceSpecItem";
import { usePerformanceData } from "./performance/usePerformanceData";

interface PerformanceSpecificationsProps {
  motorcycle: Motorcycle;
}

export function PerformanceSpecifications({ motorcycle }: PerformanceSpecificationsProps) {
  const { engineSize, horsepower, torque, topSpeed, unit } = usePerformanceData(motorcycle);
  
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
          <PerformanceSpecItem 
            label="Engine" 
            value={engineSize} 
            icon={<GaugeCircle className="h-4 w-4" />}
            tooltip="Engine displacement in cubic centimeters, indicating the size of the engine"
          />
          <PerformanceSpecItem 
            label="Horsepower" 
            value={horsepower} 
            icon={<Zap className="h-4 w-4" />}
            tooltip="Maximum power output of the engine, measured in horsepower (hp)"
          />
          <PerformanceSpecItem 
            label="Torque" 
            value={torque} 
            icon={<Timer className="h-4 w-4" />}
            tooltip="Rotational force produced by the engine, measured in Newton meters (Nm)"
          />
          <PerformanceSpecItem 
            label="Top Speed" 
            value={topSpeed} 
            icon={<Gauge className="h-4 w-4" />}
            tooltip={`Maximum speed the motorcycle can achieve in ${unit === 'metric' ? 'kilometers per hour' : 'miles per hour'}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
