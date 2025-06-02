
import { useQuery } from "@tanstack/react-query";
import { fetchGlossaryTerms, fetchGlossaryTermBySlug, deleteTerm } from "@/services/glossary/termService";
import { generateUniqueSlug, checkSlugExists } from "@/services/glossary/slugService";
import { useState, useMemo } from "react";
import { GlossaryTerm } from "@/types/glossary";

export function useGlossaryTerms() {
  const [search, setSearch] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("term-asc");
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["glossaryTerms"],
    queryFn: fetchGlossaryTerms
  });

  // Get all unique categories from terms
  const categories = useMemo(() => 
    data ? [...new Set(data.flatMap(term => term.category || []))].sort() : []
  , [data]);

  const allTerms = data || [];

  // Apply filtering and sorting
  const filteredAndSortedTerms = useMemo(() => {
    let filtered = allTerms.filter(term => {
      const matchesSearch = !search || 
        term.term.toLowerCase().includes(search.toLowerCase()) ||
        term.definition.toLowerCase().includes(search.toLowerCase());

      const matchesCategories = selectedCategories.length === 0 || 
        (term.category && term.category.some(cat => selectedCategories.includes(cat)));

      return matchesSearch && matchesCategories;
    });

    // Apply sorting
    switch (sortBy) {
      case 'term-desc':
        filtered.sort((a, b) => b.term.localeCompare(a.term));
        break;
      case 'updated-desc':
        filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        break;
      case 'updated-asc':
        filtered.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
        break;
      case 'category-asc':
        filtered.sort((a, b) => {
          const catA = a.category?.[0] || '';
          const catB = b.category?.[0] || '';
          return catA.localeCompare(catB);
        });
        break;
      case 'term-asc':
      default:
        filtered.sort((a, b) => a.term.localeCompare(b.term));
        break;
    }

    return filtered;
  }, [allTerms, search, selectedCategories, sortBy]);

  const hasActiveFilters = selectedCategories.length > 0 || sortBy !== 'term-asc' || search.length > 0;

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSortBy("term-asc");
  };

  return {
    terms: filteredAndSortedTerms,
    allTerms,
    isLoading,
    error,
    search,
    setSearch,
    categories,
    selectedCategories,
    setSelectedCategories,
    sortBy,
    setSortBy,
    hasActiveFilters,
    clearFilters,
    deleteTerm
  };
}

export function useGlossaryTerm(slug: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["glossaryTerm", slug],
    queryFn: () => fetchGlossaryTermBySlug(slug),
    enabled: !!slug
  });

  return {
    data,
    isLoading,
    error
  };
}

export function useSlugGenerator() {
  const [isChecking, setIsChecking] = useState(false);
  const [generatedSlug, setGeneratedSlug] = useState<string>("");
  const [slugExists, setSlugExists] = useState(false);

  const generateSlugFromTerm = async (term: string, existingId?: string) => {
    setIsChecking(true);
    try {
      const slug = await generateUniqueSlug(term, existingId);
      setGeneratedSlug(slug);
      setSlugExists(false);
      return slug;
    } catch (error) {
      console.error("Error generating slug:", error);
      return "";
    } finally {
      setIsChecking(false);
    }
  };

  const checkIfSlugExists = async (slug: string, existingId?: string) => {
    setIsChecking(true);
    try {
      const exists = await checkSlugExists(slug, existingId);
      setSlugExists(exists);
      return exists;
    } catch (error) {
      console.error("Error checking slug:", error);
      return true;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    generateSlugFromTerm,
    checkIfSlugExists,
    generatedSlug,
    slugExists,
    isChecking
  };
}

export function useGlossaryCategoryFilter() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { terms, isLoading } = useGlossaryTerms();

  const availableCategories = isLoading 
    ? [] 
    : [...new Set(terms.flatMap(term => term.category || []))].sort();

  const filteredTerms = selectedCategories.length > 0
    ? terms.filter(term => 
        term.category && 
        term.category.some(cat => selectedCategories.includes(cat))
      )
    : terms;

  return {
    availableCategories,
    selectedCategories,
    setSelectedCategories,
    filteredTerms,
    isLoading
  };
}
