
import * as z from "zod";

// Form schema
export const glossarySchema = z.object({
  id: z.string().optional(), // Add optional ID field for editing
  term: z.string().min(1, "Term is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9\-]+$/, {
    message: "Slug can only contain lowercase letters, numbers, and hyphens"
  }),
  definition: z.string().min(1, "Definition is required"),
  category: z.array(z.string()).default([]),
  related_terms: z.array(z.string()).default([]),
  image_url: z.string().nullable().optional(),
  video_url: z.string().url("Please enter a valid URL").or(z.literal('')).nullable().optional(),
});
