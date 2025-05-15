
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { brands } from "@/data/brands";
import { motorcyclesData } from "@/data/motorcycles";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import MotorcycleGrid from "@/components/motorcycles/MotorcycleGrid";

export default function BrandDetail() {
  const { brandId } = useParams<{ brandId: string }>();
  const navigate = useNavigate();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Find brand data
  const brand = brands.find((b) => b.id === brandId);
  
  // Filter motorcycles related to this brand
  const brandMotorcycles = motorcyclesData.filter(
    (motorcycle) => motorcycle.make.toLowerCase() === brand?.name.toLowerCase()
  );
  
  // Further filter by selected tag if any
  const filteredMotorcycles = selectedTag 
    ? brandMotorcycles.filter(m => 
        m.category.toLowerCase() === selectedTag.toLowerCase() || 
        m.style_tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      )
    : brandMotorcycles;
  
  if (!brand) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Brand Not Found</h1>
          <p className="text-muted-foreground mb-6">The brand you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/brands")}>
            Return to Brand Directory
          </Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Brand header */}
        <div className="bg-layer-bg py-12">
          <div className="container px-4 md:px-6">
            <Link to="/brands">
              <Button variant="outline" size="sm" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Directory
              </Button>
            </Link>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-full md:w-1/4 lg:w-1/5">
                <div className="bg-secondary/50 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} logo`} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {brand.name}
                </h1>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Country of Origin</p>
                    <p className="text-lg font-medium text-foreground">{brand.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Founded</p>
                    <p className="text-lg font-medium text-foreground">{brand.founded}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Models</p>
                    <p className="text-lg font-medium text-foreground">{brandMotorcycles.length}</p>
                  </div>
                </div>
                
                <p className="text-foreground mb-6">{brand.description}</p>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Known For:</h3>
                  <div className="flex flex-wrap gap-2">
                    {brand.knownFor.map((tag) => (
                      <Badge 
                        key={tag}
                        variant={selectedTag === tag ? "default" : "outline"}
                        className={`cursor-pointer ${selectedTag === tag ? 'bg-accent-teal text-black' : 'hover:bg-secondary'}`}
                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                    {selectedTag && (
                      <Badge 
                        variant="outline"
                        className="cursor-pointer bg-destructive/20 hover:bg-destructive/40"
                        onClick={() => setSelectedTag(null)}
                      >
                        Clear Filter
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Motorcycles section */}
        <div className="container px-4 md:px-6 py-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {selectedTag ? `${brand.name} ${selectedTag} Motorcycles` : `${brand.name} Motorcycles`}
            <span className="ml-2 text-lg font-normal text-muted-foreground">
              ({filteredMotorcycles.length})
            </span>
          </h2>
          
          {filteredMotorcycles.length > 0 ? (
            <MotorcycleGrid motorcycles={filteredMotorcycles} />
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No motorcycles found{selectedTag ? ` matching the "${selectedTag}" category` : ""}.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
