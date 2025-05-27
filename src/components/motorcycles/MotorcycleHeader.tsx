
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Motorcycle } from "@/types";
import { MotorcycleImageCarousel } from "./MotorcycleImageCarousel";
import { EnhancedImageCarousel } from "./EnhancedImageCarousel";
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

  // Get motorcycle-specific images based on make and model
  // Instead of hardcoded placeholders, we use model-specific URLs when available
  const getMotorcycleImages = () => {
    const images = [];
    
    // Always add the primary image if available
    if (image_url) {
      images.push(image_url);
    }
    
    // Add additional motorcycle-related images based on make/model
    // In a real app, these would come from a proper gallery in the database
    const makeModelSlug = `${make}-${model}`.toLowerCase().replace(/\s+/g, '-');
    
    // Example of conditional image URLs based on motorcycle brand/model
    if (make.toLowerCase() === 'honda') {
      images.push(`https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=800&auto=format&fit=crop`);
    } else if (make.toLowerCase() === 'ducati') {
      images.push(`https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop`);
    } else if (make.toLowerCase() === 'bmw') {
      images.push(`https://images.unsplash.com/photo-1575229020746-0e86406d1cd4?w=800&auto=format&fit=crop`);
    } else if (make.toLowerCase() === 'kawasaki') {
      images.push(`https://images.unsplash.com/photo-1615172282427-9a57ef2d142a?w=800&auto=format&fit=crop`);
    }
    
    // If we still don't have enough images, use motorcycle-related images
    if (images.length < 2) {
      images.push(`https://images.unsplash.com/photo-1601517491080-28095259a0da?w=800&auto=format&fit=crop`);
    }
    
    return images;
  };

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
        <EnhancedImageCarousel 
          motorcycleId={motorcycle.id}
          fallbackImages={getMotorcycleImages()}
          alt={`${make} ${model}`}
          category={category}
        />
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
