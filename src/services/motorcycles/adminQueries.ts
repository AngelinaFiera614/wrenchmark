
import { supabase } from '@/integrations/supabase/client';
import { Motorcycle } from '@/types';

export async function fetchAllMotorcyclesForAdmin(): Promise<Motorcycle[]> {
  const { data, error } = await supabase
    .from('motorcycles')
    .select('*')
    .order('make', { ascending: true })
    .order('model', { ascending: true })
    .order('year', { ascending: false });

  if (error) {
    console.error('Error fetching motorcycles for admin:', error);
    throw error;
  }

  return data || [];
}

export async function publishMotorcycle(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('motorcycles')
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
    .from('motorcycles')
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
    .from('motorcycles')
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
    .from('motorcycles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting motorcycle:', error);
    throw error;
  }
}

export async function bulkUpdateMotorcycles(ids: string[], updates: Partial<Motorcycle>) {
  const { data, error } = await supabase
    .from('motorcycles')
    .update(updates)
    .in('id', ids)
    .select();

  if (error) {
    console.error('Error bulk updating motorcycles:', error);
    throw error;
  }

  return data;
}
