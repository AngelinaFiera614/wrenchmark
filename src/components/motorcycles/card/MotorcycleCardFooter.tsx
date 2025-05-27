
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface MotorcycleCardFooterProps {
  difficultyLevel: number;
}

export function MotorcycleCardFooter({ difficultyLevel }: MotorcycleCardFooterProps) {
  const difficultyColor = `difficulty-${difficultyLevel}`;

  return (
    <div className="flex items-center justify-between p-5 pt-0">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary-muted">Difficulty:</span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-2 h-5 mx-0.5 rounded-sm transition-all",
                      i < difficultyLevel ? difficultyColor : "bg-white/10"
                    )}
                  />
                ))}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="glass-morphism border-white/20">
            <p>Difficulty level: {difficultyLevel}/5</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div>
        <Info className="h-4 w-4 text-secondary-muted" />
      </div>
    </div>
  );
}
