
import { supabase } from '@/integrations/supabase/client';
import { Motorcycle } from '@/types';

export interface SimpleMotorcycleFilters {
  search?: string;
  brandId?: string;
  category?: string;
  isDraft?: boolean;
}

export async function fetchMotorcyclesSimple(filters: SimpleMotorcycleFilters = {}): Promise<Motorcycle[]> {
  try {
    console.log('fetchMotorcyclesSimple - Starting with filters:', filters);
    
    // Start with a basic query - fix the foreign key syntax
    let query = supabase
      .from('motorcycle_models')
      .select(`
        *,
        brands(
          id,
          name,
          slug,
          country
        )
      `)
      .order('name', { ascending: true });

    // Apply filters one by one
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

    const { data, error } = await query;

    if (error) {
      console.error('fetchMotorcyclesSimple - Query error:', error);
      throw error;
    }

    if (!data) {
      console.log('fetchMotorcyclesSimple - No data returned');
      return [];
    }

    console.log('fetchMotorcyclesSimple - Success:', data.length, 'motorcycles');
    
    // Transform data to ensure consistency - fix the brand reference
    const transformedData = data.map(item => ({
      ...item,
      make: item.brands?.name || item.make || 'Unknown',
      model: item.name,
      year: item.production_start_year || new Date().getFullYear(),
      // Ensure backward compatibility
      brand: item.brands,
    }));

    return transformedData;
  } catch (error) {
    console.error('fetchMotorcyclesSimple - Critical error:', error);
    throw error;
  }
}

export async function fetchBrandsSimple() {
  try {
    console.log('fetchBrandsSimple - Starting');
    
    const { data, error } = await supabase
      .from('brands')
      .select('id, name, slug, country')
      .order('name', { ascending: true });

    if (error) {
      console.error('fetchBrandsSimple - Query error:', error);
      throw error;
    }

    console.log('fetchBrandsSimple - Success:', data?.length || 0, 'brands');
    return data || [];
  } catch (error) {
    console.error('fetchBrandsSimple - Critical error:', error);
    throw error;
  }
}

export async function fetchMotorcycleStatsSimple() {
  try {
    console.log('fetchMotorcycleStatsSimple - Starting');
    
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select('id, is_draft, name, engine_size, horsepower, weight_kg');

    if (error) {
      console.error('fetchMotorcycleStatsSimple - Query error:', error);
      throw error;
    }

    if (!data) {
      return { total: 0, complete: 0, incomplete: 0, drafts: 0 };
    }

    const total = data.length;
    const drafts = data.filter(m => m.is_draft).length;
    const complete = data.filter(m => 
      !m.is_draft && m.engine_size && m.horsepower && m.weight_kg
    ).length;
    const incomplete = total - complete - drafts;

    const stats = { total, complete, incomplete, drafts };
    console.log('fetchMotorcycleStatsSimple - Success:', stats);
    return stats;
  } catch (error) {
    console.error('fetchMotorcycleStatsSimple - Critical error:', error);
    throw error;
  }
}
