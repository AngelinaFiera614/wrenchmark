
import * as z from "zod";

// Form schema
export const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  country: z.string().optional(),
  founded: z.coerce.number().int().min(1800, "Invalid year").max(2100, "Invalid year").optional(),
  logo_url: z.string().optional().nullable(),
  known_for: z.array(z.string()).optional(),
  slug: z.string().min(1, "Slug is required"),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
