
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

interface MotorcycleImageCarouselProps {
  images: string[];
  alt: string;
}

export function MotorcycleImageCarousel({ images, alt }: MotorcycleImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  
  // Handle case where no images are provided
  if (!images || images.length === 0) {
    return (
      <AspectRatio ratio={4/3} className="bg-muted/20 rounded-lg">
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-muted-foreground">No images available</p>
        </div>
      </AspectRatio>
    );
  }

  // Filter out any non-motorcycle images or broken URLs
  const validImages = images.filter(image => 
    image && 
    !image.includes("placeholder") && 
    image.includes("motorcycle") || 
    image.includes("bike") ||
    image.includes("honda") ||
    image.includes("yamaha") ||
    image.includes("ducati") ||
    image.includes("kawasaki")
  );

  // If no valid images remain, show a placeholder
  if (validImages.length === 0) {
    return (
      <AspectRatio ratio={4/3} className="bg-muted/20 rounded-lg">
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-muted-foreground">No motorcycle images available</p>
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
          {validImages.map((image, index) => (
            <CarouselItem key={index}>
              <AspectRatio ratio={4/3} className="bg-muted/20">
                <img
                  src={image}
                  alt={`${alt} - image ${index + 1}`}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="absolute top-0 left-0 right-0 px-4 pt-4 flex justify-end">
          <span className="bg-black/50 text-white px-2 py-1 rounded-md text-sm">
            {currentIndex + 1} / {validImages.length}
          </span>
        </div>
        
        {validImages.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </>
        )}
      </Carousel>
      
      {validImages.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {validImages.map((_, index) => (
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
