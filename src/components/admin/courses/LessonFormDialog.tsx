
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createLesson, updateLesson } from "@/services/lessonService";
import { Lesson } from "@/types/course";
import { toast } from "sonner";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),
  content: z.string().optional(),
  order: z.coerce.number().int().min(0),
  published: z.boolean().default(false),
  slug: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface LessonFormDialogProps {
  lesson: Lesson | null;
  courseId: string;
  onSuccess: (lesson: Lesson, isNew: boolean) => void;
  onCancel: () => void;
  existingLessons: Lesson[];
}

const LessonFormDialog: React.FC<LessonFormDialogProps> = ({
  lesson,
  courseId,
  onSuccess,
  onCancel,
  existingLessons,
}) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const isEditing = !!lesson;

  // Determine next order number for new lessons
  const getNextOrderNumber = () => {
    if (existingLessons.length === 0) return 0;
    const maxOrder = Math.max(...existingLessons.map(l => l.order));
    return maxOrder + 1;
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: lesson?.title || "",
      content: lesson?.content || "",
      order: lesson?.order ?? getNextOrderNumber(),
      published: lesson?.published || false,
      slug: lesson?.slug || "",
    },
  });

  useEffect(() => {
    if (lesson) {
      form.reset({
        title: lesson.title,
        content: lesson.content || "",
        order: lesson.order,
        published: lesson.published,
        slug: lesson.slug,
      });
    } else {
      form.reset({
        title: "",
        content: "",
        order: getNextOrderNumber(),
        published: false,
        slug: "",
      });
    }
  }, [lesson, form, existingLessons]);

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);
      
      let savedLesson: Lesson;
      if (isEditing && lesson) {
        savedLesson = await updateLesson(lesson.id, data);
        toast.success("Lesson updated successfully");
      } else {
        savedLesson = await createLesson({
          ...data,
          course_id: courseId,
        });
        toast.success("Lesson created successfully");
      }

      onSuccess(savedLesson, !isEditing);
    } catch (error) {
      console.error("Error saving lesson:", error);
      toast.error(isEditing ? "Failed to update lesson" : "Failed to create lesson");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[650px]">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Lesson" : "Create Lesson"}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Make changes to the lesson details."
            : "Enter the details for the new lesson."}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter lesson title"
                    {...field}
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Position in the course (0 = first)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Published</FormLabel>
                    <FormDescription>
                      Make this lesson visible to users
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
          </div>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content (Markdown)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="# Lesson content using Markdown"
                    rows={12}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Use Markdown formatting for lesson content
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default LessonFormDialog;
