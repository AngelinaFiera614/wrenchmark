
import * as z from 'zod';

// Schema specifically for importing existing manual files
export const importSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  manual_type: z.enum(['owner', 'service', 'wiring']),
  make: z.string().min(2, 'Make must be at least 2 characters'),
  model: z.string().min(1, 'Model must be at least 1 character'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 2),
  file_url: z.string().url('Invalid file URL'),
  file_name: z.string(),
  file_size_mb: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

export type ImportManualFormValues = z.infer<typeof importSchema>;
