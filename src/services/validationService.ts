
import { z } from "zod";

// Common validation patterns
const slugPattern = z.string().regex(/^[a-z0-9-]+$/, "Must be lowercase with hyphens only");
const hexColorPattern = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color");
const urlPattern = z.string().url("Must be a valid URL").optional().or(z.literal(""));

// Component validation schemas
export const engineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  displacement_cc: z.number().min(1, "Displacement must be positive"),
  power_hp: z.number().positive().optional(),
  torque_nm: z.number().positive().optional(),
  engine_type: z.string().optional(),
  cooling: z.string().optional(),
  cylinder_count: z.number().int().min(1).max(12).optional(),
  valve_train: z.string().optional(),
  stroke_type: z.enum(["2-stroke", "4-stroke"]).optional(),
  bore_mm: z.number().positive().optional(),
  stroke_mm: z.number().positive().optional(),
  compression_ratio: z.string().optional(),
  fuel_system: z.string().optional(),
  ignition: z.string().optional(),
  starter: z.string().optional(),
  engine_code: z.string().optional(),
  notes: z.string().optional(),
});

export const brakeSystemSchema = z.object({
  type: z.string().min(1, "Type is required"),
  front_type: z.string().optional(),
  rear_type: z.string().optional(),
  front_disc_size_mm: z.string().optional(),
  rear_disc_size_mm: z.string().optional(),
  caliper_type: z.string().optional(),
  brake_brand: z.string().optional(),
  has_traction_control: z.boolean().default(false),
  has_abs: z.boolean().default(false),
  notes: z.string().optional(),
});

export const frameSchema = z.object({
  type: z.string().min(1, "Type is required"),
  material: z.string().optional(),
  construction_method: z.string().optional(),
  rake_degrees: z.number().min(0).max(90).optional(),
  trail_mm: z.number().positive().optional(),
  wheelbase_mm: z.number().positive().optional(),
  mounting_type: z.string().optional(),
  notes: z.string().optional(),
});

export const suspensionSchema = z.object({
  front_type: z.string().optional(),
  rear_type: z.string().optional(),
  brand: z.string().optional(),
  adjustability: z.string().optional(),
  front_travel_mm: z.number().positive().optional(),
  rear_travel_mm: z.number().positive().optional(),
  damping_system: z.string().optional(),
  notes: z.string().optional(),
});

export const wheelSchema = z.object({
  type: z.string().optional(),
  front_size: z.string().optional(),
  rear_size: z.string().optional(),
  front_tire_size: z.string().optional(),
  rear_tire_size: z.string().optional(),
  rim_material: z.string().optional(),
  tubeless: z.boolean().default(false),
  notes: z.string().optional(),
});

export const colorOptionSchema = z.object({
  name: z.string().min(1, "Color name is required"),
  hex_code: hexColorPattern.optional(),
  image_url: urlPattern,
  is_limited: z.boolean().default(false),
  model_year_id: z.string().uuid("Valid model year must be selected"),
});

export const modelComponentAssignmentSchema = z.object({
  model_id: z.string().uuid("Valid model ID required"),
  component_type: z.enum(["engine", "brake_system", "frame", "suspension", "wheel"]),
  component_id: z.string().uuid("Valid component ID required"),
  assignment_type: z.enum(["standard", "optional", "upgrade", "special_edition"]).default("standard"),
  is_default: z.boolean().default(true),
  effective_from_year: z.number().int().min(1900).optional(),
  effective_to_year: z.number().int().min(1900).optional(),
  notes: z.string().optional(),
});

// Validation helper functions
export class ValidationService {
  static validateComponent(type: string, data: any) {
    const schemas = {
      engine: engineSchema,
      brake_system: brakeSystemSchema,
      frame: frameSchema,
      suspension: suspensionSchema,
      wheel: wheelSchema,
    };

    const schema = schemas[type as keyof typeof schemas];
    if (!schema) {
      throw new Error(`Unknown component type: ${type}`);
    }

    return schema.parse(data);
  }

  static validateColorOption(data: any) {
    return colorOptionSchema.parse(data);
  }

  static validateModelComponentAssignment(data: any) {
    return modelComponentAssignmentSchema.parse(data);
  }

  static validateYearRange(fromYear?: number, toYear?: number) {
    if (fromYear && toYear && fromYear > toYear) {
      throw new Error("From year must be less than or equal to to year");
    }
    return true;
  }
}
