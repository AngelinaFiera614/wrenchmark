
import { supabase } from "@/integrations/supabase/client";
import { Skill, UserSkill } from "@/types/course";

export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching skills:", error);
    throw error;
  }

  return data || [];
}

export async function getSkillById(id: string): Promise<Skill | null> {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching skill:", error);
    throw error;
  }

  return data;
}

export async function createSkill(skill: Partial<Skill>): Promise<Skill> {
  // Ensure required properties are present
  if (!skill.name) {
    throw new Error("Skill name is required");
  }

  // Create a properly typed object to satisfy Supabase's type requirements
  const skillToInsert = {
    name: skill.name,
    description: skill.description || null,
    category: skill.category || null,
    icon: skill.icon || null
  };

  const { data, error } = await supabase
    .from("skills")
    .insert(skillToInsert)
    .select()
    .single();

  if (error) {
    console.error("Error creating skill:", error);
    throw error;
  }

  return data;
}

export async function updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
  const { data, error } = await supabase
    .from("skills")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating skill:", error);
    throw error;
  }

  return data;
}

export async function deleteSkill(id: string): Promise<void> {
  const { error } = await supabase
    .from("skills")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting skill:", error);
    throw error;
  }
}

export async function getUserSkills(): Promise<UserSkill[]> {
  const { data, error } = await supabase
    .rpc("get_user_top_skills", { limit_param: 20 });

  if (error) {
    console.error("Error fetching user skills:", error);
    throw error;
  }

  // Transform the returned data to match UserSkill interface
  return (data || []).map(item => ({
    skill_id: item.skill_id,
    level: item.level,
    updated_at: new Date().toISOString(), // Set a default value for updated_at
    skill_name: item.skill_name,
    skill_category: item.skill_category,
    skill_icon: item.skill_icon
  }));
}

export async function associateSkillWithLesson(
  lessonId: string, 
  skillId: string, 
  level: number = 1
): Promise<void> {
  const { error } = await supabase
    .from("lesson_skills")
    .insert([{ lesson_id: lessonId, skill_id: skillId, level }]);

  if (error) {
    console.error("Error associating skill with lesson:", error);
    throw error;
  }
}

export async function removeSkillFromLesson(lessonId: string, skillId: string): Promise<void> {
  const { error } = await supabase
    .from("lesson_skills")
    .delete()
    .eq("lesson_id", lessonId)
    .eq("skill_id", skillId);

  if (error) {
    console.error("Error removing skill from lesson:", error);
    throw error;
  }
}
