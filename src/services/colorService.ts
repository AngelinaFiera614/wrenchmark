
import { supabase } from '@/integrations/supabase/client';
import { ColorFormState, ColorOption } from '@/types/colors';

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

export async function getColorsForConfiguration(configurationId: string): Promise<ColorOption[]> {
  const { data, error } = await supabase
    .from('color_options')
    .select('*')
    .eq('model_year_id', configurationId)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching colors for configuration:', error);
    throw error;
  }

  return data || [];
}

export async function createColor(configurationId: string, colorData: ColorFormState): Promise<ColorOption> {
  const colorToInsert = {
    ...colorData,
    model_year_id: configurationId,
    // Set intelligent defaults based on color family and finish type
    popularity_score: colorData.popularity_score || 0,
    availability_status: colorData.availability_status || 'available',
    finish_type: colorData.finish_type || 'solid',
    msrp_premium_usd: colorData.msrp_premium_usd || 0
  };

  const { data, error } = await supabase
    .from('color_options')
    .insert(colorToInsert)
    .select()
    .single();

  if (error) {
    console.error('Error creating color:', error);
    throw error;
  }

  return data;
}

export async function updateColor(colorId: string, colorData: ColorFormState): Promise<ColorOption> {
  const { data, error } = await supabase
    .from('color_options')
    .update(colorData)
    .eq('id', colorId)
    .select()
    .single();

  if (error) {
    console.error('Error updating color:', error);
    throw error;
  }

  return data;
}

export async function deleteColor(colorId: string): Promise<boolean> {
  const { error } = await supabase
    .from('color_options')
    .delete()
    .eq('id', colorId);

  if (error) {
    console.error('Error deleting color:', error);
    return false;
  }

  return true;
}

export async function searchColors(query: string): Promise<ColorOption[]> {
  const { data, error } = await supabase
    .from('color_options')
    .select('*')
    .or(`name.ilike.%${query}%,hex_code.ilike.%${query}%`)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error searching colors:', error);
    throw error;
  }

  return data || [];
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
