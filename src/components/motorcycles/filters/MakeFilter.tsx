
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FilterSection from "./FilterSection";
import FilterReset from "./FilterReset";

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
  const hasActiveMake = !!make;

  return (
    <FilterSection 
      title="Make" 
      action={hasActiveMake ? 
        <FilterReset filterType="make" /> : 
        undefined
      }
    >
      <div className="relative">
        <Input 
          placeholder="Search makes..." 
          value={make}
          onChange={onMakeChange}
          className="text-foreground"
        />
        {make && (
          <Badge 
            className="absolute right-2 top-2 bg-primary text-xs"
          >
            Active
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {commonMakes.slice(0, 6).map((commonMake) => (
          <Button
            key={commonMake}
            variant={commonMake.toLowerCase() === make.toLowerCase() ? "default" : "outline"}
            size="sm"
            className="justify-start text-xs"
            onClick={() => onMakeSelect(commonMake)}
          >
            {commonMake}
          </Button>
        ))}
      </div>
    </FilterSection>
  );
}
