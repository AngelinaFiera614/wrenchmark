
import { MotorcycleCategory, MotorcycleFilters } from "@/types";

/**
 * Synchronize filter state with URL search parameters
 */
export function syncFiltersToUrl(
  filters: MotorcycleFilters,
  searchParams: URLSearchParams
): void {
  // Clear existing params
  Array.from(searchParams.keys()).forEach(key => {
    if (key !== 'page') { // Preserve pagination if needed
      searchParams.delete(key);
    }
  });

  // Add new params based on active filters
  if (filters.categories.length > 0) {
    filters.categories.forEach(category => {
      searchParams.append('category', category);
    });
  }

  if (filters.make) {
    searchParams.set('make', filters.make);
  }

  if (filters.searchTerm) {
    searchParams.set('search', filters.searchTerm);
  }

  if (filters.yearRange && 
    (filters.yearRange[0] !== 1980 || filters.yearRange[1] !== 2023)) {
    searchParams.set('yearMin', filters.yearRange[0].toString());
    searchParams.set('yearMax', filters.yearRange[1].toString());
  }

  if (filters.engineSizeRange && 
    (filters.engineSizeRange[0] !== 0 || filters.engineSizeRange[1] !== 2000)) {
    searchParams.set('engineMin', filters.engineSizeRange[0].toString());
    searchParams.set('engineMax', filters.engineSizeRange[1].toString());
  }

  if (filters.difficultyLevel !== 5) {
    searchParams.set('difficulty', filters.difficultyLevel.toString());
  }

  if (filters.weightRange && 
    (filters.weightRange[0] !== 100 || filters.weightRange[1] !== 400)) {
    searchParams.set('weightMin', filters.weightRange[0].toString());
    searchParams.set('weightMax', filters.weightRange[1].toString());
  }

  if (filters.seatHeightRange && 
    (filters.seatHeightRange[0] !== 650 || filters.seatHeightRange[1] !== 950)) {
    searchParams.set('seatMin', filters.seatHeightRange[0].toString());
    searchParams.set('seatMax', filters.seatHeightRange[1].toString());
  }

  if (filters.abs !== null) {
    searchParams.set('abs', filters.abs.toString());
  }
}

/**
 * Parse filter values from URL search parameters
 */
export function parseFiltersFromUrl(
  searchParams: URLSearchParams,
  initialFilters: MotorcycleFilters
): MotorcycleFilters {
  const filters = { ...initialFilters };

  // Parse categories (can have multiple)
  const urlCategories = searchParams.getAll('category') as MotorcycleCategory[];
  if (urlCategories.length > 0) {
    filters.categories = urlCategories;
  }

  // Parse make
  const make = searchParams.get('make');
  if (make) {
    filters.make = make;
  }

  // Parse search term
  const search = searchParams.get('search');
  if (search) {
    filters.searchTerm = search;
  }

  // Parse year range
  const yearMin = searchParams.get('yearMin');
  const yearMax = searchParams.get('yearMax');
  if (yearMin || yearMax) {
    filters.yearRange = [
      yearMin ? parseInt(yearMin) : initialFilters.yearRange[0],
      yearMax ? parseInt(yearMax) : initialFilters.yearRange[1]
    ];
  }

  // Parse engine size range
  const engineMin = searchParams.get('engineMin');
  const engineMax = searchParams.get('engineMax');
  if (engineMin || engineMax) {
    filters.engineSizeRange = [
      engineMin ? parseInt(engineMin) : initialFilters.engineSizeRange[0],
      engineMax ? parseInt(engineMax) : initialFilters.engineSizeRange[1]
    ];
  }

  // Parse difficulty level
  const difficulty = searchParams.get('difficulty');
  if (difficulty) {
    filters.difficultyLevel = parseInt(difficulty);
  }

  // Parse weight range
  const weightMin = searchParams.get('weightMin');
  const weightMax = searchParams.get('weightMax');
  if (weightMin || weightMax) {
    filters.weightRange = [
      weightMin ? parseInt(weightMin) : initialFilters.weightRange[0],
      weightMax ? parseInt(weightMax) : initialFilters.weightRange[1]
    ];
  }

  // Parse seat height range
  const seatMin = searchParams.get('seatMin');
  const seatMax = searchParams.get('seatMax');
  if (seatMin || seatMax) {
    filters.seatHeightRange = [
      seatMin ? parseInt(seatMin) : initialFilters.seatHeightRange[0],
      seatMax ? parseInt(seatMax) : initialFilters.seatHeightRange[1]
    ];
  }

  // Parse ABS
  const abs = searchParams.get('abs');
  if (abs !== null) {
    filters.abs = abs === 'true';
  }

  return filters;
}

/**
 * Count the number of active filters
 */
export function countActiveFilters(filters: MotorcycleFilters): number {
  let count = 0;
  
  if (filters.categories.length > 0) count += filters.categories.length;
  if (filters.make) count += 1;
  if (filters.searchTerm) count += 1;
  if (filters.yearRange[0] !== 1980 || filters.yearRange[1] !== 2023) count += 1;
  if (filters.engineSizeRange[0] !== 0 || filters.engineSizeRange[1] !== 2000) count += 1;
  if (filters.difficultyLevel !== 5) count += 1;
  if (filters.weightRange[0] !== 100 || filters.weightRange[1] !== 400) count += 1;
  if (filters.seatHeightRange[0] !== 650 || filters.seatHeightRange[1] !== 950) count += 1;
  if (filters.abs !== null) count += 1;
  
  return count;
}
