
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
        <div className="glass-medium p-3 rounded-xl text-center border border-white/10 hover:glass-heavy transition-all duration-300 group">
          <span className="text-secondary-muted text-xs block mb-1 font-medium tracking-wide uppercase">
            Engine
          </span>
          <span className="font-mono text-white font-bold text-sm group-hover:text-primary transition-colors">
            {formatEngineSize()}
          </span>
        </div>
        <div className="glass-medium p-3 rounded-xl text-center border border-white/10 hover:glass-heavy transition-all duration-300 group">
          <span className="text-secondary-muted text-xs block mb-1 font-medium tracking-wide uppercase">
            Power
          </span>
          <span className="font-mono text-white font-bold text-sm group-hover:text-primary transition-colors">
            {formatHorsepower()}
          </span>
        </div>
        <div className="glass-medium p-3 rounded-xl text-center border border-white/10 hover:glass-heavy transition-all duration-300 group">
          <span className="text-secondary-muted text-xs block mb-1 font-medium tracking-wide uppercase">
            Speed
          </span>
          <span className="font-mono text-white font-bold text-sm group-hover:text-primary transition-colors">
            {formatSpeed()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="glass-medium p-3 rounded-xl text-center border border-white/10 hover:glass-heavy transition-all duration-300 group">
          <span className="text-secondary-muted text-xs block mb-1 font-medium tracking-wide uppercase">
            Seat
          </span>
          <span className="font-mono text-white font-bold text-sm group-hover:text-primary transition-colors">
            {formatSeatHeight()}
          </span>
        </div>
        <div className="glass-medium p-3 rounded-xl text-center border border-white/10 hover:glass-heavy transition-all duration-300 group">
          <span className="text-secondary-muted text-xs block mb-1 font-medium tracking-wide uppercase">
            Weight
          </span>
          <span className="font-mono text-white font-bold text-sm group-hover:text-primary transition-colors">
            {formatWeight()}
          </span>
        </div>
        <div className="glass-medium p-3 rounded-xl text-center flex flex-col items-center border border-white/10 hover:glass-heavy transition-all duration-300 group">
          <span className="text-secondary-muted text-xs block mb-1 font-medium tracking-wide uppercase">
            ABS
          </span>
          {abs ? (
            <CheckCircle2 className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
          ) : (
            <span className="text-secondary-muted font-mono">—</span>
          )}
        </div>
      </div>
    </div>
  );
}
