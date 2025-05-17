
import { useState, useEffect } from "react";
import BrandCard from "@/components/brands/BrandCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getAllBrands } from "@/services/brandService";
import { Brand } from "@/types";
import { toast } from "sonner";

export default function BrandsDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch brands from Supabase
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setIsLoading(true);
        const data = await getAllBrands();
        setBrands(data);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
        toast.error("Failed to load brands data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []);
  
  // Filter brands based on search term
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.known_for.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <main className="flex-1 container px-4 md:px-6 py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Motorcycle Brand Directory</h1>
        <p className="text-muted-foreground">Discover the legacy and offerings of leading motorcycle manufacturers.</p>
        
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search brands, countries, or styles..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-10 w-10 border-4 border-t-accent-teal border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBrands.map((brand) => (
            <BrandCard 
              key={brand.id} 
              brand={{
                ...brand,
                logo: brand.logo_url || brand.logo || '',
                knownFor: brand.known_for || brand.knownFor || [],
                description: brand.description || `Founded in ${brand.founded} in ${brand.country}`
              }} 
            />
          ))}
        </div>
      )}
      
      {!isLoading && filteredBrands.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No brands found matching your search criteria.</p>
        </div>
      )}
    </main>
  );
}
