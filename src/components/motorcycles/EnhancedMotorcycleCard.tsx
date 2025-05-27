
import { Link } from "react-router-dom";
import { Motorcycle } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Info, GitCompareArrows, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useComparison } from "@/context/ComparisonContext";
import { cn } from "@/lib/utils";
import { PremiumCard, PremiumCardContent, PremiumCardFooter } from "@/components/ui/premium-card";

interface EnhancedMotorcycleCardProps {
  motorcycle: Motorcycle;
}

export default function EnhancedMotorcycleCard({ motorcycle }: EnhancedMotorcycleCardProps) {
  const {
    id,
    make,
    model,
    year,
    category,
    style_tags,
    engine_cc,
    horsepower_hp,
    top_speed_kph,
    seat_height_mm,
    weight_kg,
    difficulty_level,
    abs,
    image_url,
    summary,
    slug
  } = motorcycle;

  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const isSelected = isInComparison(id);

  const difficultyColor = `difficulty-${difficulty_level}`;
  
  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSelected) {
      removeFromComparison(id);
    } else {
      addToComparison(motorcycle);
    }
  };

  const formatEngineSize = () => engine_cc && engine_cc > 0 ? `${engine_cc} cc` : "N/A";
  const formatHorsepower = () => horsepower_hp && horsepower_hp > 0 ? `${horsepower_hp} hp` : "N/A";
  const formatSpeed = () => top_speed_kph && top_speed_kph > 0 ? `${top_speed_kph} km/h` : "N/A";
  const formatSeatHeight = () => seat_height_mm && seat_height_mm > 0 ? `${seat_height_mm} mm` : "N/A";
  const formatWeight = () => weight_kg && weight_kg > 0 ? `${weight_kg} kg` : "N/A";

  const motorcycleUrl = slug ? `/motorcycles/${slug}` : `/motorcycles/${id}`;

  return (
    <PremiumCard 
      variant={isSelected ? "featured" : "premium"}
      interactive
      glow={isSelected ? "strong" : "subtle"}
      className="h-full flex flex-col group"
    >
      <Link to={motorcycleUrl} className="flex-1 flex flex-col">
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-3xl">
          {image_url ? (
            <img
              src={image_url}
              alt={`${make} ${model}`}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                let fallbackUrl = "https://images.unsplash.com/photo-1601517491080-28095259a0da";
                
                if (category === "Sport") {
                  fallbackUrl = "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87";
                } else if (category === "Adventure") {
                  fallbackUrl = "https://images.unsplash.com/photo-1575229020746-0e86406d1cd4";
                } else if (category === "Cruiser") {
                  fallbackUrl = "https://images.unsplash.com/photo-1609630875171-b1321377ee65";
                }
                
                target.src = `${fallbackUrl}?w=800&auto=format&fit=crop`;
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
            onClick={handleCompareToggle}
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
        
        <PremiumCardContent className="flex-1 space-y-6">
          {/* Enhanced badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="teal" className="text-xs font-medium shadow-teal-glow/50">
              {category || "Standard"}
            </Badge>
            {style_tags && style_tags.length > 0 ? (
              <>
                {style_tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-white/10 border-white/20">
                    {tag}
                  </Badge>
                ))}
                {style_tags.length > 2 && (
                  <Badge variant="outline" className="text-xs border-white/30">
                    +{style_tags.length - 2}
                  </Badge>
                )}
              </>
            ) : (
              <Badge variant="secondary" className="text-xs bg-white/10 border-white/20">
                General
              </Badge>
            )}
          </div>

          {/* Enhanced specs grid */}
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

          <p className="text-sm text-secondary-muted line-clamp-2 leading-relaxed">
            {summary || `${make} ${model} ${year}`}
          </p>
        </PremiumCardContent>

        <PremiumCardFooter className="flex items-center justify-between">
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
                          i < difficulty_level ? difficultyColor : "bg-white/10"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="glass-morphism border-white/20">
                <p>Difficulty level: {difficulty_level}/5</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <Info className="h-4 w-4 text-secondary-muted" />
          </div>
        </PremiumCardFooter>
      </Link>
    </PremiumCard>
  );
}
