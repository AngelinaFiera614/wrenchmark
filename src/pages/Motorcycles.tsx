
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MotorcycleFilters from "@/components/motorcycles/MotorcycleFilters";
import MotorcycleGrid from "@/components/motorcycles/MotorcycleGrid";
import { ComparisonIndicator } from "@/components/comparison/ComparisonIndicator";
import { useMotorcycleFilters, initialFilters } from "@/hooks/useMotorcycleFilters";
import { syncFiltersToUrl, parseFiltersFromUrl } from "@/lib/filter-utils";
import { useMotorcycleData } from "@/hooks/motorcycles/useMotorcycleData";
import { MotorcyclesErrorState } from "@/components/motorcycles/page/MotorcyclesErrorState";
import { MotorcyclesHeader } from "@/components/motorcycles/page/MotorcyclesHeader";
import { MotorcyclesDebugInfo } from "@/components/motorcycles/page/MotorcyclesDebugInfo";

export default function Motorcycles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    motorcycles,
    isLoading,
    error,
    dataQualityInfo,
    debugInfo,
    handleRetry
  } = useMotorcycleData();
  
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
  console.log("Data quality:", dataQualityInfo);

  // Sync filters to URL when they change
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    syncFiltersToUrl(filters, newParams);
    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  if (error) {
    return (
      <MotorcyclesErrorState
        error={error}
        dataQualityInfo={dataQualityInfo}
        debugInfo={debugInfo}
        onRetry={handleRetry}
      />
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
          <MotorcyclesHeader
            motorcycles={motorcycles}
            filteredMotorcycles={filteredMotorcycles}
            filters={filters}
            isLoading={isLoading}
            isFiltering={isFiltering}
            dataQualityInfo={dataQualityInfo}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
            onResetFilters={resetFilters}
          />

          <MotorcycleGrid 
            motorcycles={filteredMotorcycles} 
            isLoading={isLoading}
          />
          
          <MotorcyclesDebugInfo debugInfo={debugInfo} />
        </div>
      </div>
      
      <ComparisonIndicator />
    </div>
  );
}
