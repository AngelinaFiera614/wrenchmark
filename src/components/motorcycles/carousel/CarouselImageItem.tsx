
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star } from "lucide-react";

interface CarouselImageItemProps {
  url: string;
  alt: string;
  isPrimary: boolean;
  isFeatured: boolean;
  angle?: string;
  color?: string;
  fallbackImage: string;
}

export function CarouselImageItem({
  url,
  alt,
  isPrimary,
  isFeatured,
  angle,
  color,
  fallbackImage
}: CarouselImageItemProps) {
  return (
    <AspectRatio ratio={4/3} className="bg-muted/20 relative">
      <img
        src={url}
        alt={alt}
        className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = fallbackImage;
        }}
      />
      
      {/* Image badges */}
      <div className="absolute top-2 left-2 flex gap-2">
        {isPrimary && (
          <Badge className="bg-accent-teal text-black">
            <Star className="h-3 w-3 mr-1" />
            Primary
          </Badge>
        )}
        {isFeatured && (
          <Badge className="bg-yellow-500 text-black">
            Featured
          </Badge>
        )}
        {angle && (
          <Badge variant="secondary" className="bg-black/50 text-white">
            {angle}
          </Badge>
        )}
      </div>

      {/* Color badge */}
      {color && (
        <div className="absolute bottom-2 left-2">
          <Badge variant="outline" className="bg-white/80 text-black">
            {color}
          </Badge>
        </div>
      )}
    </AspectRatio>
  );
}
