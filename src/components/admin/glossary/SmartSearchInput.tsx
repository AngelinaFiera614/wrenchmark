
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Clock } from 'lucide-react';
import { GlossaryTerm } from '@/types/glossary';

interface SmartSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  terms: GlossaryTerm[];
  placeholder?: string;
}

export function SmartSearchInput({
  value,
  onChange,
  terms,
  placeholder = "Search terms, definitions, categories..."
}: SmartSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('glossary-search-history');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse search history:', error);
      }
    }
  }, []);

  // Generate suggestions based on current input
  const suggestions = React.useMemo(() => {
    if (!value.trim()) return [];
    
    const searchTerm = value.toLowerCase();
    const termSuggestions = terms
      .filter(term => 
        term.term.toLowerCase().includes(searchTerm) ||
        term.definition.toLowerCase().includes(searchTerm) ||
        term.category?.some(cat => cat.toLowerCase().includes(searchTerm))
      )
      .slice(0, 5)
      .map(term => ({
        type: 'term' as const,
        value: term.term,
        secondary: term.definition.substring(0, 60) + '...'
      }));

    const categorySuggestions = [...new Set(
      terms.flatMap(term => term.category || [])
        .filter(cat => cat.toLowerCase().includes(searchTerm))
    )]
      .slice(0, 3)
      .map(category => ({
        type: 'category' as const,
        value: `category:${category}`,
        secondary: 'Search in category'
      }));

    return [...termSuggestions, ...categorySuggestions];
  }, [value, terms]);

  // Handle search submission
  const handleSearch = (searchValue: string) => {
    if (searchValue.trim()) {
      const newHistory = [searchValue, ...searchHistory.filter(h => h !== searchValue)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('glossary-search-history', JSON.stringify(newHistory));
    }
    onChange(searchValue);
    setIsOpen(false);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: { value: string; type: string }) => {
    handleSearch(suggestion.value);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(value);
            } else if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          className="pl-10 pr-10"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isOpen && (suggestions.length > 0 || searchHistory.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-lg max-h-64 overflow-y-auto"
        >
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2">Suggestions</div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left p-2 hover:bg-accent rounded-sm transition-colors"
                >
                  <div className="font-medium text-sm">{suggestion.value}</div>
                  {suggestion.secondary && (
                    <div className="text-xs text-muted-foreground">{suggestion.secondary}</div>
                  )}
                </button>
              ))}
            </div>
          )}

          {searchHistory.length > 0 && !value && (
            <div className="p-2 border-t">
              <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Recent Searches
              </div>
              {searchHistory.slice(0, 5).map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(item)}
                  className="w-full text-left p-2 hover:bg-accent rounded-sm transition-colors text-sm"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
