import { supabase } from "@/integrations/supabase/client";
import { StateRule } from "@/types/state";

/**
 * Fetches all state rules from the database
 */
export async function getAllStateRules(): Promise<StateRule[]> {
  const { data, error } = await supabase
    .from("state_rules")
    .select("*")
    .order("state_name", { ascending: true });

  if (error) {
    console.error("Error fetching state rules:", error);
    throw error;
  }

  return data || [];
}

/**
 * Fetches a specific state rule by its code
 */
export async function getStateRuleByCode(stateCode: string): Promise<StateRule | null> {
  const { data, error } = await supabase
    .from("state_rules")
    .select("*")
    .eq("state_code", stateCode)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching state rule:", error);
    throw error;
  }

  return data;
}

/**
 * Creates or updates a state rule
 */
export async function upsertStateRule(stateRule: Partial<StateRule>): Promise<StateRule> {
  if (!stateRule.state_code || !stateRule.state_name) {
    throw new Error("State code and name are required");
  }

  const { data, error } = await supabase
    .from("state_rules")
    .upsert({
      state_code: stateRule.state_code,
      state_name: stateRule.state_name,
      permit_age_min: stateRule.permit_age_min || null,
      helmet_required: stateRule.helmet_required !== undefined ? stateRule.helmet_required : false,
      special_rules: stateRule.special_rules || null,
      road_test_required: stateRule.road_test_required !== undefined ? stateRule.road_test_required : true,
      link_to_dmv: stateRule.link_to_dmv || null
    })
    .select()
    .single();

  if (error) {
    console.error("Error upserting state rule:", error);
    throw error;
  }

  return data;
}

/**
 * Gets state rules that are related to a specific lesson
 */
export async function getStateRulesForLesson(lessonId: string): Promise<StateRule[]> {
  // First get the lesson to find its state_code if any
  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("state_code")
    .eq("id", lessonId)
    .single();

  if (lessonError) {
    console.error("Error fetching lesson state code:", lessonError);
    return [];
  }

  // If lesson has a specific state code, fetch just that state's rules
  if (lesson?.state_code) {
    const stateRule = await getStateRuleByCode(lesson.state_code);
    return stateRule ? [stateRule] : [];
  }

  // Otherwise return an empty array - meaning no specific state rules apply
  return [];
}
