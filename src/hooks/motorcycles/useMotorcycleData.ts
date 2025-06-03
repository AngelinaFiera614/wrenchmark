
import { useEffect, useState } from "react";
import { Motorcycle } from "@/types";
import { getAllMotorcycles } from "@/services/motorcycles/motorcycleOperations";
import { toast } from "sonner";

export function useMotorcycleData() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [dataQualityInfo, setDataQualityInfo] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

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

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
  };

  return {
    motorcycles,
    isLoading,
    error,
    dataQualityInfo,
    debugInfo,
    handleRetry
  };
}
