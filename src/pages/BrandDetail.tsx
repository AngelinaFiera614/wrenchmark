
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBrandBySlug } from "@/services/brandService";
import { getAllMotorcycles } from "@/services/motorcycleService";
import { Brand, Motorcycle } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import BrandDetailTabs from "@/components/brands/BrandDetailTabs";
import { Badge } from "@/components/ui/badge";
import { getBrandLogoUrl, getBrandFallbackImage } from "@/utils/brandLogoUtils";

export default function BrandDetail() {
  const { brandId } = useParams<{ brandId: string }>();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const fetchBrandData = async () => {
      if (!brandId) return;

      try {
        setIsLoading(true);
        console.log("Fetching brand data for slug:", brandId);
        
        // Fetch brand data using the slug
        const brandData = await getBrandBySlug(brandId);
        if (!brandData) {
          console.log("No brand found with slug:", brandId);
          toast.error("Brand not found");
          return;
        }
        
        console.log("Brand data fetched:", brandData);
        setBrand(brandData);
        document.title = `${brandData.name} | Wrenchmark`;
        
        // Fetch all motorcycles and filter by this brand
        const allMotorcycles = await getAllMotorcycles();
        console.log("All motorcycles fetched, filtering for brand ID:", brandData.id);
        const brandMotorcycles = allMotorcycles.filter(m => m.brand_id === brandData.id);
        console.log(`Found ${brandMotorcycles.length} motorcycles for this brand`);
        setMotorcycles(brandMotorcycles);
      } catch (error) {
        console.error("Error fetching brand data:", error);
        toast.error("Failed to load brand data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandData();
  }, [brandId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-t-accent-teal border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex-1 container py-12 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Brand Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The brand you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/brands">
            <Button variant="default">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Brands Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get the best logo URL with proper fallback handling
  const logoData = getBrandLogoUrl(brand.logo_url, brand.slug);
  
  const getDisplayLogo = () => {
    if (logoError) {
      return getBrandFallbackImage(brand.name);
    }
    return logoData.url;
  };

  const handleLogoError = () => {
    console.log("Logo failed to load, using fallback for:", brand.name);
    setLogoError(true);
  };

  return (
    <div className="flex-1">
      <div className="container px-4 md:px-6 py-8">
        <div className="mb-4">
          <Link to="/brands">
            <Button variant="ghost" className="pl-0 text-foreground hover:text-accent-teal hover:bg-background/5">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Brands Directory
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-start gap-8 mb-6">
          {/* Brand logo with improved error handling */}
          <div className="w-32 h-32 md:w-48 md:h-48 bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center p-4">
            <img 
              src={getDisplayLogo()} 
              alt={`${brand.name} logo`}
              className="w-full h-full object-contain transition-opacity duration-200"
              onError={handleLogoError}
              onLoad={() => console.log("Logo loaded successfully for:", brand.name)}
            />
          </div>
          
          {/* Brand details */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold">{brand.name}</h1>
              <p className="text-muted-foreground">Founded in {brand.founded} • {brand.country || 'Unknown location'}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {brand.known_for?.map((specialty, index) => (
                <Badge key={`${specialty}-${index}`} variant="outline" className="bg-muted/20">
                  {specialty}
                </Badge>
              ))}
            </div>
            
            <p className="text-muted-foreground">
              {brand.name} offers {motorcycles.length} {motorcycles.length === 1 ? 'model' : 'models'} in our database.
            </p>
          </div>
        </div>
        
        {/* Tabbed content */}
        <BrandDetailTabs brand={brand} motorcycles={motorcycles} />
      </div>
    </div>
  );
}
