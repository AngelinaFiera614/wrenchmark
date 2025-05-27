
import { useState, useEffect } from "react";
import { imageManagementService, MotorcycleImage } from "@/services/imageManagementService";

interface CombinedImageData {
  url: string;
  alt: string;
  isPrimary: boolean;
  isFeatured: boolean;
  angle?: string;
  color?: string;
}

interface UseCarouselImagesProps {
  motorcycleId: string;
  fallbackImages?: string[];
  alt: string;
  category?: string;
}

export function useCarouselImages({ 
  motorcycleId, 
  fallbackImages = [], 
  alt, 
  category 
}: UseCarouselImagesProps) {
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
  const allImages: CombinedImageData[] = [
    ...images.map(img => ({
      url: img.file_url,
      alt: img.alt_text || `${alt} - ${img.angle || 'view'}`,
      isPrimary: img.is_primary || false,
      isFeatured: img.is_featured || false,
      angle: img.angle,
      color: img.color
    })),
    ...fallbackImages.map((url, index) => ({
      url,
      alt: `${alt} - view ${index + 1}`,
      isPrimary: false,
      isFeatured: false,
      angle: undefined,
      color: undefined
    }))
  ];

  return {
    images: allImages,
    isLoading,
    getFallbackImage
  };
}
