
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Motorcycle } from "@/types";
import { MotorcycleImageCarousel } from "./MotorcycleImageCarousel";
import { useComparison } from "@/context/ComparisonContext";
import { useNavigate } from "react-router-dom";

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
  
  const { addToComparison, isInComparison } = useComparison();
  const navigate = useNavigate();

  // Create an array of images from the single image_url
  // In a real app, this would come from the API with multiple images
  const images = [
    image_url,
    `https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop`,
    `https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop`,
  ];

  const difficultyColor = `difficulty-${difficulty_level}`;

  const handleSaveBike = () => {
    toast.success("Motorcycle saved", {
      description: `${make} ${model} has been saved to your collection`
    });
  };

  const handleCompare = () => {
    if (isInComparison(motorcycle.id)) {
      toast.info("Already in comparison", {
        description: `${make} ${model} is already in your comparison list`
      });
      return;
    }
    
    addToComparison(motorcycle);
    toast.success("Added to comparison", {
      description: `${make} ${model} added to your comparison list`,
      action: {
        label: "View Comparison",
        onClick: () => navigate("/compare")
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="overflow-hidden border border-border/30 bg-card/50 backdrop-blur-sm rounded-lg">
        <MotorcycleImageCarousel images={images} alt={`${make} ${model}`} />
      </div>
      
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
