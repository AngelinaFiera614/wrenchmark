
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getConfigurationsWithComponents } from "@/services/modelComponentService";

export const useAdminConfigurationsQuery = (selectedYear?: string, selectedModel?: string) => {
  return useQuery({
    queryKey: ["admin-configurations", selectedYear, selectedModel],
    queryFn: async () => {
      if (!selectedYear) return [];
      
      // Use the new service to get configurations with component data
      const configurations = await getConfigurationsWithComponents(selectedYear);
      
      // Also fetch model years to get the motorcycle model relationship
      const { data: modelYear } = await supabase
        .from("model_years")
        .select(`
          *,
          motorcycle_models!inner(
            id,
            name,
            slug,
            brands:brand_id(name)
          )
        `)
        .eq("id", selectedYear)
        .single();

      // Enhance configurations with model year data
      return configurations.map(config => ({
        ...config,
        model_year: modelYear,
        // Ensure component data is properly structured
        _componentData: {
          engine: config.engine,
          brakeSystem: config.brake_system,
          frame: config.frame,
          suspension: config.suspension,
          wheels: config.wheel
        }
      }));
    },
    enabled: !!selectedYear,
    staleTime: 5 * 60 * 1000,
  });
};
