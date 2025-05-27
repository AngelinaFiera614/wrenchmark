
import React from "react";
import { Button } from "@/components/ui/button";
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
            variant={selectedTags.includes(tag) ? "teal" : "outline"}
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
