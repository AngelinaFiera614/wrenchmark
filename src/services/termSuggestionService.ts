
import { GlossaryTerm } from '@/types/glossary';

// Common motorcycle terminology for suggestions
const MOTORCYCLE_TERMS = [
  'engine', 'transmission', 'clutch', 'brake', 'suspension', 'frame', 'fuel system',
  'ignition', 'carburetor', 'throttle', 'exhaust', 'cooling system', 'electrical',
  'tires', 'wheels', 'chain', 'sprocket', 'handlebar', 'seat', 'tank', 'fairing',
  'windscreen', 'headlight', 'taillight', 'indicator', 'mirror', 'speedometer',
  'tachometer', 'gauge', 'switch', 'lever', 'pedal', 'kickstand', 'sidestand'
];

const CATEGORY_SUGGESTIONS = {
  engine: ['performance', 'maintenance', 'technical'],
  brake: ['safety', 'maintenance', 'technical'],
  suspension: ['comfort', 'performance', 'technical'],
  electrical: ['safety', 'maintenance', 'technical'],
  fuel: ['performance', 'maintenance', 'technical'],
  transmission: ['performance', 'maintenance', 'technical'],
  safety: ['gear', 'regulations', 'techniques'],
  maintenance: ['tools', 'schedule', 'procedures'],
};

export interface TermSuggestion {
  term: string;
  confidence: number;
  reason: string;
  categories?: string[];
  definition?: string;
}

export interface DefinitionTemplate {
  template: string;
  placeholders: string[];
}

class TermSuggestionService {
  // Calculate similarity between two strings using Levenshtein distance
  private calculateSimilarity(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : (maxLength - matrix[str2.length][str1.length]) / maxLength;
  }

  // Generate term suggestions based on input
  generateTermSuggestions(
    input: string, 
    existingTerms: GlossaryTerm[]
  ): TermSuggestion[] {
    const suggestions: TermSuggestion[] = [];
    const inputLower = input.toLowerCase().trim();

    if (inputLower.length < 2) return suggestions;

    // Check for similar existing terms
    existingTerms.forEach(term => {
      const similarity = this.calculateSimilarity(inputLower, term.term.toLowerCase());
      if (similarity > 0.6 && similarity < 0.95) {
        suggestions.push({
          term: term.term,
          confidence: similarity,
          reason: 'Similar to existing term',
          categories: term.category,
        });
      }
    });

    // Check against common motorcycle terms
    MOTORCYCLE_TERMS.forEach(term => {
      if (term.includes(inputLower) || inputLower.includes(term)) {
        const similarity = this.calculateSimilarity(inputLower, term);
        if (similarity > 0.4) {
          suggestions.push({
            term,
            confidence: similarity * 0.8, // Lower confidence for general terms
            reason: 'Common motorcycle term',
            categories: this.inferCategories(term),
          });
        }
      }
    });

    // Check for compound terms
    if (inputLower.includes(' ')) {
      const words = inputLower.split(' ');
      words.forEach(word => {
        if (MOTORCYCLE_TERMS.includes(word)) {
          suggestions.push({
            term: input,
            confidence: 0.6,
            reason: `Contains motorcycle term: ${word}`,
            categories: this.inferCategories(word),
          });
        }
      });
    }

    // Sort by confidence and remove duplicates
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .filter((suggestion, index, self) => 
        index === self.findIndex(s => s.term.toLowerCase() === suggestion.term.toLowerCase())
      )
      .slice(0, 5);
  }

  // Infer categories based on term content
  private inferCategories(term: string): string[] {
    const termLower = term.toLowerCase();
    const categories: string[] = [];

    Object.entries(CATEGORY_SUGGESTIONS).forEach(([key, cats]) => {
      if (termLower.includes(key)) {
        categories.push(...cats);
      }
    });

    // Default categories based on common patterns
    if (termLower.includes('system')) categories.push('technical');
    if (termLower.includes('safety') || termLower.includes('protection')) categories.push('safety');
    if (termLower.includes('maintenance') || termLower.includes('service')) categories.push('maintenance');
    if (termLower.includes('performance') || termLower.includes('power')) categories.push('performance');

    return [...new Set(categories)];
  }

  // Generate definition templates based on term type
  generateDefinitionTemplate(term: string, categories: string[]): DefinitionTemplate | null {
    const termLower = term.toLowerCase();

    // Engine-related terms
    if (termLower.includes('engine') || categories.includes('performance')) {
      return {
        template: "A {component_type} that {primary_function}. {additional_details}",
        placeholders: ['component_type', 'primary_function', 'additional_details']
      };
    }

    // Safety-related terms
    if (categories.includes('safety') || termLower.includes('safety')) {
      return {
        template: "A safety {item_type} designed to {protection_purpose}. {usage_context}",
        placeholders: ['item_type', 'protection_purpose', 'usage_context']
      };
    }

    // System-related terms
    if (termLower.includes('system')) {
      return {
        template: "A system of {components} that work together to {system_purpose}. {operation_details}",
        placeholders: ['components', 'system_purpose', 'operation_details']
      };
    }

    // General motorcycle part
    return {
      template: "A motorcycle {component_type} that {primary_function}. {technical_details}",
      placeholders: ['component_type', 'primary_function', 'technical_details']
    };
  }

  // Check for potential duplicates
  checkForDuplicates(term: string, existingTerms: GlossaryTerm[]): GlossaryTerm[] {
    const termLower = term.toLowerCase().trim();
    return existingTerms.filter(existing => {
      const similarity = this.calculateSimilarity(termLower, existing.term.toLowerCase());
      return similarity > 0.8; // High similarity threshold for duplicates
    });
  }

  // Generate category suggestions based on term content and existing categories
  generateCategorySuggestions(
    term: string, 
    definition: string, 
    existingCategories: string[]
  ): string[] {
    const suggestions = new Set<string>();
    const content = `${term} ${definition}`.toLowerCase();

    // Add inferred categories from term
    this.inferCategories(term).forEach(cat => suggestions.add(cat));

    // Add categories based on definition content
    Object.entries(CATEGORY_SUGGESTIONS).forEach(([key, cats]) => {
      if (content.includes(key)) {
        cats.forEach(cat => suggestions.add(cat));
      }
    });

    // Add popular existing categories
    const popularCategories = existingCategories
      .reduce((acc, cat) => {
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    Object.entries(popularCategories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .forEach(([cat]) => suggestions.add(cat));

    return Array.from(suggestions).slice(0, 8);
  }
}

export const termSuggestionService = new TermSuggestionService();
