
import { MotorcycleFilters, MotorcycleCategory } from "@/types";

export function countActiveFilters(filters: MotorcycleFilters): number {
  let count = 0;
  
  if (filters.searchTerm) count++;
  if (filters.categories && filters.categories.length > 0) count++;
  if (filters.make) count++;
  if (filters.yearRange && (filters.yearRange[0] !== 1980 || filters.yearRange[1] !== 2025)) count++;
  if (filters.engineSizeRange && (filters.engineSizeRange[0] !== 0 || filters.engineSizeRange[1] !== 2000)) count++;
  if (filters.difficultyLevel && filters.difficultyLevel < 5) count++;
  if (filters.weightRange && (filters.weightRange[0] !== 100 || filters.weightRange[1] !== 400)) count++;
  if (filters.seatHeightRange && (filters.seatHeightRange[0] !== 650 || filters.seatHeightRange[1] !== 950)) count++;
  if (filters.abs !== null) count++;
  if (filters.styleTags && filters.styleTags.length > 0) count++;
  
  // New enhanced filters
  if (filters.useCases && filters.useCases.length > 0) count++;
  if (filters.skillLevel && filters.skillLevel.length > 0) count++;
  if (filters.transmission && filters.transmission.length > 0) count++;
  if (filters.driveType && filters.driveType.length > 0) count++;
  if (filters.powerToWeightRange && (filters.powerToWeightRange[0] !== 0 || filters.powerToWeightRange[1] !== 2.0)) count++;
  if (filters.isEntryLevel !== null) count++;
  if (filters.coolingSystem && filters.coolingSystem.length > 0) count++;
  if (filters.licenseLevelFilter && filters.licenseLevelFilter.length > 0) count++;
  if (filters.hasSmartFeatures !== null) count++;
  if (filters.fuelCapacityRange && (filters.fuelCapacityRange[0] !== 0 || filters.fuelCapacityRange[1] !== 30)) count++;
  if (filters.topSpeedRange && (filters.topSpeedRange[0] !== 0 || filters.topSpeedRange[1] !== 350)) count++;
  if (filters.torqueRange && (filters.torqueRange[0] !== 0 || filters.torqueRange[1] !== 200)) count++;
  
  // Advanced search filters
  if (filters.advancedSearch) {
    const { engineType, cylinderCount, brakeType, frameType, suspensionType } = filters.advancedSearch;
    if (engineType && engineType.length > 0) count++;
    if (cylinderCount && cylinderCount.length > 0) count++;
    if (brakeType && brakeType.length > 0) count++;
    if (frameType && frameType.length > 0) count++;
    if (suspensionType && suspensionType.length > 0) count++;
  }
  
  return count;
}

export function syncFiltersToUrl(filters: MotorcycleFilters, searchParams: URLSearchParams) {
  // Clear existing filter params
  const keysToRemove = Array.from(searchParams.keys()).filter(key => 
    ['search', 'categories', 'make', 'yearMin', 'yearMax', 'engineMin', 'engineMax', 
     'difficulty', 'weightMin', 'weightMax', 'seatMin', 'seatMax', 'abs', 'tags',
     'useCases', 'transmission', 'driveType', 'entryLevel', 'smartFeatures'].includes(key)
  );
  keysToRemove.forEach(key => searchParams.delete(key));

  // Add active filters with safety checks
  if (filters.searchTerm) searchParams.set('search', filters.searchTerm);
  if (filters.categories && filters.categories.length > 0) searchParams.set('categories', filters.categories.join(','));
  if (filters.make) searchParams.set('make', filters.make);
  if (filters.yearRange && filters.yearRange[0] !== 1980) searchParams.set('yearMin', filters.yearRange[0].toString());
  if (filters.yearRange && filters.yearRange[1] !== 2025) searchParams.set('yearMax', filters.yearRange[1].toString());
  if (filters.engineSizeRange && filters.engineSizeRange[0] !== 0) searchParams.set('engineMin', filters.engineSizeRange[0].toString());
  if (filters.engineSizeRange && filters.engineSizeRange[1] !== 2000) searchParams.set('engineMax', filters.engineSizeRange[1].toString());
  if (filters.difficultyLevel !== undefined && filters.difficultyLevel < 5) searchParams.set('difficulty', filters.difficultyLevel.toString());
  if (filters.weightRange && filters.weightRange[0] !== 100) searchParams.set('weightMin', filters.weightRange[0].toString());
  if (filters.weightRange && filters.weightRange[1] !== 400) searchParams.set('weightMax', filters.weightRange[1].toString());
  if (filters.seatHeightRange && filters.seatHeightRange[0] !== 650) searchParams.set('seatMin', filters.seatHeightRange[0].toString());
  if (filters.seatHeightRange && filters.seatHeightRange[1] !== 950) searchParams.set('seatMax', filters.seatHeightRange[1].toString());
  if (filters.abs !== null && filters.abs !== undefined) searchParams.set('abs', filters.abs.toString());
  if (filters.useCases && filters.useCases.length > 0) searchParams.set('useCases', filters.useCases.join(','));
  if (filters.transmission && filters.transmission.length > 0) searchParams.set('transmission', filters.transmission.join(','));
  if (filters.driveType && filters.driveType.length > 0) searchParams.set('driveType', filters.driveType.join(','));
  if (filters.isEntryLevel !== null && filters.isEntryLevel !== undefined) searchParams.set('entryLevel', filters.isEntryLevel.toString());
  if (filters.hasSmartFeatures !== null && filters.hasSmartFeatures !== undefined) searchParams.set('smartFeatures', filters.hasSmartFeatures.toString());
}

