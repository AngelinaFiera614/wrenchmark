
import { Button } from "@/components/ui/button";
import { GitCompareArrows, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedCardImageProps {
  imageUrl?: string;
  make: string;
  model: string;
  year: number;
  category?: string;
  isSelected: boolean;
  onCompareToggle: (e: React.MouseEvent) => void;
}

export function EnhancedCardImage({
  imageUrl,
  make,
  model,
  year,
  category,
  isSelected,
  onCompareToggle
}: EnhancedCardImageProps) {
  const getFallbackImage = () => {
    if (!category) return "https://images.unsplash.com/photo-1601517491080-28095259a0da";
    
    switch (category.toLowerCase()) {
      case "sport":
        return "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87";
      case "adventure":
        return "https://images.unsplash.com/photo-1575229020746-0e86406d1cd4";
      case "cruiser":
        return "https://images.unsplash.com/photo-1609630875171-b1321377ee65";
      default:
        return "https://images.unsplash.com/photo-1601517491080-28095259a0da";
    }
  };

  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-t-3xl">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${make} ${model}`}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `${getFallbackImage()}?w=800&auto=format&fit=crop`;
          }}
        />
      ) : (
        <div className="w-full h-full glass-morphism flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-secondary-muted" />
        </div>
      )}
      
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
          {make} {model}
        </h3>
        <p className="text-sm text-white/80">{year}</p>
      </div>
      
      {/* Compare button with enhanced styling */}
      <Button 
        onClick={onCompareToggle}
        variant={isSelected ? "teal" : "outline"}
        size="sm"
        className={cn(
          "absolute top-4 right-4 z-10 backdrop-blur-md border-white/30",
          isSelected && "shadow-teal-glow"
        )}
      >
        <GitCompareArrows className="h-4 w-4 mr-1" />
        {isSelected ? "Remove" : "Compare"}
      </Button>
    </div>
  );
}
