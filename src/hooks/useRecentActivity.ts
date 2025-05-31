
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MotorcycleWithBrand {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  is_draft: boolean;
  brand_name: string | null;
  slug: string;
}

export const useRecentBrands = () => {
  return useQuery({
    queryKey: ["recent-brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name, created_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      return data;
    },
  });
};

export const useRecentMotorcycles = () => {
  return useQuery({
    queryKey: ["recent-motorcycles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('motorcycle_models')
        .select(`
          id, 
          name, 
          created_at, 
          updated_at, 
          is_draft,
          slug,
          brands!inner(name)
        `)
        .order('updated_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      // Transform the data to flatten the brand structure
      const transformedData: MotorcycleWithBrand[] = data.map(item => {
        // Properly type the brands property
        const brands = item.brands as { name: string }[] | { name: string } | null;
        let brandName: string | null = null;
        
        if (brands) {
          if (Array.isArray(brands)) {
            brandName = brands[0]?.name || null;
          } else {
            brandName = brands.name || null;
          }
        }
        
        return {
          id: item.id,
          name: item.name,
          created_at: item.created_at,
          updated_at: item.updated_at,
          is_draft: item.is_draft,
          slug: item.slug,
          brand_name: brandName
        };
      });
      
      return transformedData;
    },
  });
};
