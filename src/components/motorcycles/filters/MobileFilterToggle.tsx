
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, ChevronUp } from "lucide-react";
import {
  CollapsibleTrigger
} from "@/components/ui/collapsible";

interface MobileFilterToggleProps {
  isOpen: boolean;
}

export default function MobileFilterToggle({ isOpen }: MobileFilterToggleProps) {
  return (
    <CollapsibleTrigger asChild>
      <Button variant={isOpen ? "outline" : "ghost"} size="sm" className="gap-2">
        {isOpen ? (
          <>
            <ChevronUp className="h-4 w-4" />
            Hide Filters
          </>
        ) : (
          <>
            <Filter className="h-4 w-4" />
            Filters
          </>
        )}
      </Button>
    </CollapsibleTrigger>
  );
}
