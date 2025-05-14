
import React from "react";
import { Button } from "@/components/ui/button";
import { useMotorcycleFilters } from "@/hooks/useMotorcycleFilters";

interface FilterResetProps {
  className?: string;
}

export default function FilterReset({ className }: FilterResetProps) {
  const { resetFilters } = useMotorcycleFilters([]);

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
