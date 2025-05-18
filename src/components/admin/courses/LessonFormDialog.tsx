
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { createLesson, updateLesson } from '@/services/lessonService';
import { queryClient } from '@/main';
import LessonGlossaryTermsField from './LessonGlossaryTermsField';

const lessonFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  order: z.coerce.number().int().positive("Order must be a positive integer"),
  content: z.string().optional(),
  published: z.boolean().default(false),
  glossary_terms: z.array(z.string()).default([])
});

type LessonFormValues = z.infer<typeof lessonFormSchema>;

interface LessonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson?: any;  // The lesson object when editing
  courseId: string;
  onSuccess?: () => void;
}

export default function LessonFormDialog({
  open,
  onOpenChange,
  lesson,
  courseId,
  onSuccess
}: LessonFormDialogProps) {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const isEditing = !!lesson?.id;

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      order: 1,
      content: "",
      published: false,
      glossary_terms: []
    }
  });

  // Populate form when editing
  useEffect(() => {
    if (lesson && open) {
      form.reset({
        title: lesson.title || "",
        slug: lesson.slug || "",
        order: lesson.order || 1,
        content: lesson.content || "",
        published: lesson.published || false,
        glossary_terms: lesson.glossary_terms || []
      });
    } else if (open) {
      // For new lessons, reset the form
      form.reset({
        title: "",
        slug: "",
        order: 1,
        content: "",
        published: false,
        glossary_terms: []
      });
    }
  }, [lesson, open, form]);

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    
    if (!isEditing || !form.getValues('slug')) {
      // Only auto-generate slug if creating new lesson or slug is empty
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      form.setValue('slug', slug);
    }
  };

  const onSubmit = async (values: LessonFormValues) => {
    setIsPending(true);
    try {
      if (isEditing) {
        await updateLesson(lesson.id, {
          ...values,
          course_id: courseId
        });
        toast({
          title: "Lesson updated",
          description: `${values.title} has been updated successfully.`
        });
      } else {
        await createLesson({
          ...values,
          course_id: courseId
        });
        toast({
          title: "Lesson created",
          description: `${values.title} has been created successfully.`
        });
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['courseLessons', courseId] });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving lesson:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} lesson. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Lesson' : 'Create New Lesson'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Make changes to the lesson details below.'
              : 'Add a new lesson to this course.'}
          </DialogDescription>
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
                    <Input 
                      placeholder="Introduction to Motorcycles" 
                      {...field} 
                      onChange={handleTitleChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="introduction-to-motorcycles" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      placeholder="1" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Lesson content (supports Markdown)" 
                      className="min-h-[200px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LessonGlossaryTermsField form={form} />
            
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Published</FormLabel>
                    <FormDescription>
                      Make this lesson visible to students
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isEditing ? 'Update Lesson' : 'Create Lesson'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const FormDescription = React.forwardRef<
  HTMLParagraphElement, 
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";
