
import { useCallback } from "react";
import { MotorcycleCategory, MotorcycleFilters } from "@/types";

export function useFilterHandlers(
  filters: MotorcycleFilters,
  onFilterChange: (filters: MotorcycleFilters) => void
) {
  const handleCategoryChange = useCallback(
    (category: MotorcycleCategory, checked: boolean) => {
      const updatedCategories = checked
        ? [...filters.categories, category]
        : filters.categories.filter((c) => c !== category);

      onFilterChange({
        ...filters,
        categories: updatedCategories,
      });
    },
    [filters, onFilterChange]
  );

  const handleMakeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFilterChange({
        ...filters,
        make: e.target.value,
      });
    },
    [filters, onFilterChange]
  );

  const handleMakeSelect = useCallback(
    (make: string) => {
      onFilterChange({ ...filters, make });
    },
    [filters, onFilterChange]
  );

  const handleYearRangeChange = useCallback(
    (values: number[]) => {
      onFilterChange({
        ...filters,
        yearRange: [values[0], values[1]] as [number, number],
      });
    },
    [filters, onFilterChange]
  );

  const handleEngineRangeChange = useCallback(
    (values: number[]) => {
      onFilterChange({
        ...filters,
        engineSizeRange: [values[0], values[1]] as [number, number],
      });
    },
    [filters, onFilterChange]
  );

  const handleDifficultyChange = useCallback(
    (values: number[]) => {
      onFilterChange({
        ...filters,
        difficultyLevel: values[0],
      });
    },
    [filters, onFilterChange]
  );

  const handleWeightRangeChange = useCallback(
    (values: number[]) => {
      onFilterChange({
        ...filters,
        weightRange: [values[0], values[1]] as [number, number],
      });
    },
    [filters, onFilterChange]
  );

  const handleSeatHeightRangeChange = useCallback(
    (values: number[]) => {
      onFilterChange({
        ...filters,
        seatHeightRange: [values[0], values[1]] as [number, number],
      });
    },
    [filters, onFilterChange]
  );

  const handleAbsChange = useCallback(
    (checked: boolean) => {
      onFilterChange({
        ...filters,
        abs: checked ? true : null,
      });
    },
    [filters, onFilterChange]
  );

  return {
    handleCategoryChange,
    handleMakeChange,
    handleMakeSelect,
    handleYearRangeChange,
    handleEngineRangeChange,
    handleDifficultyChange,
    handleWeightRangeChange,
    handleSeatHeightRangeChange,
    handleAbsChange,
  };
}
