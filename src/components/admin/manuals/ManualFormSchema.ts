
import { z } from "zod";

export const ManualFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  manual_type: z.enum(["owner", "service", "wiring"]),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().optional(),
  motorcycle_id: z.string().optional(),
  model_id: z.string().optional(),
  file_url: z.string().optional(),
  file_size_mb: z.number().optional(),
  file: z.instanceof(File).optional(),
  tags: z.array(z.string()).optional(),
});

export type ManualFormValues = z.infer<typeof ManualFormSchema>;
