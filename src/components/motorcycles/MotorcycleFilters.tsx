
import { useState } from "react";
import type { MotorcycleCategory } from "@/types";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";

// Import our filter components
import CategoryFilter from "./filters/CategoryFilter";
import MakeFilter from "./filters/MakeFilter";
import RangeFilter from "./filters/RangeFilter";
import AbsFilter from "./filters/AbsFilter";
import ResetButton from "./filters/ResetButton";
import MobileFilterToggle from "./filters/MobileFilterToggle";

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
  filters: import("@/types").MotorcycleFilters;
  onFilterChange: (filters: import("@/types").MotorcycleFilters) => void;
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

  const handleMakeSelect = (make: string) => {
    onFilterChange({ ...filters, make });
  };

  return (
    <div className="sticky top-[4.5rem] space-y-4 py-4">
      {/* Mobile filters */}
      <div className="flex items-center justify-between md:hidden">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filters</h3>
            <MobileFilterToggle isOpen={isOpen} />
          </div>
          
          <CollapsibleContent className="space-y-4">
            <div className="space-y-4">
              <MakeFilter 
                make={filters.make} 
                commonMakes={commonMakes} 
                onMakeChange={handleMakeChange} 
                onMakeSelect={handleMakeSelect}
              />

              <CategoryFilter 
                categories={categories}
                selectedCategories={filters.categories}
                onChange={handleCategoryChange}
                isMobile={true}
              />

              <RangeFilter
                title="Engine Size"
                min={0}
                max={2000}
                step={50}
                value={[filters.engineSizeRange[0], filters.engineSizeRange[1]]}
                onChange={handleEngineRangeChange}
                valueFormatter={(v) => `${v} cc`}
              />

              <RangeFilter
                title="Difficulty Level"
                min={1}
                max={5}
                step={1}
                value={[filters.difficultyLevel]}
                onChange={handleDifficultyChange}
                labelStart="Beginner"
                labelEnd="Expert"
              />

              <AbsFilter
                checked={filters.abs === true}
                onChange={handleAbsChange}
                id="abs"
              />

              <ResetButton onReset={handleReset} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Desktop filters - always visible */}
      <div className="hidden md:block space-y-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        
        <div className="space-y-4">
          <MakeFilter 
            make={filters.make} 
            commonMakes={commonMakes} 
            onMakeChange={handleMakeChange}
            onMakeSelect={handleMakeSelect}
          />

          <CategoryFilter 
            categories={categories}
            selectedCategories={filters.categories}
            onChange={handleCategoryChange}
          />

          <RangeFilter
            title="Engine Size"
            min={0}
            max={2000}
            step={50}
            value={[filters.engineSizeRange[0], filters.engineSizeRange[1]]}
            onChange={handleEngineRangeChange}
            valueFormatter={(v) => `${v} cc`}
          />

          <RangeFilter
            title="Difficulty Level"
            min={1}
            max={5}
            step={1}
            value={[filters.difficultyLevel]}
            onChange={handleDifficultyChange}
            labelStart="Beginner"
            labelEnd="Expert"
          />

          <AbsFilter
            checked={filters.abs === true}
            onChange={handleAbsChange}
            id="abs-desktop"
          />

          <ResetButton onReset={handleReset} />
        </div>
      </div>
    </div>
  );
}
