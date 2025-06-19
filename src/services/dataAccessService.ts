
import { supabase } from "@/integrations/supabase/client";

// Standardized query patterns with proper error handling
export class DataAccessService {
  static async fetchWithErrorHandling<T>(
    queryFn: () => Promise<{ data: T | null; error: any }>
  ): Promise<T> {
    const { data, error } = await queryFn();
    
    if (error) {
      console.error('Database query error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('No data returned from query');
    }
    
    return data;
  }

  static async fetchModelYearsWithRelations() {
    return this.fetchWithErrorHandling(async () => {
      return await supabase
        .from('model_years')
        .select(`
          id,
          year,
          motorcycle_id,
          motorcycle_models!inner (
            id,
            name,
            brands!inner (
              id,
              name
            )
          )
        `)
        .order('year', { ascending: false });
    });
  }

  static async fetchComponentsWithUsage(componentType: string) {
    const tableName = componentType === 'brake_system' ? 'brake_systems' : `${componentType}s`;
    
    return this.fetchWithErrorHandling(async () => {
      return await supabase
        .from(tableName)
        .select(`
          *,
          component_usage_stats!component_id (
            usage_count,
            model_count,
            trim_count
          )
        `)
        .order('created_at', { ascending: false });
    });
  }

  static async fetchModelWithComponents(modelId: string) {
    return this.fetchWithErrorHandling(async () => {
      return await supabase
        .from('motorcycle_models')
        .select(`
          *,
          model_component_assignments (
            id,
            component_type,
            component_id,
            is_default,
            assignment_type
          ),
          model_years (
            id,
            year,
            model_configurations (
              id,
              name,
              engine_id,
              brake_system_id,
              frame_id,
              suspension_id,
              wheel_id
            )
          )
        `)
        .eq('id', modelId)
        .single();
    });
  }
}
