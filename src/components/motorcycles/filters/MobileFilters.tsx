
import { useState } from "react";
import { 
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import type { MotorcycleCategory, MotorcycleFilters as FiltersType } from "@/types";
import { useFilterHandlers } from "@/hooks/useFilterHandlers";
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
  activeFilterCount?: number;
}

export default function MobileFilters({ 
  filters, 
  onFilterChange,
  categories,
  commonMakes,
  activeFilterCount = 0
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    handleCategoryChange,
    handleMakeChange,
    handleMakeSelect,
    handleYearRangeChange,
    handleEngineRangeChange,
    handleDifficultyChange,
    handleWeightRangeChange,
    handleSeatHeightRangeChange,
    handleAbsChange
  } = useFilterHandlers(filters, onFilterChange);

  return (
    <div className="flex items-center justify-between md:hidden">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Removed the duplicate "Filters" text */}
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilterCount}
              </Badge>
            )}
          </div>
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
              id="abs-mobile"
            />

            <FilterReset />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
