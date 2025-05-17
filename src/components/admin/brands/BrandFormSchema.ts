
import * as z from "zod";

// Form schema
export const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  country: z.string().nullish(),
  founded: z.coerce.number().int().min(1800, "Invalid year").max(2100, "Invalid year").nullish(),
  logo_url: z.string().nullish(),
  known_for: z.array(z.string()).default([]),
  slug: z.string().min(1, "Slug is required"),
  
  // Fields that were reportedly not saving
  description: z.string().max(200, "Description should be concise (max 200 chars)").nullish(),
  founded_city: z.string().nullish(),
  headquarters: z.string().nullish(),
  status: z.enum(["active", "defunct", "revived"]).default("active"),
  brand_type: z.enum(["mass", "boutique", "revived", "oem"]).default("mass"),
  is_electric: z.boolean().default(false),
  website_url: z.string().url("Please enter a valid URL").or(z.literal('')).nullish(),
  categories: z.array(z.string()).default([]),
  notes: z.string().nullish(),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
