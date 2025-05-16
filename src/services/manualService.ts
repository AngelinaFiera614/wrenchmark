
import { supabase } from "@/integrations/supabase/client";

export interface ManualInfo {
  id?: string;
  title: string;
  motorcycle_id: string;
  manual_type?: string;
  year?: number;
  file_size_mb?: number;
  file_url?: string;
}

export interface ManualWithMotorcycle extends ManualInfo {
  motorcycle_name?: string;
}

export const getManuals = async (): Promise<ManualWithMotorcycle[]> => {
  const { data, error } = await supabase
    .from('manuals')
    .select(`
      *,
      motorcycles:motorcycle_id (
        model_name,
        year,
        brand:brand_id (name)
      )
    `)
    .order('title');

  if (error) {
    console.error("Error fetching manuals:", error);
    throw error;
  }

  // Transform the response to get motorcycle name
  return (data || []).map(item => {
    const motorcycle = item.motorcycles;
    return {
      ...item,
      motorcycle_name: motorcycle 
        ? `${motorcycle.brand?.name} ${motorcycle.model_name} ${motorcycle.year || ''}` 
        : 'Unknown'
    };
  });
};

export const getManualById = async (id: string): Promise<ManualWithMotorcycle | null> => {
  const { data, error } = await supabase
    .from('manuals')
    .select(`
      *,
      motorcycles:motorcycle_id (
        model_name,
        year,
        brand:brand_id (name)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No match found
    }
    console.error("Error fetching manual:", error);
    throw error;
  }

  if (!data) return null;

  const motorcycle = data.motorcycles;
  return {
    ...data,
    motorcycle_name: motorcycle 
      ? `${motorcycle.brand?.name} ${motorcycle.model_name} ${motorcycle.year || ''}` 
      : 'Unknown'
  };
};

export const createManual = async (manual: ManualInfo): Promise<ManualWithMotorcycle> => {
  const { data, error } = await supabase
    .from('manuals')
    .insert([manual])
    .select()
    .single();

  if (error) {
    console.error("Error creating manual:", error);
    throw error;
  }

  return {
    ...data,
    motorcycle_name: 'Unknown' // This will be updated when fetched again with motorcycle info
  };
};

export const updateManual = async (id: string, updates: Partial<ManualInfo>): Promise<ManualWithMotorcycle> => {
  const { data, error } = await supabase
    .from('manuals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating manual:", error);
    throw error;
  }

  return {
    ...data,
    motorcycle_name: 'Unknown' // This will be updated when fetched again with motorcycle info
  };
};

export const deleteManual = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('manuals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting manual:", error);
    throw error;
  }
};

// Changed function name from uploadManual to uploadManualFile
export const uploadManualFile = async (file: File, path: string): Promise<string> => {
  const { data, error } = await supabase
    .storage
    .from('manuals')
    .upload(path, file);

  if (error) {
    console.error("Error uploading manual file:", error);
    throw error;
  }

  // Return the path to the uploaded file
  return data.path;
};
