
import { supabase } from "@/integrations/supabase/client";
import { Motorcycle, MotorcycleFilters } from "@/types";

// Helper function to normalize motorcycle data
const normalizeMagMotorcycleData = (magData: any): Motorcycle => {
  return {
    id: magData.id || `mag-${Date.now()}`,
    name: magData.title || magData.name || "Unnamed Motorcycle",
    slug: magData.slug || magData.title?.toLowerCase().replace(/\s+/g, '-') || 'unnamed',
    brand_id: magData.brand_id || 'unknown',
    type: magData.category || magData.type || "Standard",
    is_draft: false,
    make: magData.make || magData.brand || "Unknown",
    model: magData.model || magData.title || "Unknown Model",
    year: magData.year || new Date().getFullYear(),
    category: magData.category || "Standard",
    style_tags: magData.style_tags || [],
    difficulty_level: magData.difficulty_level || 1,
    image_url: magData.image_url || magData.featured_image || '',
    engine_size: magData.engine_size || magData.displacement_cc || 0,
    horsepower: magData.horsepower || magData.power_hp || 0,
    weight_kg: magData.weight_kg || magData.dry_weight_kg || 0,
    seat_height_mm: magData.seat_height_mm || 0,
    abs: magData.abs || magData.has_abs || false,
    top_speed_kph: magData.top_speed_kph || 0,
    torque_nm: magData.torque_nm || 0,
    wheelbase_mm: magData.wheelbase_mm || 0,
    ground_clearance_mm: magData.ground_clearance_mm || 0,
    fuel_capacity_l: magData.fuel_capacity_l || magData.fuel_tank_capacity_l || 0,
    smart_features: magData.smart_features || [],
    summary: magData.summary || magData.description || '',
    created_at: magData.created_at || new Date().toISOString(),
    updated_at: magData.updated_at || new Date().toISOString()
  };
};

