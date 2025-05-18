
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ToggleLearnedParams = {
  slug: string;
  isLearned: boolean;
};

export function useGlossaryLearning() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const toggleTermLearned = useMutation({
    mutationFn: async ({ slug, isLearned }: ToggleLearnedParams) => {
      if (!user) throw new Error("User must be logged in");

      // Call the appropriate RPC function based on the target state
      const { data, error } = await supabase.rpc(
        isLearned ? 'mark_term_as_learned' : 'mark_term_as_unlearned',
        { term_slug_param: slug }
      );

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['userLearnedTerms'] });
      queryClient.invalidateQueries({ queryKey: ['glossaryTermStatus', variables.slug] });
      queryClient.invalidateQueries({ queryKey: ['lessonTermsLearningStatus'] });
      queryClient.invalidateQueries({ queryKey: ['glossaryStats'] });
      
      toast.success(
        variables.isLearned 
          ? "Term marked as learned" 
          : "Term marked as not learned"
      );
    },
    onError: (error) => {
      console.error('Error toggling term learned status:', error);
      toast.error("Failed to update term status");
    }
  });

  return {
    toggleTermLearned
  };
}
