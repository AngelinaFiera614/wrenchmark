
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
import { queryClient } from '@/lib/queryClient';
import LessonGlossaryTermsField from './LessonGlossaryTermsField';
import ContentBlockEditor from './ContentBlockEditor';
import { cn } from '@/lib/utils';
import { ContentBlock } from '@/types/course';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const lessonFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  order: z.coerce.number().int().positive("Order must be a positive integer"),
  content: z.string().optional(),
  published: z.boolean().default(false),
  glossary_terms: z.array(z.string()).default([]),
  estimated_time_minutes: z.coerce.number().optional(),
  difficulty_level: z.coerce.number().min(1).max(5).optional(),
  skill_tags: z.array(z.string()).default([])
});

type LessonFormValues = z.infer<typeof lessonFormSchema>;

interface LessonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson?: any;
  courseId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  existingLessons?: any[];
}

export default function LessonFormDialog({
  open,
  onOpenChange,
  lesson,
  courseId,
  onSuccess,
  onCancel
}: LessonFormDialogProps) {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const isEditing = !!lesson?.id;

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      order: 1,
      content: "",
      published: false,
      glossary_terms: [],
      estimated_time_minutes: undefined,
      difficulty_level: undefined,
      skill_tags: []
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
        glossary_terms: lesson.glossary_terms || [],
        estimated_time_minutes: lesson.estimated_time_minutes,
        difficulty_level: lesson.difficulty_level,
        skill_tags: lesson.skill_tags || []
      });
      setContentBlocks(lesson.content_blocks || []);
    } else if (open) {
      form.reset({
        title: "",
        slug: "",
        order: 1,
        content: "",
        published: false,
        glossary_terms: [],
        estimated_time_minutes: undefined,
        difficulty_level: undefined,
        skill_tags: []
      });
      setContentBlocks([]);
    }
  }, [lesson, open, form]);

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    
    if (!isEditing || !form.getValues('slug')) {
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
      const lessonData = {
        ...values,
        course_id: courseId,
        content_blocks: contentBlocks
      };

      if (isEditing) {
        await updateLesson(lesson.id, lessonData);
        toast({
          title: "Lesson updated",
          description: `${values.title} has been updated successfully.`
        });
      } else {
        await createLesson(lessonData);
        toast({
          title: "Lesson created",
          description: `${values.title} has been created successfully.`
        });
      }
      
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

  const handleCancel = () => {
    onOpenChange(false);
    onCancel?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Lesson' : 'Create New Lesson'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Make changes to the lesson details below.'
              : 'Add a new lesson to this course with modular content blocks.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Content Blocks</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
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
                
                <div className="grid grid-cols-3 gap-4">
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
                    name="estimated_time_minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Est. Time (minutes)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            placeholder="15" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="difficulty_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty (1-5)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            max="5"
                            placeholder="1" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legacy Content (Markdown)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Optional: Legacy markdown content (use Content Blocks tab for modular content)" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <ContentBlockEditor 
                  contentBlocks={contentBlocks}
                  onChange={setContentBlocks}
                />
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
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
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
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
