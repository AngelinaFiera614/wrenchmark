
import React from "react";
import { Button } from "@/components/ui/button";
import { useFiltersContext } from "./FiltersContext";
import { toast } from "@/hooks/use-toast";
import { initialFilters } from "@/hooks/useMotorcycleFilters";
import { countActiveFilters } from "@/lib/filter-utils";
import { X } from "lucide-react";

interface FilterResetProps {
  className?: string;
  filterType?: "all" | "categories" | "make" | "engineSize" | "difficulty" | 
                "weight" | "seatHeight" | "year" | "abs" | "search";
  label?: string;
}

export default function FilterReset({ 
  className, 
  filterType = "all",
  label 
}: FilterResetProps) {
  const { onFilterChange, filters } = useFiltersContext();
  
  const resetFilters = () => {
    // Reset specific filter or all filters
    switch(filterType) {
      case "categories":
        onFilterChange({ ...filters, categories: [] });
        toast({ description: "Categories filter reset" });
        break;
      case "make":
        onFilterChange({ ...filters, make: "" });
        toast({ description: "Make filter reset" });
        break;
      case "engineSize":
        onFilterChange({ ...filters, engineSizeRange: initialFilters.engineSizeRange });
        toast({ description: "Engine size filter reset" });
        break;
      case "difficulty":
        onFilterChange({ ...filters, difficultyLevel: initialFilters.difficultyLevel });
        toast({ description: "Difficulty filter reset" });
        break;
      case "weight":
        onFilterChange({ ...filters, weightRange: initialFilters.weightRange });
        toast({ description: "Weight filter reset" });
        break;
      case "seatHeight":
        onFilterChange({ ...filters, seatHeightRange: initialFilters.seatHeightRange });
        toast({ description: "Seat height filter reset" });
        break;
      case "year":
        onFilterChange({ ...filters, yearRange: initialFilters.yearRange });
        toast({ description: "Year filter reset" });
        break;
      case "abs":
        onFilterChange({ ...filters, abs: null });
        toast({ description: "ABS filter reset" });
        break;
      case "search":
        onFilterChange({ ...filters, searchTerm: "" });
        toast({ description: "Search term cleared" });
        break;
      case "all":
      default:
        onFilterChange({
          ...filters,
          categories: [],
          make: "",
          yearRange: initialFilters.yearRange,
          engineSizeRange: initialFilters.engineSizeRange,
          difficultyLevel: initialFilters.difficultyLevel,
          weightRange: initialFilters.weightRange,
          seatHeightRange: initialFilters.seatHeightRange,
          styleTags: [],
          abs: null,
          searchTerm: ""
        });
        toast({
          title: "Filters reset",
          description: "All filters have been reset to their default values",
        });
        break;
    }
  };

  // For "all" filter reset, show the count of active filters
  const activeFilters = filterType === 'all' ? countActiveFilters(filters) : 0;
  const buttonLabel = label || (filterType === 'all' 
    ? `Reset Filters${activeFilters > 0 ? ` (${activeFilters})` : ''}`
    : 'Reset');

  return (
    <Button 
      variant={filterType === 'all' ? "outline" : "ghost"}
      size={filterType === 'all' ? "sm" : "icon"}
      className={className || (filterType === 'all' ? "w-full" : "h-6 w-6 p-0")}
      onClick={resetFilters}
      disabled={filterType === 'all' ? activeFilters === 0 : false}
    >
      {filterType === 'all' 
        ? buttonLabel
        : <X className="h-3 w-3" />
      }
    </Button>
  );
}
