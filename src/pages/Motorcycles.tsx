
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MotorcycleFilters from "@/components/motorcycles/MotorcycleFilters";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useMotorcycleFilters, initialFilters } from "@/hooks/useMotorcycleFilters";
import { syncFiltersToUrl, parseFiltersFromUrl } from "@/lib/filter-utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ComparisonIndicator } from "@/components/comparison/ComparisonIndicator";
import { getAllMotorcycles } from "@/services/motorcycleService";
import { Motorcycle } from "@/types";
import { toast } from "sonner";
import EnhancedMotorcycleCard from "@/components/motorcycles/EnhancedMotorcycleCard";
import { PremiumCard, PremiumCardContent } from "@/components/ui/premium-card";
import { StatsCard } from "@/components/ui/stats-card";
import { Bike } from "lucide-react";

export default function Motorcycles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  
  // Fetch motorcycles from Supabase
  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        setIsLoading(true);
        const data = await getAllMotorcycles();
        setMotorcycles(data);
      } catch (error) {
        toast.error("Failed to load motorcycles data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMotorcycles();
  }, []);
  
  const parsedFilters = parseFiltersFromUrl(searchParams, initialFilters);
  
  const {
    filters,
    handleFilterChange,
    handleSearchChange,
    resetFilters,
    filteredMotorcycles,
    isFiltering
  } = useMotorcycleFilters(motorcycles, parsedFilters);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    syncFiltersToUrl(filters, newParams);
    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    handleSearchChange(searchTerm);
  };

  const clearSearch = () => {
    handleSearchChange("");
  };

  return (
    <div className="flex-1 min-h-screen bg-gradient-dark pt-20">
      <div className="container px-4 md:px-6 py-8 grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-8">
        {/* Enhanced sidebar with filters */}
        <aside className="w-full">
          <PremiumCard variant="premium" className="p-6 sticky top-28">
            <MotorcycleFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </PremiumCard>
        </aside>

        {/* Enhanced main content */}
        <div className="space-y-8">
          {/* Header section with stats */}
          <div className="space-y-6">
            <PremiumCard variant="premium" className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-br from-white via-white/90 to-secondary bg-clip-text text-transparent">
                    Motorcycles
                  </h1>
                  <p className="text-lg text-secondary-muted">
                    Explore our comprehensive database of motorcycles
                  </p>
                </div>
                
                <StatsCard
                  icon={Bike}
                  title="Total Models"
                  value={filteredMotorcycles.length}
                  description={isFiltering ? "Filtered results" : "Available motorcycles"}
                  variant="premium"
                  className="lg:w-64"
                />
              </div>
            </PremiumCard>

            {/* Enhanced search section */}
            <PremiumCard variant="premium" className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-secondary-muted" />
                  <Input
                    type="search"
                    placeholder="Search motorcycles..."
                    className="pl-12 pr-12 h-14 text-lg bg-white/5 border-white/20 focus:border-primary/50"
                    value={filters.searchTerm}
                    onChange={handleSearch}
                  />
                  {filters.searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-10 w-10 p-0 hover:bg-white/10 rounded-full"
                      onClick={clearSearch}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </PremiumCard>
          </div>

          {/* Enhanced motorcycle grid */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <PremiumCard key={i} className="h-96 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMotorcycles.map((motorcycle) => (
                  <EnhancedMotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
                ))}
              </div>
            )}
            
            {!isLoading && filteredMotorcycles.length === 0 && (
              <PremiumCard variant="premium" className="p-12 text-center">
                <h3 className="text-2xl font-semibold text-white mb-4">No motorcycles found</h3>
                <p className="text-secondary-muted mb-6">
                  Try adjusting your filters or search terms.
                </p>
                <Button onClick={resetFilters} variant="teal">
                  Clear All Filters
                </Button>
              </PremiumCard>
            )}
          </div>
        </div>
      </div>
      
      <ComparisonIndicator />
    </div>
  );
}
