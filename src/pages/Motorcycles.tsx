import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MotorcycleFilters from "@/components/motorcycles/MotorcycleFilters";
import MotorcycleGrid from "@/components/motorcycles/MotorcycleGrid";
import SmartSearchBar from "@/components/motorcycles/filters/SmartSearchBar";
import SmartRecommendations from "@/components/motorcycles/SmartRecommendations";
import { useMotorcycleFilters, initialFilters } from "@/hooks/useMotorcycleFilters";
import { syncFiltersToUrl, parseFiltersFromUrl } from "@/lib/filter-utils";
import { Button } from "@/components/ui/button";
import { X, Sparkles, RefreshCw, AlertTriangle, Info } from "lucide-react";
import { ComparisonIndicator } from "@/components/comparison/ComparisonIndicator";
import { getAllMotorcycles } from "@/services/motorcycles/motorcycleOperations";
import { Motorcycle } from "@/types";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Motorcycles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [dataQualityInfo, setDataQualityInfo] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // Fetch motorcycles from Supabase
  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("=== MOTORCYCLES PAGE: Starting motorcycle fetch ===");
        
        const data = await getAllMotorcycles();
        console.log("=== MOTORCYCLES PAGE: Motorcycles fetched ===", data.length, "motorcycles");
        
        if (data.length === 0) {
          console.log("=== MOTORCYCLES PAGE: No motorcycles found ===");
          setError("No motorcycles available. Please check with the administrator.");
          toast.error("No published motorcycles found in the database");
        } else {
          setMotorcycles(data);
          
          // Analyze data quality
          const qualityInfo = {
            total: data.length,
            withEngine: data.filter(m => (m.engine_size || 0) > 0).length,
            withPower: data.filter(m => (m.horsepower || 0) > 0).length,
            withWeight: data.filter(m => (m.weight_kg || 0) > 0).length,
            withSeatHeight: data.filter(m => (m.seat_height_mm || 0) > 0).length,
            placeholders: data.filter(m => m.is_placeholder).length,
            withComponentData: data.filter(m => (m._componentData?.configurations || []).length > 0).length
          };
          
          setDataQualityInfo(qualityInfo);
          
          // Debug info for troubleshooting
          setDebugInfo({
            sampleData: data.slice(0, 3).map(m => ({
              name: `${m.make} ${m.model}`,
              year: m.year,
              engine_size: m.engine_size,
              weight_kg: m.weight_kg,
              is_placeholder: m.is_placeholder,
              migration_status: m.migration_status
            }))
          });
          
          console.log("=== DATA QUALITY ANALYSIS ===", qualityInfo);
          console.log("=== MOTORCYCLES PAGE: Success ===");
          toast.success(`Loaded ${data.length} motorcycles successfully`);
          
          if (qualityInfo.withEngine < qualityInfo.total * 0.5) {
            toast.warning("Some motorcycles have incomplete engine data - they will still be displayed");
          }
        }
      } catch (error) {
        console.error("=== MOTORCYCLES PAGE: ERROR ===", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to load motorcycles: ${errorMessage}`);
        toast.error("Failed to load motorcycles data");
        
        // Set debug info for error state
        setDebugInfo({
          errorDetails: {
            message: errorMessage,
            type: error instanceof Error ? error.constructor.name : 'Unknown',
            stack: error instanceof Error ? error.stack : 'No stack trace'
          }
        });
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
  console.log("Data quality:", dataQualityInfo);

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
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-4">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Error Loading Motorcycles</h1>
            </div>
            <p className="text-muted-foreground mb-6">{error}</p>
            
            {dataQualityInfo && (
              <Alert className="mb-6 text-left">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">Data Quality Info:</div>
                    <div className="text-sm space-y-1">
                      <div>Total motorcycles: {dataQualityInfo.total}</div>
                      <div>With engine data: {dataQualityInfo.withEngine}</div>
                      <div>With component data: {dataQualityInfo.withComponentData}</div>
                      <div>Placeholder motorcycles: {dataQualityInfo.placeholders}</div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {debugInfo?.errorDetails && (
              <Alert className="mb-6 text-left">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">Error Details:</div>
                    <div className="text-sm space-y-1">
                      <div>Type: {debugInfo.errorDetails.type}</div>
                      <div>Message: {debugInfo.errorDetails.message}</div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-3">
              <Button onClick={handleRetry} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
                Refresh Page
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-muted rounded-lg text-left">
              <h3 className="font-semibold text-sm mb-2">Troubleshooting Tips:</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Check database connection</li>
                <li>• Verify motorcycle data is published (is_draft = false)</li>
                <li>• Check for relationship mapping issues in queries</li>
                <li>• Contact administrator if issue persists</li>
              </ul>
            </div>
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
              onFilterChange={handleFilterChange}
              onSearch={handleSearchChange}
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
          
          {/* Debug info in development */}
          {debugInfo?.sampleData && process.env.NODE_ENV === 'development' && (
            <details className="mt-8 p-4 bg-muted rounded-lg text-xs">
              <summary className="cursor-pointer font-medium">Debug Info (Development Only)</summary>
              <pre className="mt-2 whitespace-pre-wrap">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
      
      <ComparisonIndicator />
    </div>
  );
}
