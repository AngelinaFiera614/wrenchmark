
import { Motorcycle } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GaugeCircle, Zap, Gauge, Timer } from "lucide-react";
import { SpecificationItem } from "./SpecificationItem";
import { useMeasurement } from "@/context/MeasurementContext";
import { formatSpeed } from "@/utils/unitConverters";

interface PerformanceSpecificationsProps {
  motorcycle: Motorcycle;
}

export function PerformanceSpecifications({ motorcycle }: PerformanceSpecificationsProps) {
  const { engine_cc, horsepower_hp, torque_nm, top_speed_kph } = motorcycle;
  const { unit } = useMeasurement();
  
  // Format values to handle zero or undefined values gracefully
  const formatEngineSize = () => {
    if (!engine_cc || engine_cc <= 0) return "N/A";
    return `${engine_cc} cc`;
  };
  
  const formatHorsepower = () => {
    if (!horsepower_hp || horsepower_hp <= 0) return "N/A";
    return `${horsepower_hp} hp`;
  };
  
  const formatTorque = () => {
    if (!torque_nm || torque_nm <= 0) return "N/A";
    return `${torque_nm} Nm`;
  };
  
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
            value={formatEngineSize()} 
            icon={<GaugeCircle className="h-4 w-4" />}
            tooltip="Engine displacement in cubic centimeters, indicating the size of the engine"
          />
          <SpecificationItem 
            label="Horsepower" 
            value={formatHorsepower()} 
            icon={<Zap className="h-4 w-4" />}
            tooltip="Maximum power output of the engine, measured in horsepower (hp)"
          />
          <SpecificationItem 
            label="Torque" 
            value={formatTorque()} 
            icon={<Timer className="h-4 w-4" />}
            tooltip="Rotational force produced by the engine, measured in Newton meters (Nm)"
          />
          <SpecificationItem 
            label="Top Speed" 
            value={formatSpeed(top_speed_kph, unit)} 
            icon={<Gauge className="h-4 w-4" />}
            tooltip={`Maximum speed the motorcycle can achieve in ${unit === 'metric' ? 'kilometers per hour' : 'miles per hour'}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
