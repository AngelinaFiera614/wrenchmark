
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
    <div className="flex items-center justify-between md:hidden mb-4">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full space-y-4"
      >
        <div className="flex items-center justify-between bg-background/90 sticky top-16 z-20 py-2">
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal">
                {activeFilterCount} active
              </Badge>
            )}
          </div>
          <MobileFilterToggle isOpen={isOpen} />
        </div>
        
        <CollapsibleContent className="space-y-6 animate-slide-in-bottom bg-background/95 backdrop-blur p-4 rounded-lg border border-border/20">
          <div className="space-y-6">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <WeightFilter
                weightRange={filters.weightRange}
                onChange={handleWeightRangeChange}
              />

              <SeatHeightFilter
                seatHeightRange={filters.seatHeightRange}
                onChange={handleSeatHeightRangeChange}
              />
            </div>

            <YearFilter
              yearRange={filters.yearRange}
              onChange={handleYearRangeChange}
            />

            <AbsFilter
              checked={filters.abs === true}
              onChange={handleAbsChange}
              id="abs-mobile"
            />

            <div className="sticky bottom-0 pt-4 pb-2 bg-background">
              <FilterReset />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
