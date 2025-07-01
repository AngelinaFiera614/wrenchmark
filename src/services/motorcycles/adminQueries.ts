
import { supabase } from '@/integrations/supabase/client';
import { Motorcycle } from '@/types';
import { filterMotorcycleUpdateData, validateUpdateData } from './fieldFilter';

export async function fetchAllMotorcyclesForAdmin(): Promise<Motorcycle[]> {
  try {
    console.log('Starting fetchAllMotorcyclesForAdmin...');
    
    const { data, error } = await supabase
      .from('motorcycle_models')
      .select(`
        *,
        brands!motorcycle_models_brand_id_fkey(
          id,
          name,
          slug,
          country
        )
      `)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching motorcycle models for admin:', error);
      throw error;
    }

    if (!data) {
      console.log('No data returned from query');
      return [];
    }

    console.log('Raw data from query:', data.length, 'items');

    // Transform the data to ensure consistent brand access
    const transformedData = data.map(item => ({
      ...item,
      // Normalize brand access patterns - these are computed fields for display only
      brand: item.brands || undefined,
      brands: item.brands || undefined,
      // Ensure make property is populated from brand for display
      make: item.brands?.name || item.make || ''
    }));

    console.log('Successfully transformed motorcycle data:', transformedData.length, 'items');
    return transformedData;
  } catch (error) {
    console.error('Critical error in fetchAllMotorcyclesForAdmin:', error);
    
    // Fallback to basic query if the join fails
    try {
      console.log('Attempting fallback query without brand join...');
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('motorcycle_models')
        .select('*')
        .order('name', { ascending: true });

      if (fallbackError) {
        throw fallbackError;
      }

      console.log('Fallback query successful:', fallbackData?.length || 0, 'items');
      return fallbackData || [];
    } catch (fallbackError) {
      console.error('Fallback query also failed:', fallbackError);
      throw error;
    }
  }
}

export async function publishMotorcycle(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('motorcycle_models')
      .update({ is_draft: false })
      .eq('id', id);

    if (error) {
      console.error('Error publishing motorcycle:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in publishMotorcycle:', error);
    return false;
  }
}

export async function unpublishMotorcycle(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('motorcycle_models')
      .update({ is_draft: true })
      .eq('id', id);

    if (error) {
      console.error('Error unpublishing motorcycle:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in unpublishMotorcycle:', error);
    return false;
  }
}

export async function updateMotorcycleAdmin(id: string, updates: Partial<Motorcycle>) {
  try {
    console.log('=== updateMotorcycleAdmin ===');
    console.log('Updating motorcycle:', id);
    console.log('Raw updates received:', updates);
    
    // Validate the update data first
    const validation = validateUpdateData(updates);
    if (!validation.valid) {
      console.error('Update validation failed:', validation.errors);
      throw new Error(`Invalid update data: ${validation.errors.join(', ')}`);
    }
    
    // Filter updates to only include actual database columns
    const filteredUpdates = filterMotorcycleUpdateData(updates);
    
    if (Object.keys(filteredUpdates).length === 0) {
      console.warn('No valid database fields to update');
      throw new Error('No valid fields provided for update');
    }
    
    console.log('Sending filtered updates to database:', filteredUpdates);
    
    const { data, error } = await supabase
      .from('motorcycle_models')
      .update(filteredUpdates)
      .eq('id', id)
      .select(`
        *,
        brands!motorcycle_models_brand_id_fkey(
          id,
          name,
          slug,
          country
        )
      `)
      .single();

    if (error) {
      console.error('Database error updating motorcycle:', error);
      throw new Error(`Failed to update motorcycle: ${error.message}`);
    }

    console.log('Successfully updated motorcycle');
    
    // Transform response to include computed fields for consistency
    const transformedData = {
      ...data,
      brand: data.brands || undefined,
      brands: data.brands || undefined,
      make: data.brands?.name || ''
    };
    
    return transformedData;
  } catch (error) {
    console.error('Error in updateMotorcycleAdmin:', error);
    throw error;
  }
}

export async function deleteMotorcycleAdmin(id: string) {
  try {
    const { error } = await supabase
      .from('motorcycle_models')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting motorcycle:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteMotorcycleAdmin:', error);
    throw error;
  }
}

export async function bulkUpdateMotorcycles(ids: string[], updates: Partial<Motorcycle>) {
  try {
    console.log('=== bulkUpdateMotorcycles ===');
    console.log('Updating motorcycles:', ids);
    console.log('Raw updates received:', updates);
    
    // Validate and filter the update data
    const validation = validateUpdateData(updates);
    if (!validation.valid) {
      console.error('Bulk update validation failed:', validation.errors);
      throw new Error(`Invalid update data: ${validation.errors.join(', ')}`);
    }
    
    const filteredUpdates = filterMotorcycleUpdateData(updates);
    
    if (Object.keys(filteredUpdates).length === 0) {
      console.warn('No valid database fields to update in bulk operation');
      throw new Error('No valid fields provided for bulk update');
    }
    
    console.log('Sending filtered bulk updates to database:', filteredUpdates);
    
    const { data, error } = await supabase
      .from('motorcycle_models')
      .update(filteredUpdates)
      .in('id', ids)
      .select(`
        *,
        brands!motorcycle_models_brand_id_fkey(
          id,
          name,
          slug,
          country
        )
      `);

    if (error) {
      console.error('Database error in bulk update:', error);
      throw new Error(`Failed to bulk update motorcycles: ${error.message}`);
    }

    console.log('Successfully bulk updated motorcycles');
    
    // Transform response data
    const transformedData = data?.map(item => ({
      ...item,
      brand: item.brands || undefined,
      brands: item.brands || undefined,
      make: item.brands?.name || ''
    })) || [];
    
    return transformedData;
  } catch (error) {
    console.error('Error in bulkUpdateMotorcycles:', error);
    throw error;
  }
}
