
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Manual, ManualType } from '@/types';
import { uploadManual } from '@/services/manualService';
import { findMotorcycleByDetails, createPlaceholderMotorcycle } from '@/services/motorcycleService';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AdminManualDialogProps {
  open: boolean;
  onClose: (refreshData?: boolean) => void;
}

const manualTypes: { value: ManualType; label: string }[] = [
  { value: 'owner', label: 'Owner Manual' },
  { value: 'service', label: 'Service Manual' },
  { value: 'wiring', label: 'Wiring Diagram' },
];

const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>;

const AdminManualDialog: React.FC<AdminManualDialogProps> = ({ open, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      manual_type: 'owner',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      file: undefined,
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('file', file);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      // Check if motorcycle exists or create a placeholder
      let motorcycle = await findMotorcycleByDetails(values.make, values.model, values.year);

      if (!motorcycle) {
        // Create a placeholder motorcycle
        motorcycle = await createPlaceholderMotorcycle({
          make: values.make,
          model: values.model,
          year: values.year,
        });
        
        toast.success(`Created placeholder motorcycle for ${values.make} ${values.model} ${values.year}`);
      }

      // Calculate file size in MB
      const fileSizeMB = parseFloat((values.file.size / (1024 * 1024)).toFixed(2));

      // Upload the manual
      await uploadManual(values.file, {
        title: values.title,
        manual_type: values.manual_type,
        motorcycle_id: motorcycle.id,
        year: values.year,
        file_size_mb: fileSizeMB,
      });

      toast.success('Manual uploaded successfully');
      onClose(true);

      // Navigate to the motorcycle detail page
      setTimeout(() => {
        navigate(`/motorcycles/${motorcycle!.id}`);
      }, 500);
    } catch (error) {
      console.error('Error uploading manual:', error);
      toast.error('Failed to upload manual');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Manual</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Owner's Manual - Model Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="manual_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manual Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manual type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {manualTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <FormControl>
                      <Input placeholder="Honda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="CB500F" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="2023" 
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel>PDF File</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="application/pdf" 
                      onChange={handleFileChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" type="button" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload Manual
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminManualDialog;
