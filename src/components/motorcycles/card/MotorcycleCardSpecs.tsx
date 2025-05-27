
import { CheckCircle2 } from "lucide-react";

interface MotorcycleCardSpecsProps {
  engineCc?: number;
  horsepowerHp?: number;
  topSpeedKph?: number;
  seatHeightMm?: number;
  weightKg?: number;
  abs?: boolean;
}

export function MotorcycleCardSpecs({
  engineCc,
  horsepowerHp,
  topSpeedKph,
  seatHeightMm,
  weightKg,
  abs
}: MotorcycleCardSpecsProps) {
  const formatEngineSize = () => engineCc && engineCc > 0 ? `${engineCc} cc` : "N/A";
  const formatHorsepower = () => horsepowerHp && horsepowerHp > 0 ? `${horsepowerHp} hp` : "N/A";
  const formatSpeed = () => topSpeedKph && topSpeedKph > 0 ? `${topSpeedKph} km/h` : "N/A";
  const formatSeatHeight = () => seatHeightMm && seatHeightMm > 0 ? `${seatHeightMm} mm` : "N/A";
  const formatWeight = () => weightKg && weightKg > 0 ? `${weightKg} kg` : "N/A";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="glass-morphism p-2 rounded-lg text-center">
          <span className="text-secondary-muted text-xs block mb-1">Engine</span>
          <span className="font-mono text-white font-medium">{formatEngineSize()}</span>
        </div>
        <div className="glass-morphism p-2 rounded-lg text-center">
          <span className="text-secondary-muted text-xs block mb-1">Power</span>
          <span className="font-mono text-white font-medium">{formatHorsepower()}</span>
        </div>
        <div className="glass-morphism p-2 rounded-lg text-center">
          <span className="text-secondary-muted text-xs block mb-1">Speed</span>
          <span className="font-mono text-white font-medium">{formatSpeed()}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="glass-morphism p-2 rounded-lg text-center">
          <span className="text-secondary-muted text-xs block mb-1">Seat</span>
          <span className="font-mono text-white font-medium">{formatSeatHeight()}</span>
        </div>
        <div className="glass-morphism p-2 rounded-lg text-center">
          <span className="text-secondary-muted text-xs block mb-1">Weight</span>
          <span className="font-mono text-white font-medium">{formatWeight()}</span>
        </div>
        <div className="glass-morphism p-2 rounded-lg text-center flex flex-col items-center">
          <span className="text-secondary-muted text-xs block mb-1">ABS</span>
          {abs ? (
            <CheckCircle2 className="h-4 w-4 text-primary" />
          ) : (
            <span className="text-secondary-muted">—</span>
          )}
        </div>
      </div>
    </div>
  );
}
