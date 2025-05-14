
import { useState } from "react";
import { MotorcycleCategory, MotorcycleFilters } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const categories: MotorcycleCategory[] = [
  "Sport",
  "Cruiser",
  "Touring",
  "Adventure",
  "Naked",
  "Dual-sport",
  "Standard",
  "Scooter",
  "Off-road",
];

const commonMakes = [
  "Honda",
  "Yamaha",
  "Kawasaki",
  "Suzuki",
  "Harley-Davidson",
  "BMW",
  "Ducati",
  "Triumph",
  "KTM",
  "Royal Enfield",
];

interface MotorcycleFiltersProps {
  filters: MotorcycleFilters;
  onFilterChange: (filters: MotorcycleFilters) => void;
}

export default function MotorcycleFilters({ 
  filters, 
  onFilterChange 
}: MotorcycleFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryChange = (category: MotorcycleCategory, checked: boolean) => {
    const updatedCategories = checked 
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFilterChange({
      ...filters,
      categories: updatedCategories
    });
  };

  const handleMakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      make: e.target.value
    });
  };

  const handleYearRangeChange = (values: number[]) => {
    onFilterChange({
      ...filters,
      yearRange: [values[0], values[1]] as [number, number]
    });
  };

  const handleEngineRangeChange = (values: number[]) => {
    onFilterChange({
      ...filters,
      engineSizeRange: [values[0], values[1]] as [number, number]
    });
  };

  const handleDifficultyChange = (values: number[]) => {
    onFilterChange({
      ...filters,
      difficultyLevel: values[0]
    });
  };

  const handleAbsChange = (checked: boolean) => {
    onFilterChange({
      ...filters,
      abs: checked ? true : null
    });
  };

  const handleReset = () => {
    onFilterChange({
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
  };

  return (
    <div className="sticky top-[4.5rem] space-y-4 py-4">
      <div className="flex items-center justify-between md:hidden">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filters</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {isOpen ? "Hide Filters" : "Show Filters"}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Make</h4>
                <Input 
                  placeholder="Search makes..." 
                  value={filters.make}
                  onChange={handleMakeChange}
                />
                <div className="grid grid-cols-2 gap-2">
                  {commonMakes.slice(0, 6).map((make) => (
                    <Button
                      key={make}
                      variant={filters.make === make ? "default" : "outline"}
                      size="sm"
                      className="justify-start"
                      onClick={() => onFilterChange({ ...filters, make })}
                    >
                      {make}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Categories</h4>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category}`} 
                        checked={filters.categories.includes(category)}
                        onCheckedChange={(checked) => 
                          handleCategoryChange(category, checked as boolean)
                        }
                      />
                      <Label htmlFor={`category-${category}`}>{category}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Engine Size</h4>
                <div className="px-2">
                  <Slider 
                    defaultValue={[
                      filters.engineSizeRange[0], 
                      filters.engineSizeRange[1]
                    ]} 
                    max={2000} 
                    step={50}
                    onValueChange={handleEngineRangeChange}
                  />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{filters.engineSizeRange[0]} cc</span>
                    <span>{filters.engineSizeRange[1]} cc</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Difficulty Level</h4>
                <div className="px-2">
                  <Slider 
                    defaultValue={[filters.difficultyLevel]} 
                    max={5} 
                    step={1}
                    onValueChange={handleDifficultyChange}
                  />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Beginner</span>
                    <span>Expert</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="abs"
                  checked={filters.abs === true}
                  onCheckedChange={handleAbsChange}
                />
                <Label htmlFor="abs">ABS Equipped</Label>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleReset}
              >
                Reset Filters
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Desktop filters - always visible */}
      <div className="hidden md:block space-y-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Make</h4>
            <Input 
              placeholder="Search makes..." 
              value={filters.make}
              onChange={handleMakeChange}
            />
            <div className="grid grid-cols-1 gap-2">
              {commonMakes.slice(0, 6).map((make) => (
                <Button
                  key={make}
                  variant={filters.make === make ? "default" : "outline"}
                  size="sm"
                  className="justify-start"
                  onClick={() => onFilterChange({ ...filters, make })}
                >
                  {make}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Categories</h4>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-desktop-${category}`} 
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category, checked as boolean)
                    }
                  />
                  <Label htmlFor={`category-desktop-${category}`}>{category}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Engine Size</h4>
            <div className="px-2">
              <Slider 
                defaultValue={[
                  filters.engineSizeRange[0], 
                  filters.engineSizeRange[1]
                ]} 
                max={2000} 
                step={50}
                onValueChange={handleEngineRangeChange}
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{filters.engineSizeRange[0]} cc</span>
                <span>{filters.engineSizeRange[1]} cc</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Difficulty Level</h4>
            <div className="px-2">
              <Slider 
                defaultValue={[filters.difficultyLevel]} 
                max={5} 
                step={1}
                onValueChange={handleDifficultyChange}
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="abs-desktop"
              checked={filters.abs === true}
              onCheckedChange={handleAbsChange}
            />
            <Label htmlFor="abs-desktop">ABS Equipped</Label>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleReset}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
