
import { supabase } from "@/integrations/supabase/client";
import { ColorOption } from "@/types/colors";
import { TrimColorAssignment, ColorAssignmentRequest, BrandColorVariant, ColorManagementStats } from "@/types/colorManagement";

// Trim Color Assignment Operations
export const assignColorToTrim = async (request: ColorAssignmentRequest): Promise<TrimColorAssignment | null> => {
  try {
    const { data, error } = await supabase
      .from('trim_color_assignments')
      .insert(request)
      .select(`
        *,
        color_options (*)
      `)
      .single();

    if (error) {
      console.error("Error assigning color to trim:", error);
      return null;
    }

    return data as TrimColorAssignment;
  } catch (error) {
    console.error("Error in assignColorToTrim:", error);
    return null;
  }
};

export const unassignColorFromTrim = async (configurationId: string, colorOptionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('trim_color_assignments')
      .delete()
      .eq('configuration_id', configurationId)
      .eq('color_option_id', colorOptionId);

    if (error) {
      console.error("Error unassigning color from trim:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in unassignColorFromTrim:", error);
    return false;
  }
};

export const getTrimColorAssignments = async (configurationId: string): Promise<TrimColorAssignment[]> => {
  try {
    const { data, error } = await supabase
      .from('trim_color_assignments')
      .select(`
        *,
        color_options (*)
      `)
      .eq('configuration_id', configurationId)
      .order('created_at');

    if (error) {
      console.error("Error fetching trim color assignments:", error);
      return [];
    }

    return data as TrimColorAssignment[];
  } catch (error) {
    console.error("Error in getTrimColorAssignments:", error);
    return [];
  }
};

export const setDefaultTrimColor = async (configurationId: string, colorOptionId: string): Promise<boolean> => {
  try {
    // First, unset all defaults for this configuration
    await supabase
      .from('trim_color_assignments')
      .update({ is_default: false })
      .eq('configuration_id', configurationId);

    // Then set the new default
    const { error } = await supabase
      .from('trim_color_assignments')
      .update({ is_default: true })
      .eq('configuration_id', configurationId)
      .eq('color_option_id', colorOptionId);

    if (error) {
      console.error("Error setting default trim color:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in setDefaultTrimColor:", error);
    return false;
  }
};

// Brand Color Operations
export const getBrandColors = async (brandId: string): Promise<BrandColorVariant[]> => {
  try {
    const { data, error } = await supabase
      .from('color_variants')
      .select('*')
      .eq('brand_id', brandId)
      .order('name');

    if (error) {
      console.error("Error fetching brand colors:", error);
      return [];
    }

    return data as BrandColorVariant[];
  } catch (error) {
    console.error("Error in getBrandColors:", error);
    return [];
  }
};

export const createBrandColor = async (brandColor: Partial<BrandColorVariant>): Promise<BrandColorVariant | null> => {
  try {
    const { data, error } = await supabase
      .from('color_variants')
      .insert(brandColor)
      .select()
      .single();

    if (error) {
      console.error("Error creating brand color:", error);
      return null;
    }

    return data as BrandColorVariant;
  } catch (error) {
    console.error("Error in createBrandColor:", error);
    return null;
  }
};

// Model Year Color Operations
export const getModelYearColors = async (modelYearId: string): Promise<ColorOption[]> => {
  try {
    const { data, error } = await supabase
      .from('color_options')
      .select('*')
      .eq('model_year_id', modelYearId)
      .order('name');

    if (error) {
      console.error("Error fetching model year colors:", error);
      return [];
    }

    return data as ColorOption[];
  } catch (error) {
    console.error("Error in getModelYearColors:", error);
    return [];
  }
};

export const getAvailableColorsForTrim = async (modelYearId: string, configurationId?: string): Promise<{
  availableColors: ColorOption[];
  assignedColors: TrimColorAssignment[];
}> => {
  try {
    // Get all colors available for this model year
    const availableColors = await getModelYearColors(modelYearId);
    
    // Get assigned colors for this configuration (if provided)
    const assignedColors = configurationId ? await getTrimColorAssignments(configurationId) : [];

    return { availableColors, assignedColors };
  } catch (error) {
    console.error("Error in getAvailableColorsForTrim:", error);
    return { availableColors: [], assignedColors: [] };
  }
};

// Statistics
export const getColorManagementStats = async (): Promise<ColorManagementStats> => {
  try {
    const [brandColors, modelColors, trimAssignments] = await Promise.all([
      supabase.from('color_variants').select('brand_id'),
      supabase.from('color_options').select('id'),
      supabase.from('trim_color_assignments').select('id')
    ]);

    const colorsByBrand: Record<string, number> = {};
    brandColors.data?.forEach(color => {
      colorsByBrand[color.brand_id] = (colorsByBrand[color.brand_id] || 0) + 1;
    });

    return {
      total_brand_colors: brandColors.data?.length || 0,
      total_model_colors: modelColors.data?.length || 0,
      total_trim_assignments: trimAssignments.data?.length || 0,
      colors_by_brand: colorsByBrand
    };
  } catch (error) {
    console.error("Error getting color management stats:", error);
    return {
      total_brand_colors: 0,
      total_model_colors: 0,
      total_trim_assignments: 0,
      colors_by_brand: {}
    };
  }
};
