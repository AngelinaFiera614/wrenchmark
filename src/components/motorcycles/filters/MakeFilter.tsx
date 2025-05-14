
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FilterSection from "./FilterSection";

interface MakeFilterProps {
  make: string;
  commonMakes: string[];
  onMakeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMakeSelect: (make: string) => void;
}

export default function MakeFilter({ 
  make, 
  commonMakes,
  onMakeChange,
  onMakeSelect
}: MakeFilterProps) {
  return (
    <FilterSection title="Make">
      <Input 
        placeholder="Search makes..." 
        value={make}
        onChange={onMakeChange}
      />
      <div className="grid grid-cols-1 gap-2">
        {commonMakes.slice(0, 6).map((make) => (
          <Button
            key={make}
            variant={make === make ? "default" : "outline"}
            size="sm"
            className="justify-start"
            onClick={() => onMakeSelect(make)}
          >
            {make}
          </Button>
        ))}
      </div>
    </FilterSection>
  );
}
