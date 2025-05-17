
import * as z from "zod";

// Form schema
export const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  country: z.string().optional(),
  founded: z.coerce.number().int().min(1800, "Invalid year").max(2100, "Invalid year").optional(),
  logo_url: z.string().optional().nullable(),
  known_for: z.array(z.string()).optional(),
  slug: z.string().min(1, "Slug is required"),
  
  // New fields
  description: z.string().max(200, "Description should be concise (max 200 chars)").optional(),
  founded_city: z.string().optional(),
  headquarters: z.string().optional(),
  status: z.enum(["active", "defunct", "revived"]).optional(),
  brand_type: z.enum(["mass", "boutique", "revived", "oem"]).optional(),
  is_electric: z.boolean().optional().default(false),
  website_url: z.string().url("Please enter a valid URL").or(z.literal('')).optional(),
  categories: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
