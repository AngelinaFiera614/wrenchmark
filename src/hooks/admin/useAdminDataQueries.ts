
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdminConfigurationsQuery } from "./useAdminConfigurationsQuery";

export const useAdminDataQueries = (selectedModel?: string, selectedYear?: string) => {
  // Fetch motorcycle models
  const {
    data: models = [],
    isLoading: modelsLoading,
    error: modelsError
  } = useQuery({
    queryKey: ["admin-motorcycle-models-parts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("motorcycle_models")
        .select(`
          id,
          name,
          slug,
          brand_id,
          production_start_year,
          production_end_year,
          brands(name)
        `)
        .eq("is_draft", false)
        .order("name");

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch model years for selected model
  const {
    data: modelYears = [],
    isLoading: yearsLoading,
    error: yearsError
  } = useQuery({
    queryKey: ["model-years", selectedModel],
    queryFn: async () => {
      if (!selectedModel) return [];
      
      const { data, error } = await supabase
        .from("model_years")
        .select(`
          *,
          motorcycle_models!inner(
            id,
            name,
            slug
          )
        `)
        .eq("motorcycle_id", selectedModel)
        .order("year", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedModel,
    staleTime: 5 * 60 * 1000,
  });

  // Use the improved configurations query
  const {
    data: configurations = [],
    isLoading: configsLoading,
    error: configsError,
    refetch: refetchConfigurations
  } = useAdminConfigurationsQuery(selectedYear, selectedModel);

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
