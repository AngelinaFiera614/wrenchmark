
// Field filtering utility to prevent computed fields from being saved to database
import { Motorcycle } from "@/types";

// Define the actual database columns for motorcycle_models table
export const MOTORCYCLE_MODEL_DB_COLUMNS = [
  'id',
  'brand_id',
  'name',
  'type',
  'base_description',
  'production_start_year',
  'production_end_year',
  'production_status',
  'default_image_url',
  'slug',
  'is_draft',
  'ignore_autofill',
  'created_at',
  'updated_at',
  'successor_model_id',
  'predecessor_model_id',
  'engine_size',
  'horsepower',
  'torque_nm',
  'weight_kg',
  'seat_height_mm',
  'wheelbase_mm',
  'ground_clearance_mm',
  'fuel_capacity_l',
  'top_speed_kph',
  'has_abs',
  'difficulty_level',
  'power_to_weight_ratio',
  'wet_weight_kg',
  'is_entry_level',
  'production_notes',
  'model_history',
  'design_philosophy',
  'target_market',
  'discontinuation_reason',
  'summary',
  'category',
  'status',
  'transmission',
  'drive_type',
  'cooling_system',
  'recommended_license_level',
  'use_cases'
] as const;

// Computed/relationship fields that should NOT be saved to database
export const COMPUTED_FIELDS = [
  'brand',
  'brands',
  'make',
  'years',
  'model_years'
] as const;

export type DatabaseMotorcycleUpdate = Partial<Pick<Motorcycle, typeof MOTORCYCLE_MODEL_DB_COLUMNS[number]>>;

/**
 * Filters update data to only include actual database columns
 * Excludes computed fields like 'brand', 'brands', 'make' that come from relationships
 */
export function filterMotorcycleUpdateData(updates: Partial<Motorcycle>): DatabaseMotorcycleUpdate {
  console.log('=== filterMotorcycleUpdateData ===');
  console.log('Input updates:', Object.keys(updates));
  
  const filteredUpdates: DatabaseMotorcycleUpdate = {};
  const excludedFields: string[] = [];
  
  for (const [key, value] of Object.entries(updates)) {
    if (MOTORCYCLE_MODEL_DB_COLUMNS.includes(key as any)) {
      (filteredUpdates as any)[key] = value;
    } else {
      excludedFields.push(key);
    }
  }
  
  if (excludedFields.length > 0) {
    console.log('Excluded computed/relationship fields:', excludedFields);
  }
  
  console.log('Filtered updates for database:', Object.keys(filteredUpdates));
  return filteredUpdates;
}

/**
 * Validates that no computed fields are being sent to database
 */
export function validateUpdateData(updates: Partial<Motorcycle>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const field of COMPUTED_FIELDS) {
    if (field in updates) {
      errors.push(`Cannot update computed field '${field}' - this is derived from relationships`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
