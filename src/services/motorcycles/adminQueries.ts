import { supabase } from '@/integrations/supabase/client';
import { Motorcycle } from '@/types';

export async function fetchAllMotorcyclesForAdmin(): Promise<Motorcycle[]> {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .select(`
      *,
      brands:brand_id(
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

  // Transform the data to ensure consistent brand access
  const transformedData = (data || []).map(item => ({
    ...item,
    brand: item.brands || undefined,
    // Keep legacy property for backward compatibility
    brands: item.brands || undefined,
    // Ensure make property is populated from brand
    make: item.brands?.name || item.make || ''
  }));

  return transformedData;
}

export async function publishMotorcycle(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('motorcycle_models')
    .update({ is_draft: false })
    .eq('id', id);

  if (error) {
    console.error('Error publishing motorcycle:', error);
    return false;
  }

  return true;
}

export async function unpublishMotorcycle(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('motorcycle_models')
    .update({ is_draft: true })
    .eq('id', id);

  if (error) {
    console.error('Error unpublishing motorcycle:', error);
    return false;
  }

  return true;
}

export async function updateMotorcycleAdmin(id: string, updates: Partial<Motorcycle>) {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating motorcycle:', error);
    throw error;
  }

  return data;
}

export async function deleteMotorcycleAdmin(id: string) {
  const { error } = await supabase
    .from('motorcycle_models')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting motorcycle:', error);
    throw error;
  }
}

export async function bulkUpdateMotorcycles(ids: string[], updates: Partial<Motorcycle>) {
  const { data, error } = await supabase
    .from('motorcycle_models')
    .update(updates)
    .in('id', ids)
    .select();

  if (error) {
    console.error('Error bulk updating motorcycles:', error);
    throw error;
  }

  return data;
}
