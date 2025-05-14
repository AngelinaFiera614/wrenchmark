
import React from "react";
import { Button } from "@/components/ui/button";
import { useFiltersContext } from "./FiltersContext";
import { toast } from "@/hooks/use-toast";

interface FilterResetProps {
  className?: string;
}

export default function FilterReset({ className }: FilterResetProps) {
  const { onFilterChange, filters } = useFiltersContext();
  
  const resetFilters = () => {
    // Reset all filters by passing empty/default values
    onFilterChange({
      ...filters,
      categories: [],
      make: "",
      yearRange: [1980, 2023],
      engineSizeRange: [0, 2000],
      difficultyLevel: 5,
      weightRange: [100, 400],
      seatHeightRange: [650, 950],
      styleTags: [],
      abs: null,
      searchTerm: ""
    });
    
    toast({
      title: "Filters reset",
      description: "All filters have been reset to their default values",
    });
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={className || "w-full"}
      onClick={resetFilters}
    >
      Reset Filters
    </Button>
  );
}
