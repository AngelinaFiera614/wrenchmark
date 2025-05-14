
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  CollapsibleTrigger
} from "@/components/ui/collapsible";

interface MobileFilterToggleProps {
  isOpen: boolean;
}

export default function MobileFilterToggle({ isOpen }: MobileFilterToggleProps) {
  return (
    <CollapsibleTrigger asChild>
      <Button variant="ghost" size="sm">
        <Filter className="h-4 w-4 mr-2" />
        {isOpen ? "Hide Filters" : "Show Filters"}
      </Button>
    </CollapsibleTrigger>
  );
}
