
import { BaseDataService, ServiceResponse, PaginatedResponse } from "../base/BaseDataService";
import { supabase } from "@/integrations/supabase/client";
import { Motorcycle } from "@/types";

export interface MotorcycleFilters {
  search?: string;
  brandId?: string;
  category?: string;
  isDraft?: boolean;
  yearRange?: [number, number];
}

export class MotorcycleService extends BaseDataService {
  static async getAll(filters: MotorcycleFilters = {}): Promise<ServiceResponse<Motorcycle[]>> {
    return this.executeQuery(async () => {
      console.log('MotorcycleService.getAll called with filters:', filters);
      
      let query = supabase
        .from('motorcycle_models')
        .select(`
          *,
          brand:brands(
            id,
            name,
            slug,
            country
          )
        `)
        .order('name', { ascending: true });

      // Apply filters
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      
      if (filters.brandId) {
        query = query.eq('brand_id', filters.brandId);
      }
      
      if (filters.category) {
        query = query.eq('type', filters.category);
      }
      
      if (filters.isDraft !== undefined) {
        query = query.eq('is_draft', filters.isDraft);
      }

      const result = await query;
      console.log('MotorcycleService.getAll query result:', result.data?.length || 0, 'items');
      
      if (result.data) {
        // Transform the data to ensure consistent brand access
        const transformedData = result.data.map(item => ({
          ...item,
          brand: item.brand || undefined,
          brands: item.brand || undefined,
          make: item.brand?.name || item.make || ''
        }));
        
        return {
          ...result,
          data: transformedData
        };
      }
      
      return result;
    });
  }

  static async getById(id: string): Promise<ServiceResponse<Motorcycle>> {
    return this.executeQuery(async () => {
      return await supabase
        .from('motorcycle_models')
        .select(`
          *,
          brand:brands(
            id,
            name,
            slug,
            country
          )
        `)
        .eq('id', id)
        .single();
    });
  }

  static async create(data: Partial<Motorcycle>): Promise<ServiceResponse<Motorcycle>> {
    const validationError = this.validateRequiredFields(data, ['name', 'brand_id', 'type']);
    if (validationError) {
      return {
        data: null,
        error: validationError,
        success: false
      };
    }

    return this.executeQuery(async () => {
      return await supabase
        .from('motorcycle_models')
        .insert([data])
        .select(`
          *,
          brand:brands(
            id,
            name,
            slug,
            country
          )
        `)
        .single();
    });
  }

  static async update(id: string, updates: Partial<Motorcycle>): Promise<ServiceResponse<Motorcycle>> {
    return this.executeQuery(async () => {
      return await supabase
        .from('motorcycle_models')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          brand:brands(
            id,
            name,
            slug,
            country
          )
        `)
        .single();
    });
  }

  static async delete(id: string): Promise<ServiceResponse<boolean>> {
    return this.executeQuery(async () => {
      const { error } = await supabase
        .from('motorcycle_models')
        .delete()
        .eq('id', id);
      
      return { data: true, error };
    });
  }

  static async publish(id: string): Promise<ServiceResponse<Motorcycle>> {
    return this.update(id, { is_draft: false });
  }

  static async unpublish(id: string): Promise<ServiceResponse<Motorcycle>> {
    return this.update(id, { is_draft: true });
  }

  static async bulkUpdate(ids: string[], updates: Partial<Motorcycle>): Promise<ServiceResponse<Motorcycle[]>> {
    return this.executeQuery(async () => {
      return await supabase
        .from('motorcycle_models')
        .update(updates)
        .in('id', ids)
        .select(`
          *,
          brand:brands(
            id,
            name,
            slug,
            country
          )
        `);
    });
  }

  static async getCompletionStats(): Promise<ServiceResponse<{
    total: number;
    complete: number;
    incomplete: number;
    drafts: number;
  }>> {
    return this.executeQuery(async () => {
      const { data: motorcycles, error } = await supabase
        .from('motorcycle_models')
        .select('id, is_draft, name, engine_size, horsepower, weight_kg');

      if (error) return { data: null, error };

      const total = motorcycles?.length || 0;
      const drafts = motorcycles?.filter(m => m.is_draft).length || 0;
      const complete = motorcycles?.filter(m => 
        !m.is_draft && m.engine_size && m.horsepower && m.weight_kg
      ).length || 0;
      const incomplete = total - complete - drafts;

      return {
        data: { total, complete, incomplete, drafts },
        error: null
      };
    });
  }
}
