
import { Motorcycle } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GaugeCircle, Zap, Gauge, Timer, Shield } from "lucide-react";
import { PerformanceSpecItem } from "./performance/PerformanceSpecItem";
import { usePerformanceData } from "./performance/usePerformanceData";

interface PerformanceSpecificationsProps {
  motorcycle: Motorcycle;
}

export function PerformanceSpecifications({ motorcycle }: PerformanceSpecificationsProps) {
  const { engineType, horsepower, torque, topSpeed, brakeSystem, unit } = usePerformanceData(motorcycle);
  
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
            value={engineType} 
            icon={<GaugeCircle className="h-4 w-4" />}
            tooltip="Engine displacement and configuration type"
          />
          <PerformanceSpecItem 
            label="Power" 
            value={horsepower} 
            icon={<Zap className="h-4 w-4" />}
            tooltip="Maximum power output with RPM peak where available"
          />
          <PerformanceSpecItem 
            label="Torque" 
            value={torque} 
            icon={<Timer className="h-4 w-4" />}
            tooltip="Maximum torque output with RPM peak where available"
          />
          <PerformanceSpecItem 
            label="Top Speed" 
            value={topSpeed} 
            icon={<Gauge className="h-4 w-4" />}
            tooltip={`Maximum speed the motorcycle can achieve in ${unit === 'metric' ? 'kilometers per hour' : 'miles per hour'}`}
          />
          <PerformanceSpecItem 
            label="Brake System" 
            value={brakeSystem} 
            icon={<Shield className="h-4 w-4" />}
            tooltip="Brake system type and safety features"
          />
        </div>
      </CardContent>
    </Card>
  );
}
