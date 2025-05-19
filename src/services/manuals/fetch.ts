
import { supabase } from "@/integrations/supabase/client";
import { ManualWithMotorcycle } from "./types";
import { incrementDownloadCount } from "./update";

/**
 * Get a list of all manuals
 */
export async function getManuals(): Promise<ManualWithMotorcycle[]> {
  try {
    // Get all manuals with their associated motorcycles
    const { data, error } = await supabase
      .from('manuals')
      .select('*, motorcycles(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching manuals:", error);
      throw new Error(error.message);
    }

    // Get tags for each manual
    const manualsWithTags = await Promise.all(
      data.map(async (manual) => {
        const { data: tagData } = await supabase
          .rpc('get_tags_for_manual', { manual_id_param: manual.id });
          
        // Format the response to match ManualWithMotorcycle type
        return {
          ...manual,
          // Use motorcycle_name or manual.model as fallback
          motorcycle_name: manual.motorcycles?.model_name || manual.model || "",
          tag_details: tagData || []
        };
      })
    );

    return manualsWithTags;
  } catch (error) {
    console.error("Error in getManuals:", error);
    throw error;
  }
}

/**
 * Get a manual by ID
 */
export async function getManual(id: string): Promise<ManualWithMotorcycle> {
  try {
    const { data, error } = await supabase
      .from('manuals')
      .select('*, motorcycles(*)')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Get tags
    const { data: tagData } = await supabase
      .rpc('get_tags_for_manual', { manual_id_param: id });

    // Return formatted manual with tags
    return {
      ...data,
      // Use motorcycle_name or manual.model as fallback
      motorcycle_name: data.motorcycles?.model_name || data.model || "",
      tag_details: tagData || []
    };
  } catch (error) {
    console.error("Error in getManual:", error);
    throw error;
  }
}

/**
 * Get all manuals for a specific motorcycle
 */
export async function getManualsByMotorcycleId(motorcycleId: string): Promise<ManualWithMotorcycle[]> {
  try {
    const { data, error } = await supabase
      .from('manuals')
      .select('*, motorcycles(*)')
      .eq('motorcycle_id', motorcycleId)
      .order('manual_type');

    if (error) {
      throw new Error(error.message);
    }

    // Get tags for each manual
    const manualsWithTags = await Promise.all(
      data.map(async (manual) => {
        const { data: tagData } = await supabase
          .rpc('get_tags_for_manual', { manual_id_param: manual.id });
          
        return {
          ...manual,
          motorcycle_name: manual.motorcycles?.model_name || "",
          tag_details: tagData || []
        };
      })
    );

    return manualsWithTags;
  } catch (error) {
    console.error("Error in getManualsByMotorcycleId:", error);
    throw error;
  }
}

/**
 * Increment the download count for a manual
 */
export async function incrementManualDownloadCount(manualId: string): Promise<void> {
  try {
    await incrementDownloadCount(manualId);
  } catch (error) {
    console.error("Error incrementing download count:", error);
    throw error;
  }
}
