
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, X, Clock, Star, Filter, ChevronDown } from "lucide-react";
import { Motorcycle } from "@/types";

interface SearchSuggestion {
  type: 'make' | 'model' | 'category' | 'recent' | 'saved';
  value: string;
  count?: number;
  icon?: React.ReactNode;
}

interface EnhancedMotorcycleSearchProps {
  motorcycles: Motorcycle[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAdvancedToggle: () => void;
  isAdvancedOpen: boolean;
  activeFiltersCount: number;
  recentSearches?: string[];
  savedSearches?: Array<{ name: string; query: string }>;
}

const EnhancedMotorcycleSearch = ({
  motorcycles,
  searchTerm,
  onSearchChange,
  onAdvancedToggle,
  isAdvancedOpen,
  activeFiltersCount,
  recentSearches = [],
  savedSearches = []
}: EnhancedMotorcycleSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate search suggestions
  useEffect(() => {
    if (!searchTerm) {
      const recentSuggestions: SearchSuggestion[] = recentSearches.map(search => ({
        type: 'recent',
        value: search,
        icon: <Clock className="h-4 w-4" />
      }));

      const savedSuggestions: SearchSuggestion[] = savedSearches.map(search => ({
        type: 'saved',
        value: search.name,
        icon: <Star className="h-4 w-4" />
      }));

      setSuggestions([...savedSuggestions, ...recentSuggestions]);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const newSuggestions: SearchSuggestion[] = [];

    // Make suggestions
    const makes = Array.from(new Set(motorcycles.map(m => m.make).filter(Boolean)))
      .filter(make => make!.toLowerCase().includes(searchLower))
      .slice(0, 3)
      .map(make => ({
        type: 'make' as const,
        value: make!,
        count: motorcycles.filter(m => m.make === make).length
      }));

    // Model suggestions
    const models = Array.from(new Set(motorcycles.map(m => m.model).filter(Boolean)))
      .filter(model => model!.toLowerCase().includes(searchLower))
      .slice(0, 3)
      .map(model => ({
        type: 'model' as const,
        value: model!,
        count: motorcycles.filter(m => m.model === model).length
      }));

    // Category suggestions
    const categories = Array.from(new Set(motorcycles.map(m => m.category).filter(Boolean)))
      .filter(category => category!.toLowerCase().includes(searchLower))
      .slice(0, 2)
      .map(category => ({
        type: 'category' as const,
        value: category!,
        count: motorcycles.filter(m => m.category === category).length
      }));

    newSuggestions.push(...makes, ...models, ...categories);
    setSuggestions(newSuggestions);
  }, [searchTerm, motorcycles, recentSearches, savedSearches]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          onSearchChange(suggestions[selectedIndex].value);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onSearchChange(suggestion.value);
    setIsOpen(false);
  };

  const clearSearch = () => {
    onSearchChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-explorer-text-muted h-4 w-4" />
          <Input
            ref={inputRef}
            placeholder="Search motorcycles by make, model, or category..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            className="pl-10 pr-20 bg-explorer-dark border-explorer-chrome/30 text-explorer-text h-11"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="h-7 w-7 p-0 hover:bg-explorer-chrome/20"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onAdvancedToggle}
              className={`h-7 px-2 ${isAdvancedOpen ? 'bg-accent-teal/20 text-accent-teal' : 'hover:bg-explorer-chrome/20'}`}
            >
              <Filter className="h-3 w-3 mr-1" />
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="h-4 px-1 text-xs bg-accent-teal text-black">
                  {activeFiltersCount}
                </Badge>
              )}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>

        {/* Search Suggestions */}
        {isOpen && suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 bg-explorer-card border-explorer-chrome/30 shadow-lg">
            <CardContent className="p-2">
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={`${suggestion.type}-${suggestion.value}`}
                    className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded ${
                      index === selectedIndex 
                        ? 'bg-accent-teal/20 text-accent-teal' 
                        : 'hover:bg-explorer-chrome/10'
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.icon}
                    <span className="flex-1 text-sm">{suggestion.value}</span>
                    {suggestion.count && (
                      <Badge variant="outline" className="text-xs">
                        {suggestion.count}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs capitalize">
                      {suggestion.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Search Results Summary */}
      {searchTerm && (
        <div className="text-sm text-explorer-text-muted">
          Searching in: <span className="text-accent-teal">make, model, category</span>
        </div>
      )}
    </div>
  );
};

export default EnhancedMotorcycleSearch;
