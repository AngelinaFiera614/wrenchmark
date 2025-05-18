
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  markTermAsLearned,
  markTermAsUnlearned,
  getUserGlossaryStats,
  getUserLearnedTerms,
  isTermLearnedByUser
} from "@/services/glossary/learningService";

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
        
        const isLearned = await isTermLearnedByUser(slug);
        return { is_learned: isLearned };
      },
      enabled: !!user && !!slug
    });

    return {
      isLearned: data?.is_learned || false,
      learnedAt: null, // Note: Current implementation doesn't return learnedAt
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
      
      if (isLearned) {
        await markTermAsLearned(slug);
      } else {
        await markTermAsUnlearned(slug);
      }
      
      return true;
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
        
        return await getUserGlossaryStats();
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
        
        return await getUserLearnedTerms(limit);
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
