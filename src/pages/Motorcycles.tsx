
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MotorcycleFilters from "@/components/motorcycles/MotorcycleFilters";
import MotorcycleGrid from "@/components/motorcycles/MotorcycleGrid";
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
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    handleSearchChange(searchTerm);
  };

  const clearSearch = () => {
    handleSearchChange("");
  };

  return (
    <div className="flex-1 min-h-screen bg-gradient-dark">
      <div className="container px-4 md:px-6 py-8 grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-8">
        {/* Sidebar with filters */}
        <aside className="w-full">
          <div className="glass-morphism rounded-2xl p-6 border border-white/10 backdrop-blur-md sticky top-8">
            <MotorcycleFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </aside>

        {/* Main content */}
        <div className="space-y-6">
          <div className="flex flex-col gap-6">
            <div className="glass-morphism rounded-2xl p-6 border border-white/10 backdrop-blur-md">
              <h1 className="text-4xl font-bold text-white mb-6">Motorcycles</h1>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-secondary-muted" />
                  <Input
                    type="search"
                    placeholder="Search motorcycles..."
                    className="pl-10 pr-12 h-12 text-lg"
                    value={filters.searchTerm}
                    onChange={handleSearch}
                  />
                  {filters.searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-white/10"
                      onClick={clearSearch}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="glass-morphism px-4 py-3 rounded-lg border border-white/10">
                  <span className="text-sm text-secondary-muted">
                    {filteredMotorcycles.length} {filteredMotorcycles.length === 1 ? 'result' : 'results'}
                    {isFiltering && ' (filtered)'}
                  </span>
                </div>
              </div>
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
