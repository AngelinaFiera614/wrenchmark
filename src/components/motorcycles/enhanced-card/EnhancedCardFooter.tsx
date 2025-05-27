
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface EnhancedCardFooterProps {
  difficultyLevel: number;
}

export function EnhancedCardFooter({ difficultyLevel }: EnhancedCardFooterProps) {
  const difficultyColor = `difficulty-${difficultyLevel}`;

  return (
    <div className="flex items-center justify-between">
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
                      "w-2 h-6 mx-0.5 rounded-sm transition-all",
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
      
      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
        <Info className="h-4 w-4 text-secondary-muted" />
      </div>
    </div>
  );
}
