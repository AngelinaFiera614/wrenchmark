
// Functions for creating, updating, and deleting manuals
import { supabase } from "@/integrations/supabase/client";
import { ManualInfo, ManualWithMotorcycle } from "./types";

/**
 * Increment the download count for a manual
 */
export const incrementDownloadCount = async (id: string): Promise<void> => {
  const { error } = await supabase
    .rpc('increment_manual_downloads', { 
      manual_id: id 
    });
  
  if (error) {
    console.error("Error incrementing download count:", error);
    throw error;
  }
};

/**
 * Create a new manual
 */
export const createManual = async (manual: ManualInfo): Promise<ManualWithMotorcycle> => {
  // Ensure we have a title, even if the type allows it to be optional
  if (!manual.title) {
    throw new Error("Manual title is required for creation");
  }

  // Create a new object with all the required fields to satisfy TypeScript
  const manualData = {
    ...manual,
    title: manual.title // This ensures title is seen as non-optional for the insert
  };

  const { data, error } = await supabase
    .from('manuals')
    .insert([manualData])
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

/**
 * Update an existing manual
 */
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

/**
 * Delete a manual by ID
 */
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
