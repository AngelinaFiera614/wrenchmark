
import { supabase } from '@/integrations/supabase/client';

export interface ColorVariant {
  id: string;
  name: string;
  color_code: string;
  hex_code?: string;
  description?: string;
  brand_id?: string;
  year_introduced?: number;
  year_discontinued?: number;
  is_metallic?: boolean;
  is_pearl?: boolean;
  is_matte?: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export async function fetchAllColorVariants(): Promise<ColorVariant[]> {
  const { data, error } = await supabase
    .from('color_variants')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching color variants:', error);
    throw error;
  }

  return data || [];
}

export async function createColorVariant(color: Partial<ColorVariant>): Promise<ColorVariant> {
  const { data, error } = await supabase
    .from('color_variants')
    .insert(color)
    .select()
    .single();

  if (error) {
    console.error('Error creating color variant:', error);
    throw error;
  }

  return data;
}

export async function updateColorVariant(id: string, updates: Partial<ColorVariant>): Promise<ColorVariant> {
  const { data, error } = await supabase
    .from('color_variants')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating color variant:', error);
    throw error;
  }

  return data;
}

export async function deleteColorVariant(id: string): Promise<void> {
  const { error } = await supabase
    .from('color_variants')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting color variant:', error);
    throw error;
  }
}

export function validateHexCode(hexCode: string): boolean {
  const hexPattern = /^#[0-9A-Fa-f]{6}$/;
  return hexPattern.test(hexCode);
}

export function processHexCode(input: string): string {
  let processed = input.trim().toUpperCase();
  if (!processed.startsWith('#')) {
    processed = '#' + processed;
  }
  return processed;
}

export function normalizeColorCode(colorCode: string): string {
  // Remove any spaces and convert to uppercase
  return colorCode.trim().toUpperCase().replace(/\s+/g, '');
}