// Enhanced motorcycle filtering with better type safety
export const filterMotorcyclesEnhanced = (
  motorcycles: Motorcycle[],
  filters: MotorcycleFilters
): Motorcycle[] => {
  return motorcycles.filter(motorcycle => {
    // Search filter
    if (filters.search || filters.searchTerm) {
      const searchTerm = (filters.search || filters.searchTerm || '').toLowerCase();
      if (searchTerm) {
        const searchableText = [
          motorcycle.make,
          motorcycle.model,
          motorcycle.name,
          motorcycle.summary,
          ...(motorcycle.style_tags || [])
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }
    }

    // Category filter
    if (filters.categories?.length > 0) {
      const motorcycleCategory = motorcycle.category || motorcycle.type;
      if (!filters.categories.includes(motorcycleCategory as any)) {
        return false;
      }
    }

    // Make filter
    if (filters.make && filters.make !== '') {
      if (motorcycle.make?.toLowerCase() !== filters.make.toLowerCase()) {
        return false;
      }
    }

    // Year range filter
    if (filters.yearRange) {
      const year = motorcycle.year || new Date().getFullYear();
      if (year < filters.yearRange[0] || year > filters.yearRange[1]) {
        return false;
      }
    }

    // Engine size filter
    if (filters.engineSizeRange) {
      const engineSize = motorcycle.engine_size || 0;
      if (engineSize < filters.engineSizeRange[0] || engineSize > filters.engineSizeRange[1]) {
        return false;
      }
    }

    // Weight filter
    if (filters.weightRange) {
      const weight = motorcycle.weight_kg || 0;
      if (weight < filters.weightRange[0] || weight > filters.weightRange[1]) {
        return false;
      }
    }

    // Seat height filter
    if (filters.seatHeightRange) {
      const seatHeight = motorcycle.seat_height_mm || 0;
      if (seatHeight < filters.seatHeightRange[0] || seatHeight > filters.seatHeightRange[1]) {
        return false;
      }
    }

    // ABS filter
    if (filters.abs === true) {
      if (!motorcycle.abs && !motorcycle.has_abs) {
        return false;
      }
    }

    // Difficulty level filter
    if (typeof filters.difficultyLevel === 'number') {
      const difficulty = motorcycle.difficulty_level || 1;
      if (difficulty > filters.difficultyLevel) {
        return false;
      }
    }

    // Style tags filter
    if (filters.styleTags?.length > 0) {
      const motorcycleStyleTags = motorcycle.style_tags || [];
      const hasMatchingTag = filters.styleTags.some(tag => 
        motorcycleStyleTags.includes(tag)
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    return true;
  });
};

// Get available filter options from motorcycles data
export const getFilterOptions = (motorcycles: Motorcycle[]) => {
  const makes = new Set<string>();
  const categories = new Set<string>();
  const styleTags = new Set<string>();
  
  let minYear = Infinity;
  let maxYear = -Infinity;
  let minEngineSize = Infinity;
  let maxEngineSize = -Infinity;
  let minWeight = Infinity;
  let maxWeight = -Infinity;
  let minSeatHeight = Infinity;
  let maxSeatHeight = -Infinity;
  
  motorcycles.forEach(motorcycle => {
    // Makes
    if (motorcycle.make) makes.add(motorcycle.make);
    
    // Categories
    if (motorcycle.category) categories.add(motorcycle.category);
    if (motorcycle.type) categories.add(motorcycle.type);
    
    // Style tags
    if (motorcycle.style_tags) {
      motorcycle.style_tags.forEach(tag => styleTags.add(tag));
    }
    
    // Numeric ranges
    const year = motorcycle.year || new Date().getFullYear();
    minYear = Math.min(minYear, year);
    maxYear = Math.max(maxYear, year);
    
    const engineSize = motorcycle.engine_size || 0;
    if (engineSize > 0) {
      minEngineSize = Math.min(minEngineSize, engineSize);
      maxEngineSize = Math.max(maxEngineSize, engineSize);
    }
    
    const weight = motorcycle.weight_kg || 0;
    if (weight > 0) {
      minWeight = Math.min(minWeight, weight);
      maxWeight = Math.max(maxWeight, weight);
    }
    
    const seatHeight = motorcycle.seat_height_mm || 0;
    if (seatHeight > 0) {
      minSeatHeight = Math.min(minSeatHeight, seatHeight);
      maxSeatHeight = Math.max(maxSeatHeight, seatHeight);
    }
  });
  
  return {
    makes: Array.from(makes).sort(),
    categories: Array.from(categories).sort(),
    styleTags: Array.from(styleTags).sort(),
    yearRange: [minYear === Infinity ? 1980 : minYear, maxYear === -Infinity ? new Date().getFullYear() : maxYear],
    engineSizeRange: [minEngineSize === Infinity ? 0 : minEngineSize, maxEngineSize === -Infinity ? 2000 : maxEngineSize],
    weightRange: [minWeight === Infinity ? 100 : minWeight, maxWeight === -Infinity ? 400 : maxWeight],
    seatHeightRange: [minSeatHeight === Infinity ? 650 : minSeatHeight, maxSeatHeight === -Infinity ? 950 : maxSeatHeight]
  };
};

// Enhanced search with better relevance scoring
export const searchMotorcyclesEnhanced = (
  motorcycles: Motorcycle[],
  searchTerm: string
): Motorcycle[] => {
  if (!searchTerm.trim()) return motorcycles;
  
  const term = searchTerm.toLowerCase();
  
  return motorcycles
    .map(motorcycle => {
      let relevanceScore = 0;
      
      // Exact name match gets highest score
      if (motorcycle.name?.toLowerCase() === term) {
        relevanceScore += 100;
      } else if (motorcycle.name?.toLowerCase().includes(term)) {
        relevanceScore += 50;
      }
      
      // Make and model matches
      if (motorcycle.make?.toLowerCase().includes(term)) {
        relevanceScore += 30;
      }
      if (motorcycle.model?.toLowerCase().includes(term)) {
        relevanceScore += 30;
      }
      
      // Category and style tags
      if (motorcycle.category?.toLowerCase().includes(term)) {
        relevanceScore += 20;
      }
      if (motorcycle.style_tags?.some(tag => tag.toLowerCase().includes(term))) {
        relevanceScore += 15;
      }
      
      // Summary/description
      if (motorcycle.summary?.toLowerCase().includes(term)) {
        relevanceScore += 10;
      }
      
      return { motorcycle, relevanceScore };
    })
    .filter(item => item.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .map(item => item.motorcycle);
};

// Add missing function for compatibility
export const generateMissingModelData = async () => {
  console.log('Generating missing model data...');
  return [];
};
