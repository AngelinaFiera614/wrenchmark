
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motorcyclesData } from "@/data/motorcycles";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MotorcycleFilters from "@/components/motorcycles/MotorcycleFilters";
import MotorcycleGrid from "@/components/motorcycles/MotorcycleGrid";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useMotorcycleFilters, initialFilters } from "@/hooks/useMotorcycleFilters";
import { syncFiltersToUrl, parseFiltersFromUrl } from "@/lib/filter-utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ComparisonIndicator } from "@/components/comparison/ComparisonIndicator";

export default function Motorcycles() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize filters from URL if available
  const parsedFilters = parseFiltersFromUrl(searchParams, initialFilters);
  
  const {
    filters,
    handleFilterChange,
    handleSearchChange,
    resetFilters,
    filteredMotorcycles,
    isFiltering
  } = useMotorcycleFilters(motorcyclesData, parsedFilters);

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
    <div className="min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1">
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
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search motorcycles..."
                    className="pl-8 pr-10"
                    value={filters.searchTerm}
                    onChange={handleSearch}
                  />
                  {filters.searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-5 w-5 p-0"
                      onClick={clearSearch}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {filteredMotorcycles.length} {filteredMotorcycles.length === 1 ? 'result' : 'results'}
                  {isFiltering && ' (filtered)'}
                </div>
              </div>
            </div>

            <MotorcycleGrid motorcycles={filteredMotorcycles} />
          </div>
        </div>
      </main>
      
      <Footer />
      <ComparisonIndicator />
    </div>
  );
}
