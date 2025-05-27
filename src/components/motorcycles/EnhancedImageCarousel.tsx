
import { useState } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { useCarouselImages } from "./carousel/useCarouselImages";
import { CarouselImageItem } from "./carousel/CarouselImageItem";
import { CarouselLoadingState } from "./carousel/CarouselLoadingState";
import { CarouselFallback } from "./carousel/CarouselFallback";
import { CarouselIndicators } from "./carousel/CarouselIndicators";

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
  
  const { images, isLoading, getFallbackImage } = useCarouselImages({
    motorcycleId,
    fallbackImages,
    alt,
    category
  });

  if (isLoading) {
    return <CarouselLoadingState />;
  }

  if (images.length === 0) {
    return <CarouselFallback fallbackImage={getFallbackImage()} alt={alt} />;
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
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <CarouselImageItem
                url={image.url}
                alt={image.alt}
                isPrimary={image.isPrimary}
                isFeatured={image.isFeatured}
                angle={image.angle}
                color={image.color}
                fallbackImage={getFallbackImage()}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="absolute top-0 left-0 right-0 px-4 pt-4 flex justify-end">
          <span className="bg-black/50 text-white px-2 py-1 rounded-md text-sm">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
        
        {images.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </>
        )}
      </Carousel>
      
      <CarouselIndicators
        images={images}
        currentIndex={currentIndex}
        api={api}
        onIndexChange={setCurrentIndex}
      />
    </div>
  );
}
