
import { useQuery } from "@tanstack/react-query";
import { fetchAllMotorcycleModels } from "@/services/models/modelQueries";
import { fetchModelYears } from "@/services/models/modelYearService";
import { fetchConfigurations } from "@/services/models/configurationService";
import { MotorcycleModel, ModelYear, Configuration } from "@/types/motorcycle";
import { useToast } from "@/hooks/use-toast";

export const useAdminDataQueries = (selectedModel: string | null, selectedYear: string | null) => {
  const { toast } = useToast();

  // Data queries with proper typing and enhanced error handling
  const { 
    data: models = [], 
    isLoading: modelsLoading,
    error: modelsError
  } = useQuery<MotorcycleModel[], Error>({
    queryKey: ["motorcycle-models"],
    queryFn: fetchAllMotorcycleModels,
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching motorcycle models:", error);
        toast({
          variant: "destructive",
          title: "Error Loading Models",
          description: "Failed to load motorcycle models. Please try refreshing."
        });
      }
    }
  });

  const { 
    data: modelYears = [], 
    isLoading: yearsLoading,
    error: yearsError
  } = useQuery<ModelYear[], Error>({
    queryKey: ["model-years", selectedModel],
    queryFn: () => selectedModel ? fetchModelYears(selectedModel) : Promise.resolve([]),
    enabled: !!selectedModel,
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching model years:", error);
        toast({
          variant: "destructive",
          title: "Error Loading Model Years",
          description: "Failed to load model years. Please try again."
        });
      }
    }
  });

  // Enhanced configurations query with better error handling
  const { 
    data: configurations = [], 
    isLoading: configsLoading,
    error: configsError,
    refetch: refetchConfigurations
  } = useQuery<Configuration[], Error>({
    queryKey: ["configurations", selectedYear],
    queryFn: () => {
      if (!selectedYear) {
        console.log("No selected year, returning empty configurations");
        return Promise.resolve([]);
      }
      console.log("Fetching configurations for year:", selectedYear);
      return fetchConfigurations(selectedYear);
    },
    enabled: !!selectedYear,
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching configurations:", error);
        toast({
          variant: "destructive",
          title: "Error Loading Configurations",
          description: "Failed to load trim configurations. Please try again."
        });
      }
    },
    onSuccess: (data: Configuration[]) => {
      console.log("Configurations query successful:", {
        yearId: selectedYear,
        count: data.length,
        configurations: data.map(c => ({ id: c.id, name: c.name }))
      });
    }
  });

  return {
    models,
    modelYears,
    configurations,
    modelsLoading,
    yearsLoading,
    configsLoading,
    modelsError,
    yearsError,
    configsError,
    refetchConfigurations
  };
};
