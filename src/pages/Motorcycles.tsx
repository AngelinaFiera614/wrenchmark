import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MotorcycleFilters from "@/components/motorcycles/MotorcycleFilters";
import MotorcycleGrid from "@/components/motorcycles/MotorcycleGrid";
import SmartSearchBar from "@/components/motorcycles/filters/SmartSearchBar";
import SmartRecommendations from "@/components/motorcycles/SmartRecommendations";
import { useMotorcycleFilters, initialFilters } from "@/hooks/useMotorcycleFilters";
import { syncFiltersToUrl, parseFiltersFromUrl } from "@/lib/filter-utils";
import { Button } from "@/components/ui/button";
import { X, Sparkles, RefreshCw } from "lucide-react";
import { ComparisonIndicator } from "@/components/comparison/ComparisonIndicator";
import { getAllMotorcycles } from "@/services/motorcycleService";
import { Motorcycle } from "@/types";
import { toast } from "sonner";

export default function Motorcycles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  
  // Fetch motorcycles from Supabase
  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("=== MOTORCYCLES PAGE: Starting motorcycle fetch ===");
        
        const data = await getAllMotorcycles();
        console.log("=== MOTORCYCLES PAGE: Motorcycles fetched ===", data.length, "motorcycles");
        console.log("=== MOTORCYCLES PAGE: Sample motorcycle ===", data[0]);
        setMotorcycles(data);
        
        if (data.length === 0) {
          console.log("=== MOTORCYCLES PAGE: No motorcycles found ===");
          toast.info("No published motorcycles found. Some sample data may have been published for testing.");
        } else {
          console.log("=== MOTORCYCLES PAGE: Success ===");
          toast.success(`Loaded ${data.length} motorcycles successfully`);
        }
      } catch (error) {
        console.error("=== MOTORCYCLES PAGE: ERROR ===", error);
        setError(`Failed to load motorcycles data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        toast.error("Failed to load motorcycles data");
      } finally {
        setIsLoading(false);
        console.log("=== MOTORCYCLES PAGE: Fetch complete ===");
      }
    };

    fetchMotorcycles();
  }, [retryCount]);
  
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

  console.log("=== MOTORCYCLES PAGE: Current State ===");
  console.log("Motorcycles in state:", motorcycles.length);
  console.log("Filtered motorcycles:", filteredMotorcycles.length);
  console.log("Is loading:", isLoading);
  console.log("Error:", error);

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

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
  };

  if (error) {
    return (
      <div className="flex-1">
        <div className="container px-4 md:px-6 py-8">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Error Loading Motorcycles</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="space-y-3">
              <Button onClick={handleRetry} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
                Refresh Page
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              If this problem persists, there may be an issue with the database connection or motorcycle data setup.
            </p>
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
                {isLoading ? (
                  "Loading motorcycles..."
                ) : (
                  <>
                    {filteredMotorcycles.length} {filteredMotorcycles.length === 1 ? 'result' : 'results'}
                    {isFiltering && ' (filtered)'}
                    {motorcycles.length > 0 && ` of ${motorcycles.length} total`}
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {!isLoading && motorcycles.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRecommendations(!showRecommendations)}
                    className="text-xs"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {showRecommendations ? 'Hide' : 'Show'} Recommendations
                  </Button>
                )}
                
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
          </div>

          {/* Smart Recommendations */}
          {showRecommendations && !isLoading && motorcycles.length > 0 && (
            <SmartRecommendations
              motorcycles={motorcycles}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          )}

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
