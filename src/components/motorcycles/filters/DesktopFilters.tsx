
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

interface DesktopFiltersProps {
  filters: FiltersType;
  onFilterChange: (filters: FiltersType) => void;
  categories: MotorcycleCategory[];
  commonMakes: string[];
}

export default function DesktopFilters({ 
  filters, 
  onFilterChange,
  categories,
  commonMakes
}: DesktopFiltersProps) {
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
          id="abs-desktop"
        />

        <FilterReset />
      </div>
    </div>
  );
}
