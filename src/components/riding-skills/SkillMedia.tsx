
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { AlertCircle } from "lucide-react";

interface SkillMediaProps {
  videoUrl?: string | null;
  imageUrl?: string | null;
  title: string;
  category?: string;
}

const SkillMedia: React.FC<SkillMediaProps> = ({ videoUrl, imageUrl, title, category }) => {
  if (!videoUrl && !imageUrl) {
    return (
      <div className="mb-8 rounded-lg overflow-hidden">
        <AspectRatio ratio={16/9} className="bg-muted/20">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No media available</p>
          </div>
        </AspectRatio>
      </div>
    );
  }
  
  // Choose fallback image based on category if available
  const getFallbackImage = () => {
    if (!category) return "https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800&auto=format&fit=crop";
    
    switch (category.toLowerCase()) {
      case "cornering":
        return "https://images.unsplash.com/photo-1626813777239-8edb958d4712?w=800&auto=format&fit=crop";
      case "braking":
        return "https://images.unsplash.com/photo-1636638986875-115bc91478a1?w=800&auto=format&fit=crop";
      case "balance":
        return "https://images.unsplash.com/photo-1614200484106-6d2ea85267ef?w=800&auto=format&fit=crop";
      default:
        return "https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800&auto=format&fit=crop";
    }
  };
  
  return (
    <div className="mb-8 rounded-lg overflow-hidden">
      {videoUrl ? (
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            width="100%"
            height="400"
            src={videoUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="border-0 rounded-lg"
          ></iframe>
        </div>
      ) : (
        <AspectRatio ratio={16/9} className="bg-muted/10">
          <img 
            src={imageUrl || getFallbackImage()}
            alt={title}
            className="rounded-lg w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              // Use category-based fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = getFallbackImage();
            }}
          />
        </AspectRatio>
      )}
    </div>
  );
};

export default SkillMedia;
