
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { createLesson, updateLesson } from '@/services/lessonService';
import { queryClient } from '@/lib/queryClient';
import { ContentBlock } from '@/types/course';

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

export type LessonFormValues = z.infer<typeof lessonFormSchema>;

interface UseLessonFormProps {
  lesson?: any;
  courseId: string;
  onSuccess?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function useLessonForm({ lesson, courseId, onSuccess, onOpenChange, open }: UseLessonFormProps) {
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

  return {
    form,
    isPending,
    isEditing,
    contentBlocks,
    setContentBlocks,
    handleTitleChange,
    onSubmit
  };
}
