
import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "premium" | "minimal";
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ className, icon: Icon, title, value, description, trend, variant = "default", ...props }, ref) => {
    const baseClasses = "relative overflow-hidden backdrop-blur-md border text-white transition-all duration-300 p-6";
    
    const variantClasses = {
      default: "bg-white/5 border-white/10 shadow-glass rounded-xl hover:bg-white/10",
      premium: "bg-gradient-to-br from-white/10 to-white/5 border-primary/30 shadow-teal-glow rounded-2xl hover:shadow-teal-glow-lg",
      minimal: "bg-white/3 border-white/5 rounded-lg hover:bg-white/8",
    };

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {Icon && (
                <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              )}
              <p className="text-sm font-medium text-secondary-muted">{title}</p>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
            {description && (
              <p className="text-sm text-secondary-muted">{description}</p>
            )}
          </div>
          
          {trend && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              trend.isPositive 
                ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            )}>
              <span>{trend.isPositive ? "+" : ""}{trend.value}%</span>
            </div>
          )}
        </div>
        
        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    );
  }
);
StatsCard.displayName = "StatsCard";

export { StatsCard };
