
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type CarouselApi } from "@/components/ui/carousel";

interface CarouselIndicatorsProps {
  images: any[];
  currentIndex: number;
  api: CarouselApi | undefined;
  onIndexChange: (index: number) => void;
}

export function CarouselIndicators({ 
  images, 
  currentIndex, 
  api, 
  onIndexChange 
}: CarouselIndicatorsProps) {
  if (images.length <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-2">
      {images.map((_, index) => (
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
              onIndexChange(index);
            }
          }}
        />
      ))}
    </div>
  );
}
