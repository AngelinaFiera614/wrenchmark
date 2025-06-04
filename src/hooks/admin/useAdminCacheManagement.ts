
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { fetchConfigurationsForMultipleYears } from "@/services/models/configurationService";
import { Configuration } from "@/types/motorcycle";

export const useAdminCacheManagement = (selectedYear: string | null, configurations: Configuration[]) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const refreshConfigurations = useCallback(async (yearIds?: string[]) => {
    console.log("=== REFRESHING CONFIGURATIONS ===");
    console.log("Year IDs to refresh:", yearIds);
    console.log("Currently selected year:", selectedYear);
    
    try {
      const yearsToRefresh = yearIds || (selectedYear ? [selectedYear] : []);
      
      if (yearsToRefresh.length === 0) {
        console.log("No years to refresh");
        return;
      }

      console.log("Invalidating cache for years:", yearsToRefresh);
      
      // Invalidate specific year queries
      for (const yearId of yearsToRefresh) {
        await queryClient.invalidateQueries({ 
          queryKey: ["configurations", yearId],
          exact: true
        });
      }
      
      // Invalidate multi-year queries
      await queryClient.invalidateQueries({ 
        queryKey: ["configurations-multi"],
        exact: false
      });
      
      // Invalidate any pattern-based configuration queries
      await queryClient.invalidateQueries({ 
        queryKey: ["configurations"],
        exact: false
      });
      
      console.log("Cache invalidation completed successfully");
      
      // Add a small delay and then log what we have in cache
      setTimeout(() => {
        console.log("Post-refresh configurations check:", {
          selectedYear,
          configurationsCount: configurations.length
        });
      }, 100);
      
    } catch (error) {
      console.error("Error during cache refresh:", error);
      toast({
        variant: "destructive",
        title: "Refresh Error",
        description: "Failed to refresh configuration data."
      });
    }
  }, [queryClient, selectedYear, toast, configurations.length]);

  // Function to fetch configurations for multiple years (used by components)
  const fetchConfigurationsForYears = useCallback(async (yearIds: string[]): Promise<Configuration[]> => {
    if (yearIds.length === 0) return [];
    
    console.log("Fetching configurations for multiple years:", yearIds);
    
    try {
      // For single year, use the existing single-year fetch
      if (yearIds.length === 1 && yearIds[0] === selectedYear) {
        console.log("Using cached single-year configurations");
        return configurations;
      }
      
      // For multiple years or different years, fetch fresh data
      const configs = await fetchConfigurationsForMultipleYears(yearIds);
      console.log("Fetched multi-year configurations:", configs.length);
      return configs;
    } catch (error) {
      console.error("Error fetching configurations for multiple years:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch configurations for selected years."
      });
      return [];
    }
  }, [configurations, selectedYear, toast]);

  return {
    refreshConfigurations,
    fetchConfigurationsForYears
  };
};
