
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';
import { 
  fetchGlossaryTerms,
  fetchGlossaryTermBySlug,
  createGlossaryTerm,
  updateGlossaryTerm,
  deleteGlossaryTerm,
  searchGlossaryTerms,
  filterGlossaryTermsByCategory
} from '@/services/glossaryService';
import { GlossaryTerm, GlossaryFormValues } from '@/types/glossary';

export function useGlossaryTerms() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Get all glossary terms
  const {
    data: terms = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['glossaryTerms'],
    queryFn: fetchGlossaryTerms,
  });
  
  // Get unique categories from the glossary terms
  const uniqueCategories = Array.from(
    new Set(terms.flatMap((term) => term.category || []))
  ).sort();
  
  // Filter terms based on search and categories
  const filteredTerms = terms.filter((term) => {
    const matchesSearch = !search || 
      term.term.toLowerCase().includes(search.toLowerCase()) || 
      term.definition.toLowerCase().includes(search.toLowerCase());
      
    const matchesCategories = 
      selectedCategories.length === 0 || 
      selectedCategories.some(cat => term.category.includes(cat));
      
    return matchesSearch && matchesCategories;
  });

  // Create term mutation
  const createMutation = useMutation({
    mutationFn: (termData: GlossaryFormValues) => createGlossaryTerm(termData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glossaryTerms'] });
      toast.success("Glossary term added successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to add term: ${error.message}`);
    }
  });

  // Update term mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, termData }: { id: string; termData: Partial<GlossaryFormValues> }) => 
      updateGlossaryTerm(id, termData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glossaryTerms'] });
      toast.success("Glossary term updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update term: ${error.message}`);
    }
  });

  // Delete term mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGlossaryTerm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glossaryTerms'] });
      toast.success("Glossary term deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete term: ${error.message}`);
    }
  });

  return {
    terms: filteredTerms,
    allTerms: terms,
    isLoading,
    error,
    search,
    setSearch,
    categories: uniqueCategories,
    selectedCategories,
    setSelectedCategories,
    createTerm: createMutation.mutate,
    updateTerm: updateMutation.mutate,
    deleteTerm: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useGlossaryTerm(slug: string) {
  return useQuery({
    queryKey: ['glossaryTerm', slug],
    queryFn: () => fetchGlossaryTermBySlug(slug),
    enabled: !!slug,
  });
}
