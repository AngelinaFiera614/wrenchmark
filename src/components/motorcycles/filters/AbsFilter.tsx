
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import FilterReset from "./FilterReset";

interface AbsFilterProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

export default function AbsFilter({ checked, onChange, id = "abs" }: AbsFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
      />
      <Label 
        htmlFor={id}
        className={checked ? "font-medium" : ""}
      >
        ABS Equipped
      </Label>
      
      {checked && (
        <>
          <Badge variant="outline" className="ml-auto text-xs">
            Active
          </Badge>
          <FilterReset filterType="abs" />
        </>
      )}
    </div>
  );
}
