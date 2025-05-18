
import { useQuery } from "@tanstack/react-query";
import { fetchGlossaryTerms, fetchGlossaryTermBySlug, generateUniqueSlug } from "@/services/glossaryService";
import { useState } from "react";
import { checkSlugExists } from "@/services/glossaryService";

export function useGlossaryTerms() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["glossaryTerms"],
    queryFn: fetchGlossaryTerms
  });

  return {
    terms: data || [],
    isLoading,
    error
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
