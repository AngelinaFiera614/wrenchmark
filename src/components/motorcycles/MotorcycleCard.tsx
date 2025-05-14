
import { Link } from "react-router-dom";
import { Motorcycle } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    summary
  } = motorcycle;

  const difficultyColor = `difficulty-${difficulty_level}`;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/motorcycle/${id}`}>
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={image_url}
            alt={`${make} ${model}`}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-lg font-bold text-white">{make} {model}</h3>
            <p className="text-sm text-white/80">{year}</p>
          </div>
        </div>
        
        <CardContent className="grid gap-2 p-4">
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="bg-secondary/50">
              {category}
            </Badge>
            {style_tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-secondary/20">
                {tag}
              </Badge>
            ))}
            {style_tags.length > 2 && (
              <Badge variant="secondary" className="bg-secondary/20">
                +{style_tags.length - 2}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm my-2">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs">Engine</span>
              <span className="font-mono">{engine_cc} cc</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs">Power</span>
              <span className="font-mono">{horsepower_hp} hp</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs">Top Speed</span>
              <span className="font-mono">{top_speed_kph} km/h</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs">Seat Height</span>
              <span className="font-mono">{seat_height_mm} mm</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs">Weight</span>
              <span className="font-mono">{weight_kg} kg</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs">ABS</span>
              {abs ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{summary}</p>
        </CardContent>

        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Difficulty:</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-5 mx-0.5 rounded-sm ${
                          i < difficulty_level ? difficultyColor : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Difficulty level: {difficulty_level}/5</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
