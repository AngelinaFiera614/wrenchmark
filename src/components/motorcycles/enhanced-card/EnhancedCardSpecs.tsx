
import { CheckCircle2 } from "lucide-react";

interface EnhancedCardSpecsProps {
  engineCc?: number;
  horsepowerHp?: number;
  topSpeedKph?: number;
  seatHeightMm?: number;
  weightKg?: number;
  abs?: boolean;
}

export function EnhancedCardSpecs({
  engineCc,
  horsepowerHp,
  topSpeedKph,
  seatHeightMm,
  weightKg,
  abs
}: EnhancedCardSpecsProps) {
  const formatEngineSize = () => engineCc && engineCc > 0 ? `${engineCc} cc` : "N/A";
  const formatHorsepower = () => horsepowerHp && horsepowerHp > 0 ? `${horsepowerHp} hp` : "N/A";
  const formatSpeed = () => topSpeedKph && topSpeedKph > 0 ? `${topSpeedKph} km/h` : "N/A";
  const formatSeatHeight = () => seatHeightMm && seatHeightMm > 0 ? `${seatHeightMm} mm` : "N/A";
  const formatWeight = () => weightKg && weightKg > 0 ? `${weightKg} kg` : "N/A";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="glass-medium p-3 rounded-xl text-center border border-white/10">
          <span className="text-secondary-muted text-xs block mb-1">Engine</span>
          <span className="font-mono text-white font-semibold">{formatEngineSize()}</span>
        </div>
        <div className="glass-medium p-3 rounded-xl text-center border border-white/10">
          <span className="text-secondary-muted text-xs block mb-1">Power</span>
          <span className="font-mono text-white font-semibold">{formatHorsepower()}</span>
        </div>
        <div className="glass-medium p-3 rounded-xl text-center border border-white/10">
          <span className="text-secondary-muted text-xs block mb-1">Speed</span>
          <span className="font-mono text-white font-semibold">{formatSpeed()}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="glass-medium p-3 rounded-xl text-center border border-white/10">
          <span className="text-secondary-muted text-xs block mb-1">Seat</span>
          <span className="font-mono text-white font-semibold">{formatSeatHeight()}</span>
        </div>
        <div className="glass-medium p-3 rounded-xl text-center border border-white/10">
          <span className="text-secondary-muted text-xs block mb-1">Weight</span>
          <span className="font-mono text-white font-semibold">{formatWeight()}</span>
        </div>
        <div className="glass-medium p-3 rounded-xl text-center flex flex-col items-center border border-white/10">
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
