
import { supabase } from "@/integrations/supabase/client";
import { RidingSkill, RidingSkillLevel } from "@/types/riding-skills";

export const getRidingSkills = async (): Promise<RidingSkill[]> => {
  const { data, error } = await supabase
    .from('riding_skills')
    .select('*')
    .order('level, title');

  if (error) {
    console.error("Error fetching riding skills:", error);
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    level: item.level as RidingSkillLevel,
  }));
};

export const getRidingSkillById = async (id: string): Promise<RidingSkill | null> => {
  const { data, error } = await supabase
    .from('riding_skills')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No match found
    }
    console.error("Error fetching riding skill:", error);
    throw error;
  }

  return data ? {
    ...data,
    level: data.level as RidingSkillLevel,
  } : null;
};

export const createRidingSkill = async (skill: Omit<RidingSkill, 'id' | 'created_at' | 'updated_at'>): Promise<RidingSkill> => {
  const { data, error } = await supabase
    .from('riding_skills')
    .insert([skill])
    .select()
    .single();

  if (error) {
    console.error("Error creating riding skill:", error);
    throw error;
  }

  return {
    ...data,
    level: data.level as RidingSkillLevel,
  };
};

export const updateRidingSkill = async (id: string, updates: Partial<RidingSkill>): Promise<RidingSkill> => {
  const { data, error } = await supabase
    .from('riding_skills')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating riding skill:", error);
    throw error;
  }

  return {
    ...data,
    level: data.level as RidingSkillLevel,
  };
};

export const deleteRidingSkill = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('riding_skills')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting riding skill:", error);
    throw error;
  }
};
