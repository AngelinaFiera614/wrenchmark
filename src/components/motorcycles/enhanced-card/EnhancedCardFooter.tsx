
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
            <div className="flex items-center gap-3">
              <span className="text-xs text-secondary-muted font-medium tracking-wide uppercase">
                Difficulty:
              </span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-2 h-6 rounded-sm transition-all duration-300 hover:scale-110",
                      i < difficultyLevel 
                        ? `${difficultyColor} shadow-lg` 
                        : "bg-white/10 hover:bg-white/20"
                    )}
                  />
                ))}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="glass-morphism border-white/20 text-white">
            <p className="font-medium">Difficulty level: {difficultyLevel}/5</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
        <Info className="h-4 w-4 text-secondary-muted group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
}
