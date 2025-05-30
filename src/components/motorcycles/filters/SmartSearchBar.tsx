
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter, Sparkles } from "lucide-react";
import { MotorcycleFilters } from "@/types";

interface SmartSearchBarProps {
  filters: MotorcycleFilters;
  onFilterChange: (filters: MotorcycleFilters) => void;
  onSearch: (term: string) => void;
  placeholder?: string;
}

export default function SmartSearchBar({ 
  filters, 
  onFilterChange, 
  onSearch,
  placeholder = "Search motorcycles..." 
}: SmartSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Smart search suggestions based on common motorcycle terms
  const searchSuggestions = [
    "Honda CBR", "Yamaha R1", "Kawasaki Ninja", "Ducati Panigale",
    "BMW GS", "Harley Davidson", "KTM Duke", "Suzuki GSX",
    "beginner friendly", "under 300cc", "sport touring", "adventure bike",
    "cruiser", "naked bike", "cafe racer", "touring motorcycle",
    "ABS brakes", "liquid cooled", "fuel injection", "quick shifter",
    "traction control", "ride modes", "LED lights", "slipper clutch"
  ];

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchTerm.toLowerCase()) &&
        suggestion.toLowerCase() !== searchTerm.toLowerCase()
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    onSearch("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSmartFilter = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Smart filter detection and application
    if (lowerQuery.includes("beginner") || lowerQuery.includes("starter")) {
      onFilterChange({
        ...filters,
        isEntryLevel: true,
        difficultyLevel: 2,
        engineSizeRange: [0, 400]
      });
    } else if (lowerQuery.includes("sport") && !lowerQuery.includes("touring")) {
      onFilterChange({
        ...filters,
        categories: [...filters.categories, "Sport"]
      });
    } else if (lowerQuery.includes("touring")) {
      onFilterChange({
        ...filters,
        categories: [...filters.categories, "Touring"]
      });
    } else if (lowerQuery.includes("adventure")) {
      onFilterChange({
        ...filters,
        categories: [...filters.categories, "Adventure"]
      });
    } else if (lowerQuery.includes("cruiser")) {
      onFilterChange({
        ...filters,
        categories: [...filters.categories, "Cruiser"]
      });
    } else if (lowerQuery.includes("abs")) {
      onFilterChange({
        ...filters,
        abs: true
      });
    } else if (lowerQuery.match(/\d+cc/)) {
      const ccMatch = lowerQuery.match(/(\d+)cc/);
      if (ccMatch) {
        const cc = parseInt(ccMatch[1]);
        onFilterChange({
          ...filters,
          engineSizeRange: [cc - 50, cc + 50]
        });
      }
    }
  };

  const activeSearchFilters = [
    filters.searchTerm && { label: `Search: "${filters.searchTerm}"`, key: 'search' }
  ].filter(Boolean);

  return (
    <div className="relative space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          className="pl-10 pr-20 bg-background/50 backdrop-blur-sm border-border/50 focus:border-accent-teal/50"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleClearSearch}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleSmartFilter(searchTerm)}
            title="Apply smart filters based on search"
          >
            <Sparkles className="h-3 w-3" />
          </Button>
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-lg shadow-lg overflow-hidden">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Search className="inline h-3 w-3 mr-2 text-muted-foreground" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active Search Filters */}
      {activeSearchFilters.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {activeSearchFilters.map((filter, index) => (
            filter && (
              <Badge 
                key={filter.key}
                variant="secondary" 
                className="bg-accent-teal/20 text-accent-teal text-xs"
              >
                {filter.label}
                <button
                  onClick={handleClearSearch}
                  className="ml-1 hover:bg-accent-teal/20 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            )
          ))}
        </div>
      )}
    </div>
  );
}
