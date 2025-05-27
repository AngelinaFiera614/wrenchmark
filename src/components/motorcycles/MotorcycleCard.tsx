
import { Link } from "react-router-dom";
import { Motorcycle } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Info, GitCompareArrows, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useComparison } from "@/context/ComparisonContext";
import { cn } from "@/lib/utils";

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
}

export default function MotorcycleCard({ motorcycle }: MotorcycleCardProps) {
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
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-teal-glow hover:scale-105 hover:border-primary/40 group",
      isSelected && "ring-2 ring-primary shadow-teal-glow"
    )}>
      <Link to={motorcycleUrl}>
        <div className="relative aspect-[16/9] overflow-hidden">
          {image_url ? (
            <img
              src={image_url}
              alt={`${make} ${model}`}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
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
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
            <h3 className="text-lg font-bold text-white mb-1">{make} {model}</h3>
            <p className="text-sm text-white/80">{year}</p>
          </div>
          <Button 
            onClick={handleCompareToggle}
            variant={isSelected ? "teal" : "outline"}
            size="sm"
            className={cn(
              "absolute top-3 right-3 z-10 backdrop-blur-md",
              isSelected && "shadow-teal-glow"
            )}
          >
            <GitCompareArrows className="h-4 w-4 mr-1" />
            {isSelected ? "Remove" : "Compare"}
          </Button>
        </div>
        
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="teal" className="text-xs">
              {category || "Standard"}
            </Badge>
            {style_tags && style_tags.length > 0 ? (
              <>
                {style_tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {style_tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{style_tags.length - 2}
                  </Badge>
                )}
              </>
            ) : (
              <Badge variant="secondary" className="text-xs">
                General
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="glass-morphism p-2 rounded-lg text-center">
              <span className="text-secondary-muted text-xs block mb-1">Engine</span>
              <span className="font-mono text-white font-medium">{formatEngineSize()}</span>
            </div>
            <div className="glass-morphism p-2 rounded-lg text-center">
              <span className="text-secondary-muted text-xs block mb-1">Power</span>
              <span className="font-mono text-white font-medium">{formatHorsepower()}</span>
            </div>
            <div className="glass-morphism p-2 rounded-lg text-center">
              <span className="text-secondary-muted text-xs block mb-1">Speed</span>
              <span className="font-mono text-white font-medium">{formatSpeed()}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="glass-morphism p-2 rounded-lg text-center">
              <span className="text-secondary-muted text-xs block mb-1">Seat</span>
              <span className="font-mono text-white font-medium">{formatSeatHeight()}</span>
            </div>
            <div className="glass-morphism p-2 rounded-lg text-center">
              <span className="text-secondary-muted text-xs block mb-1">Weight</span>
              <span className="font-mono text-white font-medium">{formatWeight()}</span>
            </div>
            <div className="glass-morphism p-2 rounded-lg text-center flex flex-col items-center">
              <span className="text-secondary-muted text-xs block mb-1">ABS</span>
              {abs ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <span className="text-secondary-muted">—</span>
              )}
            </div>
          </div>

          <p className="text-sm text-secondary-muted line-clamp-2 leading-relaxed">{summary || `${make} ${model} ${year}`}</p>
        </CardContent>

        <CardFooter className="flex items-center justify-between p-5 pt-0">
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
          
          <div>
            <Info className="h-4 w-4 text-secondary-muted" />
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
