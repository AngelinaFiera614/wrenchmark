
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logAdminAction, auditActions } from "@/services/security/adminAuditLogger";

interface MotorcycleWithBrand {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  is_draft: boolean;
  brand_name: string | null;
  slug: string;
}

interface Brand {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export const useRecentBrands = () => {
  return useQuery({
    queryKey: ["recent-brands"],
    queryFn: async () => {
      try {
        // Log admin action for audit trail
        await logAdminAction({
          action: 'admin_view_recent_brands',
          tableName: 'brands',
          newValues: { query_type: 'recent_list', limit: 5 },
        });

        const { data, error } = await supabase
          .from('brands')
          .select('id, name, created_at, updated_at')
          .order('updated_at', { ascending: false })
          .limit(5);
          
        if (error) {
          console.error('Recent brands query error:', error);
          throw error;
        }

        return data as Brand[];
      } catch (error) {
        console.error('Failed to fetch recent brands:', error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: 1000,
  });
};

export const useRecentMotorcycles = () => {
  return useQuery({
    queryKey: ["recent-motorcycles"],
    queryFn: async () => {
      try {
        // Log admin action for audit trail
        await logAdminAction({
          action: 'admin_view_recent_motorcycles',
          tableName: 'motorcycle_models',
          newValues: { query_type: 'recent_list', limit: 10 },
        });

        // Simplified query to avoid complex joins
        const { data: motorcycles, error: motorcyclesError } = await supabase
          .from('motorcycle_models')
          .select('id, name, created_at, updated_at, is_draft, slug, brand_id')
          .order('updated_at', { ascending: false })
          .limit(10);
          
        if (motorcyclesError) {
          console.error('Recent motorcycles query error:', motorcyclesError);
          throw motorcyclesError;
        }

        if (!motorcycles || motorcycles.length === 0) {
          return [];
        }

        // Get unique brand IDs
        const brandIds = [...new Set(motorcycles.map(m => m.brand_id).filter(Boolean))];
        
        // Fetch brands separately to avoid complex joins
        let brandsMap = new Map();
        if (brandIds.length > 0) {
          const { data: brands, error: brandsError } = await supabase
            .from('brands')
            .select('id, name')
            .in('id', brandIds);
            
          if (brandsError) {
            console.error('Brands lookup error:', brandsError);
            // Continue without brand names rather than failing completely
          } else if (brands) {
            brandsMap = new Map(brands.map(b => [b.id, b.name]));
          }
        }

        // Transform data to include brand names
        const transformedData: MotorcycleWithBrand[] = motorcycles.map(motorcycle => ({
          id: motorcycle.id,
          name: motorcycle.name,
          created_at: motorcycle.created_at,
          updated_at: motorcycle.updated_at,
          is_draft: motorcycle.is_draft,
          slug: motorcycle.slug,
          brand_name: brandsMap.get(motorcycle.brand_id) || null
        }));
        
        return transformedData;
      } catch (error) {
        console.error('Failed to fetch recent motorcycles:', error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: 1000,
  });
};