export function parseFiltersFromUrl(searchParams: URLSearchParams, defaultFilters: MotorcycleFilters): MotorcycleFilters {
  const filters = { ...defaultFilters };

  const search = searchParams.get('search');
  if (search) filters.searchTerm = search;

  const categories = searchParams.get('categories');
  if (categories) filters.categories = categories.split(',') as MotorcycleCategory[];

  const make = searchParams.get('make');
  if (make) filters.make = make;

  const yearMin = searchParams.get('yearMin');
  const yearMax = searchParams.get('yearMax');
  if (yearMin || yearMax) {
    filters.yearRange = [
      yearMin ? parseInt(yearMin) : defaultFilters.yearRange[0],
      yearMax ? parseInt(yearMax) : defaultFilters.yearRange[1]
    ];
  }

  const engineMin = searchParams.get('engineMin');
  const engineMax = searchParams.get('engineMax');
  if (engineMin || engineMax) {
    filters.engineSizeRange = [
      engineMin ? parseInt(engineMin) : defaultFilters.engineSizeRange[0],
      engineMax ? parseInt(engineMax) : defaultFilters.engineSizeRange[1]
    ];
  }

  const difficulty = searchParams.get('difficulty');
  if (difficulty) filters.difficultyLevel = parseInt(difficulty);

  const weightMin = searchParams.get('weightMin');
  const weightMax = searchParams.get('weightMax');
  if (weightMin || weightMax) {
    filters.weightRange = [
      weightMin ? parseInt(weightMin) : defaultFilters.weightRange[0],
      weightMax ? parseInt(weightMax) : defaultFilters.weightRange[1]
    ];
  }

  const seatMin = searchParams.get('seatMin');
  const seatMax = searchParams.get('seatMax');
  if (seatMin || seatMax) {
    filters.seatHeightRange = [
      seatMin ? parseInt(seatMin) : defaultFilters.seatHeightRange[0],
      seatMax ? parseInt(seatMax) : defaultFilters.seatHeightRange[1]
    ];
  }

  const abs = searchParams.get('abs');
  if (abs) filters.abs = abs === 'true';

  const useCases = searchParams.get('useCases');
  if (useCases) filters.useCases = useCases.split(',');

  const transmission = searchParams.get('transmission');
  if (transmission) filters.transmission = transmission.split(',');

  const driveType = searchParams.get('driveType');
  if (driveType) filters.driveType = driveType.split(',');

  const entryLevel = searchParams.get('entryLevel');
  if (entryLevel) filters.isEntryLevel = entryLevel === 'true';

  const smartFeatures = searchParams.get('smartFeatures');
  if (smartFeatures) filters.hasSmartFeatures = smartFeatures === 'true';

  return filters;
}
