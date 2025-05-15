
import { useState } from "react";
import { brands } from "@/data/brands";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BrandCard from "@/components/brands/BrandCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function BrandsDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter brands based on search term
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.knownFor.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
        
        {filteredBrands.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No brands found matching your search criteria.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
