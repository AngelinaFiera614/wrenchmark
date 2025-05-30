
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MotorcycleFilters from "@/components/motorcycles/MotorcycleFilters";
import MotorcycleGrid from "@/components/motorcycles/MotorcycleGrid";
import SmartSearchBar from "@/components/motorcycles/filters/SmartSearchBar";
import { useMotorcycleFilters, initialFilters } from "@/hooks/useMotorcycleFilters";
import { syncFiltersToUrl, parseFiltersFromUrl } from "@/lib/filter-utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ComparisonIndicator } from "@/components/comparison/ComparisonIndicator";
import { getAllMotorcycles } from "@/services/motorcycleService";
import { Motorcycle } from "@/types";
import { toast } from "sonner";

export default function Motorcycles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch motorcycles from Supabase
  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Starting motorcycle fetch...");
        
        const data = await getAllMotorcycles();
        console.log("Motorcycles fetched successfully:", data);
        setMotorcycles(data);
      } catch (error) {
        console.error("Failed to load motorcycles:", error);
        setError("Failed to load motorcycles data");
        toast.error("Failed to load motorcycles data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMotorcycles();
  }, []);
  
  // Initialize filters from URL if available
  const parsedFilters = parseFiltersFromUrl(searchParams, initialFilters);
  
  const {
    filters,
    handleFilterChange,
    handleSearchChange,
    resetFilters,
    filteredMotorcycles,
    isFiltering
  } = useMotorcycleFilters(motorcycles, parsedFilters);

  // Sync filters to URL when they change
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    syncFiltersToUrl(filters, newParams);
    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  // Update search when user types and sync with URL params
  const handleSearch = (searchTerm: string) => {
    handleSearchChange(searchTerm);
  };

  if (error) {
    return (
      <div className="flex-1">
        <div className="container px-4 md:px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading Motorcycles</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="container px-4 md:px-6 py-8 grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-10">
        {/* Sidebar with filters */}
        <aside className="w-full">
          <MotorcycleFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </aside>

        {/* Main content */}
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Motorcycles</h1>
            
            {/* Enhanced Search Bar */}
            <SmartSearchBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
              placeholder="Search by make, model, or features..."
            />
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {filteredMotorcycles.length} {filteredMotorcycles.length === 1 ? 'result' : 'results'}
                {isFiltering && ' (filtered)'}
              </div>
              
              {isFiltering && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear all filters
                </Button>
              )}
            </div>
          </div>

          <MotorcycleGrid 
            motorcycles={filteredMotorcycles} 
            isLoading={isLoading}
          />
        </div>
      </div>
      
      <ComparisonIndicator />
    </div>
  );
}
