
import { Motorcycle } from "@/types";
import { Button } from "@/components/ui/button";
import { BookmarkPlus, Share2, Scale } from "lucide-react";
import { toast } from "sonner";
import { useComparison } from "@/context/ComparisonContext";
import { useNavigate } from "react-router-dom";

interface MotorcycleDetailCTAProps {
  motorcycle: Motorcycle;
}

export function MotorcycleDetailCTA({ motorcycle }: MotorcycleDetailCTAProps) {
  const { addToComparison, isInComparison } = useComparison();
  const navigate = useNavigate();
  
  const handleAddToComparison = () => {
    if (isInComparison(motorcycle.id)) {
      toast.info("Already in comparison", {
        description: `${motorcycle.make} ${motorcycle.model} is already in your comparison list`
      });
      return;
    }
    
    addToComparison(motorcycle);
    toast.success("Added to comparison", {
      description: `${motorcycle.make} ${motorcycle.model} added to your comparison list`,
      action: {
        label: "View Comparison",
        onClick: () => navigate("/compare")
      }
    });
  };
  
  const handleSaveBike = () => {
    toast.success("Motorcycle saved", {
      description: `${motorcycle.make} ${motorcycle.model} has been saved to your collection`
    });
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied", {
      description: "Motorcycle page link copied to clipboard"
    });
  };
  
  return (
    <div className="flex items-center justify-between gap-3 py-2 px-1 sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/30">
      <div className="flex items-center gap-3">
        <Button variant="teal" size="sm" onClick={handleSaveBike} className="text-xs">
          <BookmarkPlus className="h-3.5 w-3.5 mr-1" />
          Save this Bike
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleShare} className="text-xs">
          <Share2 className="h-3.5 w-3.5 mr-1" />
          Share
        </Button>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleAddToComparison}
        className={`text-xs ${isInComparison(motorcycle.id) ? 'border-primary text-primary' : ''}`}
      >
        <Scale className="h-3.5 w-3.5 mr-1" />
        {isInComparison(motorcycle.id) ? 'In Comparison' : 'Add to Compare'}
      </Button>
    </div>
  );
}
