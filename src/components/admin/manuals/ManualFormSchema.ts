
import * as z from 'zod';

export const manualTypes: { value: string; label: string }[] = [
  { value: 'owner', label: 'Owner Manual' },
  { value: 'service', label: 'Service Manual' },
  { value: 'wiring', label: 'Wiring Diagram' },
];

export const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  manual_type: z.enum(['owner', 'service', 'wiring']),
  make: z.string().min(2, 'Make must be at least 2 characters'),
  model: z.string().min(1, 'Model must be at least 1 character'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 2),
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'Please upload a file')
    .refine(
      (file) => ['application/pdf'].includes(file.type),
      'Only PDF files are supported'
    ),
});

export type ManualFormValues = z.infer<typeof formSchema>;
