
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { RidingSkillLevel, RidingSkillCategory } from "@/types/riding-skills";

interface RidingSkillFilterProps {
  onFilterChange: (filters: {
    search: string;
    levels: RidingSkillLevel[];
    categories: string[];
  }) => void;
}

const levels: RidingSkillLevel[] = ["Beginner", "Intermediate", "Advanced"];

const categories: RidingSkillCategory[] = [
  "Parking lot",
  "Low-speed",
  "Highway",
  "Off-road",
  "Emergency",
  "City",
  "Advanced control"
];

const RidingSkillFilter = ({ onFilterChange }: RidingSkillFilterProps) => {
  const [search, setSearch] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<RidingSkillLevel[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    onFilterChange({
      search,
      levels: selectedLevels,
      categories: selectedCategories,
    });
  }, [search, selectedLevels, selectedCategories, onFilterChange]);

  const toggleLevel = (level: RidingSkillLevel) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level) 
        : [...prev, level]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedLevels([]);
    setSelectedCategories([]);
  };

  const hasActiveFilters = search || selectedLevels.length > 0 || selectedCategories.length > 0;

  return (
    <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-background"
        />
      </div>
      
      <div>
        <p className="text-sm font-medium mb-2">Level</p>
        <div className="flex flex-wrap gap-2">
          {levels.map(level => (
            <Badge
              key={level}
              variant={selectedLevels.includes(level) ? "default" : "outline"}
              className={`cursor-pointer hover:bg-accent-teal/20 ${
                selectedLevels.includes(level) ? "bg-accent-teal text-black" : ""
              }`}
              onClick={() => toggleLevel(level)}
            >
              {level}
            </Badge>
          ))}
        </div>
      </div>
      
      <div>
        <p className="text-sm font-medium mb-2">Category</p>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              className={`cursor-pointer hover:bg-accent-teal/20 ${
                selectedCategories.includes(category) ? "bg-accent-teal text-black" : ""
              }`}
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
      
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs flex items-center"
          onClick={resetFilters}
        >
          <X className="h-3 w-3 mr-1" />
          Reset filters
        </Button>
      )}
    </div>
  );
};

export default RidingSkillFilter;
