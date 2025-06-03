
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, X, Info } from "lucide-react";
import SmartSearchBar from "@/components/motorcycles/filters/SmartSearchBar";
import SmartRecommendations from "@/components/motorcycles/SmartRecommendations";
import { Motorcycle, MotorcycleFilters } from "@/types";

interface MotorcyclesHeaderProps {
  motorcycles: Motorcycle[];
  filteredMotorcycles: Motorcycle[];
  filters: MotorcycleFilters;
  isLoading: boolean;
  isFiltering: boolean;
  dataQualityInfo?: any;
  onFilterChange: (filters: MotorcycleFilters) => void;
  onSearchChange: (term: string) => void;
  onResetFilters: () => void;
}

export function MotorcyclesHeader({
  motorcycles,
  filteredMotorcycles,
  filters,
  isLoading,
  isFiltering,
  dataQualityInfo,
  onFilterChange,
  onSearchChange,
  onResetFilters
}: MotorcyclesHeaderProps) {
  const [showRecommendations, setShowRecommendations] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Motorcycles</h1>
        
        {/* Data quality info for debugging */}
        {dataQualityInfo && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between text-sm">
                <span>
                  Data Status: {dataQualityInfo.withEngine}/{dataQualityInfo.total} have engine specs,
                  {dataQualityInfo.withComponentData}/{dataQualityInfo.total} have component data
                </span>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Enhanced Search Bar */}
        <SmartSearchBar
          filters={filters}
          onFilterChange={onFilterChange}
          onSearch={onSearchChange}
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
                onClick={onResetFilters}
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
          onFilterChange={onFilterChange}
        />
      )}
    </div>
  );
}
