
import { useState } from "react";
import { 
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import type { MotorcycleCategory, MotorcycleFilters as FiltersType } from "@/types";
import CategoryFilter from "./CategoryFilter";
import MakeFilter from "./MakeFilter";
import EngineFilter from "./EngineFilter";
import DifficultyFilter from "./DifficultyFilter";
import WeightFilter from "./WeightFilter";
import SeatHeightFilter from "./SeatHeightFilter";
import YearFilter from "./YearFilter";
import AbsFilter from "./AbsFilter";
import FilterReset from "./FilterReset";
import MobileFilterToggle from "./MobileFilterToggle";

interface MobileFiltersProps {
  filters: FiltersType;
  onFilterChange: (filters: FiltersType) => void;
  categories: MotorcycleCategory[];
  commonMakes: string[];
}

export default function MobileFilters({ 
  filters, 
  onFilterChange,
  categories,
  commonMakes
}: MobileFiltersProps) {
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

  const handleMakeSelect = (make: string) => {
    onFilterChange({ ...filters, make });
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

  const handleWeightRangeChange = (values: number[]) => {
    onFilterChange({
      ...filters,
      weightRange: [values[0], values[1]] as [number, number]
    });
  };

  const handleSeatHeightRangeChange = (values: number[]) => {
    onFilterChange({
      ...filters,
      seatHeightRange: [values[0], values[1]] as [number, number]
    });
  };

  const handleAbsChange = (checked: boolean) => {
    onFilterChange({
      ...filters,
      abs: checked ? true : null
    });
  };

  return (
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

            <EngineFilter
              engineSizeRange={filters.engineSizeRange}
              onChange={handleEngineRangeChange}
            />

            <DifficultyFilter
              difficultyLevel={filters.difficultyLevel}
              onChange={handleDifficultyChange}
            />

            <WeightFilter
              weightRange={filters.weightRange}
              onChange={handleWeightRangeChange}
            />

            <SeatHeightFilter
              seatHeightRange={filters.seatHeightRange}
              onChange={handleSeatHeightRangeChange}
            />

            <YearFilter
              yearRange={filters.yearRange}
              onChange={handleYearRangeChange}
            />

            <AbsFilter
              checked={filters.abs === true}
              onChange={handleAbsChange}
              id="abs"
            />

            <FilterReset />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
