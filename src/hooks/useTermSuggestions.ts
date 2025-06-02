
import { useState, useEffect, useMemo } from 'react';
import { GlossaryTerm } from '@/types/glossary';
import { termSuggestionService, TermSuggestion } from '@/services/termSuggestionService';

export function useTermSuggestions(
  termInput: string,
  definitionInput: string,
  existingTerms: GlossaryTerm[],
  currentTermId?: string
) {
  const [suggestions, setSuggestions] = useState<TermSuggestion[]>([]);
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);
  const [duplicates, setDuplicates] = useState<GlossaryTerm[]>([]);

  // Filter out current term from existing terms
  const filteredExistingTerms = useMemo(() => {
    return existingTerms.filter(term => term.id !== currentTermId);
  }, [existingTerms, currentTermId]);

  // Generate term suggestions
  useEffect(() => {
    if (termInput.length >= 2) {
      const termSuggestions = termSuggestionService.generateTermSuggestions(
        termInput,
        filteredExistingTerms
      );
      setSuggestions(termSuggestions);

      // Check for duplicates
      const potentialDuplicates = termSuggestionService.checkForDuplicates(
        termInput,
        filteredExistingTerms
      );
      setDuplicates(potentialDuplicates);
    } else {
      setSuggestions([]);
      setDuplicates([]);
    }
  }, [termInput, filteredExistingTerms]);

  // Generate category suggestions
  useEffect(() => {
    if (termInput.length >= 2 || definitionInput.length >= 10) {
      const existingCategories = filteredExistingTerms.flatMap(term => term.category || []);
      const catSuggestions = termSuggestionService.generateCategorySuggestions(
        termInput,
        definitionInput,
        existingCategories
      );
      setCategorySuggestions(catSuggestions);
    } else {
      setCategorySuggestions([]);
    }
  }, [termInput, definitionInput, filteredExistingTerms]);

  // Generate definition template
  const definitionTemplate = useMemo(() => {
    if (termInput.length >= 2) {
      const categories = categorySuggestions;
      return termSuggestionService.generateDefinitionTemplate(termInput, categories);
    }
    return null;
  }, [termInput, categorySuggestions]);

  return {
    suggestions,
    categorySuggestions,
    duplicates,
    definitionTemplate,
  };
}
