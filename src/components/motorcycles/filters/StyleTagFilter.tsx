
import React from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import FilterSection from "@/components/common/FilterSection";

interface StyleTagFilterProps {
  tags: string[];
  selectedTags: string[];
  onChange: (tag: string, checked: boolean) => void;
}

export default function StyleTagFilter({
  tags,
  selectedTags,
  onChange
}: StyleTagFilterProps) {
  return (
    <FilterSection title="Style Tags">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Button
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(tag, !selectedTags.includes(tag))}
            className="text-xs"
          >
            {tag}
          </Button>
        ))}
      </div>
    </FilterSection>
  );
}
