
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SpecItemProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  tooltip?: string;
}

export function SpecificationItem({ label, value, icon, tooltip }: SpecItemProps) {
  return (
    <div className="grid grid-cols-2 gap-2 py-2 border-b border-border/50 group hover:bg-muted/20 px-2 -mx-2 rounded transition-colors">
      <div className="flex items-center gap-2">
        {icon && <span className="text-primary">{icon}</span>}
        <span className="text-muted-foreground">{label}</span>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground/70 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px] text-xs bg-popover/95 backdrop-blur-sm border-border/50">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <span className={cn("font-mono text-right text-foreground", typeof value === "string" ? "" : "")}>{value}</span>
    </div>
  );
}
