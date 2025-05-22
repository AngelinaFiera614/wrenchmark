
import * as z from "zod";

// Form schema
export const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  country: z.string().nullish(),
  founded: z.coerce.number().int().min(1800, "Invalid year").max(2100, "Invalid year").nullish(),
  logo_url: z.string().nullish(),
  known_for: z.array(z.string()).default([]),
  slug: z.string().min(1, "Slug is required"),
  
  // Base fields
  description: z.string().max(200, "Description should be concise (max 200 chars)").nullish(),
  founded_city: z.string().nullish(),
  headquarters: z.string().nullish(),
  status: z.enum(["active", "defunct", "revived"]).default("active"),
  brand_type: z.enum(["mass", "boutique", "revived", "oem"]).default("mass"),
  is_electric: z.boolean().default(false),
  website_url: z.string().url("Please enter a valid URL").or(z.literal('')).nullish(),
  categories: z.array(z.string()).default([]),
  notes: z.string().nullish(),
  
  // New expanded fields
  brand_history: z.string().nullish(),
  milestones: z.array(
    z.object({
      year: z.number().int().min(1800, "Invalid year").max(2100, "Invalid year"),
      description: z.string().min(1, "Description is required"),
      importance: z.enum(["low", "medium", "high"]).optional(),
    })
  ).optional(),
  manufacturing_facilities: z.array(z.string()).optional(),
  logo_history: z.array(
    z.object({
      year: z.number().int().min(1800, "Invalid year").max(2100, "Invalid year"),
      url: z.string().min(1, "Logo URL is required"),
      description: z.string().optional(),
    })
  ).optional(),
  media_gallery: z.array(
    z.object({
      url: z.string().min(1, "Media URL is required"),
      type: z.enum(["image", "video"]),
      caption: z.string().optional(),
      year: z.number().int().min(1800, "Invalid year").max(2100, "Invalid year").optional(),
    })
  ).optional(),
  notable_models: z.array(
    z.object({
      name: z.string().min(1, "Model name is required"),
      years: z.string().min(1, "Production years are required"),
      category: z.string().min(1, "Category is required"),
      image_url: z.string().optional(),
      description: z.string().optional(),
    })
  ).optional(),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
