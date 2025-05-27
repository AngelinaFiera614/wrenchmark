
import { useState, useEffect } from "react";
import { ImageIcon, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { imageManagementService, MotorcycleImage } from "@/services/imageManagementService";

interface EnhancedImageCarouselProps {
  motorcycleId: string;
  fallbackImages?: string[];
  alt: string;
  category?: string;
}

export function EnhancedImageCarousel({ 
  motorcycleId, 
  fallbackImages = [], 
  alt, 
  category 
}: EnhancedImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [images, setImages] = useState<MotorcycleImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      const motorcycleImages = await imageManagementService.getMotorcycleImages(motorcycleId);
      setImages(motorcycleImages);
      setIsLoading(false);
    };

    loadImages();
  }, [motorcycleId]);
  
  // Get category-specific fallback image
  const getFallbackImage = () => {
    if (!category) return "https://images.unsplash.com/photo-1601517491080-28095259a0da?w=800&auto=format&fit=crop";
    
    switch (category.toLowerCase()) {
      case "sport":
        return "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop";
      case "adventure":
        return "https://images.unsplash.com/photo-1575229020746-0e86406d1cd4?w=800&auto=format&fit=crop";
      case "cruiser":
        return "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&auto=format&fit=crop";
      case "touring":
        return "https://images.unsplash.com/photo-1541795795328-f073b763494e?w=800&auto=format&fit=crop";
      case "naked":
        return "https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800&auto=format&fit=crop";
      default:
        return "https://images.unsplash.com/photo-1601517491080-28095259a0da?w=800&auto=format&fit=crop";
    }
  };

  // Combine managed images with fallback images
  const allImages = [
    ...images.map(img => ({
      url: img.file_url,
      alt: img.alt_text || `${alt} - ${img.angle || 'view'}`,
      isPrimary: img.is_primary,
      isFeatured: img.is_featured,
      angle: img.angle,
      color: img.color
    })),
    ...fallbackImages.map((url, index) => ({
      url,
      alt: `${alt} - view ${index + 1}`,
      isPrimary: false,
      isFeatured: false
    }))
  ];

  // If no images at all, show fallback
  if (isLoading) {
    return (
      <AspectRatio ratio={4/3} className="bg-muted/20 rounded-lg">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="h-8 w-8 border-4 border-t-accent-teal border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground mt-2">Loading images...</p>
        </div>
      </AspectRatio>
    );
  }

  if (allImages.length === 0) {
    return (
      <AspectRatio ratio={4/3} className="bg-muted/20 rounded-lg">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <img 
            src={getFallbackImage()} 
            alt={alt}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
          />
        </div>
      </AspectRatio>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      <Carousel
        className="w-full"
        setApi={setApi}
        onSelect={() => {
          if (api) setCurrentIndex(api.selectedScrollSnap());
        }}
      >
        <CarouselContent>
          {allImages.map((image, index) => (
            <CarouselItem key={index}>
              <AspectRatio ratio={4/3} className="bg-muted/20 relative">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    // Replace with category-specific fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = getFallbackImage();
                  }}
                />
                
                {/* Image badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {image.isPrimary && (
                    <Badge className="bg-accent-teal text-black">
                      <Star className="h-3 w-3 mr-1" />
                      Primary
                    </Badge>
                  )}
                  {image.isFeatured && (
                    <Badge className="bg-yellow-500 text-black">
                      Featured
                    </Badge>
                  )}
                  {image.angle && (
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      {image.angle}
                    </Badge>
                  )}
                </div>

                {/* Color badge */}
                {image.color && (
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="outline" className="bg-white/80 text-black">
                      {image.color}
                    </Badge>
                  </div>
                )}
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="absolute top-0 left-0 right-0 px-4 pt-4 flex justify-end">
          <span className="bg-black/50 text-white px-2 py-1 rounded-md text-sm">
            {currentIndex + 1} / {allImages.length}
          </span>
        </div>
        
        {allImages.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </>
        )}
      </Carousel>
      
      {allImages.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {allImages.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={cn(
                "w-2 h-2 rounded-full p-0",
                index === currentIndex ? "bg-primary" : "bg-muted"
              )}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => {
                if (api) {
                  api.scrollTo(index);
                  setCurrentIndex(index);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
