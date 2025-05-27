
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CarouselFallbackProps {
  fallbackImage: string;
  alt: string;
}

export function CarouselFallback({ fallbackImage, alt }: CarouselFallbackProps) {
  return (
    <AspectRatio ratio={4/3} className="bg-muted/20 rounded-lg">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <img 
          src={fallbackImage} 
          alt={alt}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
        />
      </div>
    </AspectRatio>
  );
}
