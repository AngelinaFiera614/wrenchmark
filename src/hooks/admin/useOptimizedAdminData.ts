
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useOptimizedAdminData = () => {
  // Fetch brands for filtering and reference
  const {
    data: brands = [],
    isLoading: brandsLoading,
    error: brandsError
  } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("id, name, slug")
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch motorcycle models with minimal data for admin listing
  const {
    data: models = [],
    isLoading: modelsLoading,
    error: modelsError
  } = useQuery({
    queryKey: ["admin-models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("motorcycle_models")
        .select(`
          id,
          name,
          slug,
          brand_id,
          type,
          is_draft,
          production_status,
          default_image_url,
          created_at,
          updated_at,
          brands!motorcycle_models_brand_id_fkey(
            id,
            name,
            slug
          )
        `)
        .order("name");

      if (error) throw error;
      
      // Transform the data to handle the brand relationship properly
      return (data || []).map(model => ({
        ...model,
        brand_name: Array.isArray(model.brands) && model.brands.length > 0 
          ? model.brands[0].name 
          : "Unknown Brand",
        brand_slug: Array.isArray(model.brands) && model.brands.length > 0 
          ? model.brands[0].slug 
          : "unknown"
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch summary statistics
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [modelsCount, brandsCount, draftsCount] = await Promise.all([
        supabase
          .from("motorcycle_models")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("brands")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("motorcycle_models")
          .select("id", { count: "exact", head: true })
          .eq("is_draft", true)
      ]);

      return {
        totalModels: modelsCount.count || 0,
        totalBrands: brandsCount.count || 0,
        totalDrafts: draftsCount.count || 0,
        publishedModels: (modelsCount.count || 0) - (draftsCount.count || 0)
      };
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  const isLoading = brandsLoading || modelsLoading || statsLoading;
  const error = brandsError || modelsError || statsError;

  return {
    brands,
    models,
    stats,
    isLoading,
    error
  };
};
