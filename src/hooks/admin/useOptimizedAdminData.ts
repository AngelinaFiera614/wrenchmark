
import { useState, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllMotorcycleModels } from "@/services/models/modelQueries";
import { fetchModelYears } from "@/services/models/modelYearService";
import { fetchConfigurations } from "@/services/models/configurationService";
import { MotorcycleModel, ModelYear, Configuration } from "@/types/motorcycle";
import { useToast } from "@/hooks/use-toast";

interface PaginationConfig {
  page: number;
  limit: number;
  total: number;
}

export const useOptimizedAdminData = (selectedModel: string | null, selectedYear: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Pagination state
  const [modelsPagination, setModelsPagination] = useState<PaginationConfig>({
    page: 1,
    limit: 50,
    total: 0
  });

  // Search and filter state
  const [modelSearch, setModelSearch] = useState("");
  const [modelFilters, setModelFilters] = useState({
    brand: "",
    type: "",
    production_status: "active"
  });

  // Cached models query with pagination
  const { 
    data: modelsResponse, 
    isLoading: modelsLoading,
    error: modelsError
  } = useQuery({
    queryKey: ["motorcycle-models-paginated", modelsPagination.page, modelsPagination.limit, modelSearch, modelFilters],
    queryFn: async () => {
      const allModels = await fetchAllMotorcycleModels();
      
      // Apply search filter
      let filteredModels = allModels;
      if (modelSearch) {
        filteredModels = allModels.filter(model => 
          model.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
          model.brand?.name?.toLowerCase().includes(modelSearch.toLowerCase())
        );
      }

      // Apply other filters
      if (modelFilters.brand) {
        filteredModels = filteredModels.filter(model => model.brand?.id === modelFilters.brand);
      }
      if (modelFilters.type) {
        filteredModels = filteredModels.filter(model => model.type === modelFilters.type);
      }
      if (modelFilters.production_status) {
        filteredModels = filteredModels.filter(model => model.production_status === modelFilters.production_status);
      }

      // Pagination
      const startIndex = (modelsPagination.page - 1) * modelsPagination.limit;
      const endIndex = startIndex + modelsPagination.limit;
      const paginatedModels = filteredModels.slice(startIndex, endIndex);

      return {
        models: paginatedModels,
        total: filteredModels.length,
        hasNextPage: endIndex < filteredModels.length,
        hasPreviousPage: modelsPagination.page > 1
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching models:", error);
        toast({
          variant: "destructive",
          title: "Error Loading Models",
          description: "Failed to load motorcycle models. Please try refreshing."
        });
      }
    }
  });

  // Model years with caching
  const { 
    data: modelYears = [], 
    isLoading: yearsLoading,
    error: yearsError
  } = useQuery({
    queryKey: ["model-years-cached", selectedModel],
    queryFn: () => selectedModel ? fetchModelYears(selectedModel) : Promise.resolve([]),
    enabled: !!selectedModel,
    staleTime: 10 * 60 * 1000, // 10 minutes cache
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

  // Configurations with optimized loading
  const { 
    data: configurations = [], 
    isLoading: configsLoading,
    error: configsError,
    refetch: refetchConfigurations
  } = useQuery({
    queryKey: ["configurations-optimized", selectedYear],
    queryFn: () => {
      if (!selectedYear) return Promise.resolve([]);
      return fetchConfigurations(selectedYear);
    },
    enabled: !!selectedYear,
    staleTime: 2 * 60 * 1000, // 2 minutes cache for frequently changing data
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching configurations:", error);
        toast({
          variant: "destructive",
          title: "Error Loading Configurations", 
          description: "Failed to load trim configurations. Please try again."
        });
      }
    }
  });

  // Pagination handlers
  const handleModelsPageChange = useCallback((page: number) => {
    setModelsPagination(prev => ({ ...prev, page }));
  }, []);

  const handleModelsLimitChange = useCallback((limit: number) => {
    setModelsPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  // Search and filter handlers
  const handleModelSearch = useCallback((search: string) => {
    setModelSearch(search);
    setModelsPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleModelFilter = useCallback((filters: typeof modelFilters) => {
    setModelFilters(filters);
    setModelsPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Cache management
  const refreshCache = useCallback(async (scope: 'models' | 'years' | 'configurations' | 'all' = 'all') => {
    const invalidationPromises = [];
    
    if (scope === 'models' || scope === 'all') {
      invalidationPromises.push(
        queryClient.invalidateQueries({ queryKey: ["motorcycle-models-paginated"] })
      );
    }
    
    if (scope === 'years' || scope === 'all') {
      invalidationPromises.push(
        queryClient.invalidateQueries({ queryKey: ["model-years-cached"] })
      );
    }
    
    if (scope === 'configurations' || scope === 'all') {
      invalidationPromises.push(
        queryClient.invalidateQueries({ queryKey: ["configurations-optimized"] })
      );
    }

    await Promise.all(invalidationPromises);
  }, [queryClient]);

  // Memoized derived data
  const models = useMemo(() => modelsResponse?.models || [], [modelsResponse]);
  const modelsPaginationInfo = useMemo(() => ({
    ...modelsPagination,
    total: modelsResponse?.total || 0,
    hasNextPage: modelsResponse?.hasNextPage || false,
    hasPreviousPage: modelsResponse?.hasPreviousPage || false
  }), [modelsPagination, modelsResponse]);

  return {
    // Data
    models,
    modelYears,
    configurations,
    
    // Loading states
    modelsLoading,
    yearsLoading,
    configsLoading,
    
    // Error states
    modelsError,
    yearsError,
    configsError,
    
    // Pagination
    modelsPaginationInfo,
    handleModelsPageChange,
    handleModelsLimitChange,
    
    // Search and filters
    modelSearch,
    modelFilters,
    handleModelSearch,
    handleModelFilter,
    
    // Cache management
    refreshCache,
    refetchConfigurations
  };
};
