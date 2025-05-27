
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function CarouselLoadingState() {
  return (
    <AspectRatio ratio={4/3} className="bg-muted/20 rounded-lg">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="h-8 w-8 border-4 border-t-accent-teal border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground mt-2">Loading images...</p>
      </div>
    </AspectRatio>
  );
}
