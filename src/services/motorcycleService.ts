
import { supabase } from "@/integrations/supabase/client";
import { Motorcycle } from "@/types";

export const publishMotorcycle = async (motorcycleId: string): Promise<boolean> => {
  try {
    console.log("Publishing motorcycle:", motorcycleId);
    
    const { data, error } = await supabase
      .from('motorcycle_models')
      .update({ is_draft: false })
      .eq('id', motorcycleId)
      .select()
      .single();

    if (error) {
      console.error("Publish error:", error);
      throw error;
    }

    console.log("Motorcycle published successfully:", data);
    return true;
  } catch (error) {
    console.error("Failed to publish motorcycle:", error);
    return false;
  }
};

export const unpublishMotorcycle = async (motorcycleId: string): Promise<boolean> => {
  try {
    console.log("Unpublishing motorcycle:", motorcycleId);
    
    const { data, error } = await supabase
      .from('motorcycle_models')
      .update({ is_draft: true })
      .eq('id', motorcycleId)
      .select()
      .single();

    if (error) {
      console.error("Unpublish error:", error);
      throw error;
    }

    console.log("Motorcycle unpublished successfully:", data);
    return true;
  } catch (error) {
    console.error("Failed to unpublish motorcycle:", error);
    return false;
  }
};

export const updateMotorcycle = async (motorcycleId: string, updateData: Partial<Motorcycle>): Promise<boolean> => {
  try {
    console.log("Updating motorcycle:", motorcycleId, updateData);
    
    const { data, error } = await supabase
      .from('motorcycle_models')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', motorcycleId)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      throw error;
    }

    console.log("Motorcycle updated successfully:", data);
    return true;
  } catch (error) {
    console.error("Failed to update motorcycle:", error);
    return false;
  }
};

export const createMotorcycle = async (motorcycleData: any): Promise<string | null> => {
  try {
    console.log("Creating motorcycle:", motorcycleData);
    
    const { data, error } = await supabase
      .from('motorcycle_models')
      .insert(motorcycleData)
      .select()
      .single();

    if (error) {
      console.error("Create error:", error);
      throw error;
    }

    console.log("Motorcycle created successfully:", data);
    return data.id;
  } catch (error) {
    console.error("Failed to create motorcycle:", error);
    return null;
  }
};

export const deleteMotorcycle = async (motorcycleId: string): Promise<boolean> => {
  try {
    console.log("Deleting motorcycle:", motorcycleId);
    
    const { error } = await supabase
      .from('motorcycle_models')
      .delete()
      .eq('id', motorcycleId);

    if (error) {
      console.error("Delete error:", error);
      throw error;
    }

    console.log("Motorcycle deleted successfully");
    return true;
  } catch (error) {
    console.error("Failed to delete motorcycle:", error);
    return false;
  }
};
