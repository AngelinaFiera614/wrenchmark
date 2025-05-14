
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Motorcycle } from "@/types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";

interface MotorcycleHeaderProps {
  motorcycle: Motorcycle;
}

export function MotorcycleHeader({ motorcycle }: MotorcycleHeaderProps) {
  const {
    make,
    model,
    year,
    category,
    style_tags,
    difficulty_level,
    image_url,
    summary
  } = motorcycle;

  const difficultyColor = `difficulty-${difficulty_level}`;

  const handleSaveBike = () => {
    toast({
      title: "Feature coming soon",
      description: "Saving bikes will be available in a future update.",
      duration: 3000,
    });
  };

  const handleCompare = () => {
    toast({
      title: "Feature coming soon",
      description: "Compare feature will be available in a future update.",
      duration: 3000,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="overflow-hidden border border-border/30 bg-card/50 backdrop-blur-sm">
        <AspectRatio ratio={4/3} className="bg-muted/20">
          <img
            src={image_url}
            alt={`${make} ${model}`}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
          />
        </AspectRatio>
      </Card>
      
      <div className="space-y-5">
        <div className="animate-in slide-in-from-right-5 duration-300 delay-150">
          <h1 className="text-3xl font-bold tracking-tight">{make} {model}</h1>
          <p className="text-xl text-muted-foreground">{year}</p>
        </div>

        <p className="text-lg animate-in slide-in-from-right-5 duration-300 delay-200">{summary}</p>

        <div className="flex flex-wrap gap-2 animate-in slide-in-from-right-5 duration-300 delay-250">
          <Badge variant="outline" className="bg-secondary/50 text-xs">
            {category}
          </Badge>
          {style_tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-secondary/20 text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="animate-in slide-in-from-right-5 duration-300 delay-300">
          <div className="flex items-center gap-2 py-2">
            <span className="text-sm text-muted-foreground">Difficulty:</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-6 mx-0.5 rounded-sm ${
                    i < difficulty_level ? difficultyColor : "bg-muted"
                  } transition-all hover:h-8`}
                />
              ))}
            </div>
            <span className="text-sm ml-2">{difficulty_level}/5</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-4 animate-in slide-in-from-right-5 duration-300 delay-350">
          <Button onClick={handleSaveBike} className="group">
            <span className="relative inline-block">Save this bike</span>
          </Button>
          <Button variant="outline" onClick={handleCompare}>
            Compare
          </Button>
        </div>
      </div>
    </div>
  );
}
