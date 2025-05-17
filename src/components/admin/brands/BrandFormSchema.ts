
import * as z from "zod";

// Form schema
export const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  country: z.string().optional(),
  founded: z.coerce.number().int().min(1800, "Invalid year").max(2100, "Invalid year").optional().nullable(),
  logo_url: z.string().optional().nullable(),
  known_for: z.array(z.string()).optional().default([]),
  slug: z.string().min(1, "Slug is required"),
  
  // New fields
  description: z.string().max(200, "Description should be concise (max 200 chars)").optional().nullable(),
  founded_city: z.string().optional().nullable(),
  headquarters: z.string().optional().nullable(),
  status: z.enum(["active", "defunct", "revived"]).optional().default("active"),
  brand_type: z.enum(["mass", "boutique", "revived", "oem"]).optional().default("mass"),
  is_electric: z.boolean().optional().default(false),
  website_url: z.string().url("Please enter a valid URL").or(z.literal('')).optional().nullable(),
  categories: z.array(z.string()).optional().default([]),
  notes: z.string().optional().nullable(),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
