
import { Motorcycle } from "@/types";

// Remove placeholder motorcycles that don't match real structure
export const generatePlaceholderMotorcycle = (
  make: string,
  model: string,
  year: number
): Motorcycle => {
  return {
    id: `placeholder-${make}-${model}-${year}`.toLowerCase().replace(/\s+/g, '-'),
    name: `${make} ${model}`,
    slug: `${make}-${model}`.toLowerCase().replace(/\s+/g, '-'),
    brand_id: make.toLowerCase().replace(/\s+/g, '-'),
    type: "Standard",
    is_draft: true,
    make,
    model,
    year,
    category: "Standard",
    style_tags: ["Placeholder"],
    difficulty_level: 1,
    image_url: '',
    engine_size: 0,
    horsepower: 0,
    weight_kg: 0,
    seat_height_mm: 0,
    abs: false,
    top_speed_kph: 0,
    torque_nm: 0,
    wheelbase_mm: 0,
    ground_clearance_mm: 0,
    fuel_capacity_l: 0,
    smart_features: [],
    summary: `Placeholder entry for ${make} ${model} ${year}`,
    is_placeholder: true,
    migration_status: 'placeholder',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

// Create placeholder motorcycles for missing combinations
export const createPlaceholderMotorcycles = (
  makes: string[],
  models: string[],
  years: number[]
): Motorcycle[] => {
  const placeholders: Motorcycle[] = [];
  
  for (const make of makes) {
    for (const model of models) {
      for (const year of years) {
        placeholders.push(generatePlaceholderMotorcycle(make, model, year));
      }
    }
  }
  
  return placeholders;
};

// Common motorcycle makes for placeholder generation
export const COMMON_MAKES = [
  "Honda",
  "Yamaha", 
  "Kawasaki",
  "Suzuki",
  "Ducati",
  "BMW",
  "KTM",
  "Harley-Davidson",
  "Triumph",
  "Royal Enfield"
];

// Common model patterns
export const COMMON_MODELS = [
  "CBR600RR",
  "YZF-R6",
  "Ninja 650",
  "GSX-R750",
  "Panigale V4",
  "R1250GS",
  "390 Duke",
  "Sportster",
  "Street Triple",
  "Classic 350"
];

// Generate years for the last decade
export const RECENT_YEARS = Array.from(
  { length: 10 }, 
  (_, i) => new Date().getFullYear() - i
);

// Merge real motorcycles with placeholders
export const mergeWithPlaceholders = (
  realMotorcycles: Motorcycle[],
  placeholders: Motorcycle[]
): Motorcycle[] => {
  const realKeys = new Set(
    realMotorcycles.map(m => `${m.make}-${m.model}-${m.year}`.toLowerCase())
  );
  
  const filteredPlaceholders = placeholders.filter(p => {
    const key = `${p.make}-${p.model}-${p.year}`.toLowerCase();
    return !realKeys.has(key);
  });
  
  return [...realMotorcycles, ...filteredPlaceholders];
};
