
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGlossaryLearning() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get the learning status of a specific term for the current user
  const useTermLearningStatus = (slug: string) => {
    const { data, isLoading } = useQuery({
      queryKey: ["termLearningStatus", slug, user?.id],
      queryFn: async () => {
        if (!user) return null;
        
        const { data } = await supabase
          .from("user_glossary_terms")
          .select("is_learned, learned_at")
          .eq("user_id", user.id)
          .eq("term_slug", slug)
          .maybeSingle();
          
        return data;
      },
      enabled: !!user && !!slug
    });

    return {
      isLearned: data?.is_learned || false,
      learnedAt: data?.learned_at || null,
      isLoading
    };
  };

  // Toggle a term's learned status
  const toggleTermLearned = useMutation({
    mutationFn: async ({ 
      slug, 
      isLearned 
    }: { 
      slug: string; 
      isLearned: boolean;
    }) => {
      if (!user) throw new Error("User must be logged in");
      
      const functionName = isLearned 
        ? 'mark_term_as_learned' 
        : 'mark_term_as_unlearned';
        
      const { data, error } = await supabase
        .rpc(functionName, {
          term_slug_param: slug
        });
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["termLearningStatus", variables.slug] });
      queryClient.invalidateQueries({ queryKey: ["userGlossaryStats"] });
      queryClient.invalidateQueries({ queryKey: ["userLearnedTerms"] });
      
      toast({
        title: variables.isLearned ? "Term marked as learned" : "Term marked as not learned",
        description: `You've updated your learning status for this term.`,
        duration: 3000
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating term status",
        description: error.message,
        variant: "destructive",
        duration: 5000
      });
    }
  });

  // Get user's glossary stats
  const useGlossaryStats = () => {
    const { data, isLoading } = useQuery({
      queryKey: ["userGlossaryStats", user?.id],
      queryFn: async () => {
        if (!user) return null;
        
        const { data, error } = await supabase
          .rpc("get_user_glossary_stats");
          
        if (error) throw error;
        return data[0];
      },
      enabled: !!user
    });

    return {
      totalTerms: data?.total_terms || 0,
      learnedTerms: data?.learned_terms || 0,
      percentage: data?.learning_percentage || 0,
      isLoading
    };
  };

  // Get user's recently learned terms
  const useRecentlyLearnedTerms = (limit = 5) => {
    const { data, isLoading } = useQuery({
      queryKey: ["userLearnedTerms", user?.id, limit],
      queryFn: async () => {
        if (!user) return [];
        
        const { data, error } = await supabase
          .rpc("get_user_learned_terms", {
            limit_param: limit
          });
          
        if (error) throw error;
        return data;
      },
      enabled: !!user
    });

    return {
      terms: data || [],
      isLoading
    };
  };

  return {
    useTermLearningStatus,
    toggleTermLearned,
    useGlossaryStats,
    useRecentlyLearnedTerms,
    isAuthenticated: !!user
  };
}
