
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
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

  // Add a term learning status hook
  const useTermLearningStatus = (termSlug: string) => {
    const { data, isLoading } = useQuery({
      queryKey: ['glossaryTermStatus', termSlug],
      queryFn: async () => {
        if (!user) return { isLearned: false };
        
        const { data, error } = await supabase
          .from('user_glossary_terms')
          .select('is_learned')
          .eq('user_id', user.id)
          .eq('term_slug', termSlug)
          .maybeSingle();
          
        if (error) throw error;
        return { isLearned: !!data?.is_learned };
      },
      enabled: !!user
    });
    
    return { isLearned: data?.isLearned || false, isLoading };
  };
  
  // Add statistics hook
  const useGlossaryStats = () => {
    const { data, isLoading } = useQuery({
      queryKey: ['glossaryStats'],
      queryFn: async () => {
        if (!user) return { totalLearned: 0, totalTerms: 0 };
        
        // Get total terms
        const { count: totalTerms, error: termsError } = await supabase
          .from('glossary_terms')
          .select('*', { count: 'exact', head: true });
          
        if (termsError) throw termsError;
        
        // Get learned terms
        const { count: totalLearned, error: learnedError } = await supabase
          .from('user_glossary_terms')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_learned', true);
          
        if (learnedError) throw learnedError;
        
        return { totalLearned: totalLearned || 0, totalTerms: totalTerms || 0 };
      },
      enabled: !!user
    });
    
    return { 
      totalLearned: data?.totalLearned || 0, 
      totalTerms: data?.totalTerms || 0,
      isLoading 
    };
  };
  
  // Add recently learned terms hook
  const useRecentlyLearnedTerms = () => {
    const { data, isLoading } = useQuery({
      queryKey: ['recentlyLearnedTerms'],
      queryFn: async () => {
        if (!user) return [];
        
        const { data, error } = await supabase
          .from('user_glossary_terms')
          .select('term_slug, learned_at')
          .eq('user_id', user.id)
          .eq('is_learned', true)
          .order('learned_at', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        if (data.length > 0) {
          const termSlugs = data.map(item => item.term_slug);
          const { data: terms, error: termsError } = await supabase
            .from('glossary_terms')
            .select('slug, term, definition')
            .in('slug', termSlugs);
            
          if (termsError) throw termsError;
          
          // Combine the terms with learned_at dates from user_glossary_terms
          const enrichedTerms = terms ? terms.map(term => {
            const userTerm = data.find(ut => ut.term_slug === term.slug);
            return {
              ...term,
              term_slug: term.slug,
              learned_at: userTerm ? userTerm.learned_at : null
            };
          }) : [];
          
          return enrichedTerms;
        }
        
        return [];
      },
      enabled: !!user
    });
    
    return { recentTerms: data || [], isLoading };
  };

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
      queryClient.invalidateQueries({ queryKey: ['recentlyLearnedTerms'] });
      
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
    toggleTermLearned,
    useTermLearningStatus,
    useGlossaryStats,
    useRecentlyLearnedTerms
  };
}
