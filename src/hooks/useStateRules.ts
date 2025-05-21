
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StateRule } from "@/types/state";

// Hook to get all state rules
export const useAllStateRules = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["state-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("state_rules")
        .select("*")
        .order("state_name", { ascending: true });

      if (error) {
        throw error;
      }
      
      return data as StateRule[];
    },
  });

  return {
    states: data || [],
    isLoading,
    error,
  };
};

// Hook to get state rules for a specific state code
export const useStateByCode = (stateCode?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["state-rules", stateCode],
    queryFn: async () => {
      if (!stateCode) return null;
      
      const { data, error } = await supabase
        .from("state_rules")
        .select("*")
        .eq("state_code", stateCode)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // No state found, return null instead of throwing
        }
        throw error;
      }
      
      return data as StateRule;
    },
    enabled: !!stateCode,
  });

  return {
    state: data,
    isLoading,
    error,
  };
};

// Hook to get state rules for a specific lesson
export const useLessonStateRules = (lessonStateCode?: string) => {
  const { data: state, isLoading, error } = useQuery({
    queryKey: ["state-rules", lessonStateCode],
    queryFn: async () => {
      if (!lessonStateCode) return null;
      
      const { data, error } = await supabase
        .from("state_rules")
        .select("*")
        .eq("state_code", lessonStateCode)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // No state found, return null instead of throwing
        }
        throw error;
      }
      
      return data as StateRule;
    },
    enabled: !!lessonStateCode,
  });

  // Return state as stateRules array for consistency
  const stateRules = state ? [state] : [];
  
  return {
    state,
    stateRules,
    isLoading,
    error,
  };
};
