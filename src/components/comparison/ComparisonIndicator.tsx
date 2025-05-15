
import { useNavigate } from "react-router-dom";
import { useComparison } from "@/context/ComparisonContext";
import { Button } from "@/components/ui/button";
import { GitCompareArrows, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ComparisonIndicator() {
  const { motorcyclesToCompare, clearComparison } = useComparison();
  const navigate = useNavigate();
  
  if (motorcyclesToCompare.length === 0) {
    return null;
  }
  
  const handleCompareClick = () => {
    navigate("/compare");
  };
  
  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearComparison();
  };

  return (
    <div 
      className={cn(
        "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50",
        "flex items-center gap-2 px-4 py-3 rounded-full",
        "bg-accent-teal text-black shadow-lg",
        "animate-in slide-in-from-bottom duration-300"
      )}
    >
      <Button 
        variant="ghost" 
        size="sm" 
        className="hover:bg-black/10 p-0 h-8 w-8 rounded-full"
        onClick={handleClearClick}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Clear comparison</span>
      </Button>
      
      <div className="flex items-center gap-2" onClick={handleCompareClick}>
        <GitCompareArrows className="h-5 w-5" />
        <span className="font-medium">
          Compare {motorcyclesToCompare.length} {motorcyclesToCompare.length === 1 ? 'motorcycle' : 'motorcycles'}
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-1 bg-black/20 hover:bg-black/30 text-black h-7"
        >
          View
        </Button>
      </div>
    </div>
  );
}
