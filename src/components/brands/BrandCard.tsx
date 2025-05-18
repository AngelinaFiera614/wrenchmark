
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Brand } from "@/types";
import { useMobile } from "@/hooks/use-mobile";

interface BrandCardProps {
  brand: Brand;
}

export default function BrandCard({ brand }: BrandCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isMobile = useMobile();
  
  // Directly use the properties from the Brand interface without optional chaining
  const logo = brand.logo;
  const knownFor = brand.knownFor;
  const brandSlug = brand.slug || ''; // Use slug instead of ID for routing

  // Get fallback image based on brand name or country
  const getFallbackImage = () => {
    const brandNameLower = brand.name.toLowerCase();
    
    if (brandNameLower.includes('honda')) {
      return "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop";
    } else if (brandNameLower.includes('yamaha')) {
      return "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=800&auto=format&fit=crop";
    } else if (brandNameLower.includes('ducati')) {
      return "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop";
    } else if (brandNameLower.includes('kawasaki')) {
      return "https://images.unsplash.com/photo-1539826233524-c9eb499d1d31?w=800&auto=format&fit=crop";
    } else {
      return "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&auto=format&fit=crop";
    }
  };

  return (
    <Card 
      className="overflow-hidden hover:border-accent-teal transition-all duration-300 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-0">
        <div className="mb-2 w-full">
          <AspectRatio ratio={isMobile ? 16/9 : 1/1} className="bg-secondary/50 rounded-md overflow-hidden">
            {(logo && !imageError) ? (
              <img
                src={logo}
                alt={`${brand.name} logo`}
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
                style={{
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={getFallbackImage()}
                  alt={`${brand.name}`}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
                  style={{
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <p className="text-2xl font-bold text-white">{brand.name}</p>
                </div>
              </div>
            )}
          </AspectRatio>
        </div>
        <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-foreground`}>{brand.name}</h3>
      </CardHeader>
      
      <CardContent className="py-4">
        <div className="space-y-2 text-foreground">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Country:</span>
            <span>{brand.country}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Founded:</span>
            <span>{brand.founded}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {knownFor.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-secondary text-foreground">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 mt-auto">
        <Link to={`/brands/${brandSlug}`} className="w-full">
          <Button 
            variant="teal"
            className="w-full justify-between"
          >
            {isMobile ? "Details" : "View Details"}
            <ArrowRight size={18} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
