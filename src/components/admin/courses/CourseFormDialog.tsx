
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createCourse, updateCourse } from "@/services/courseService";
import { Course } from "@/types/course";
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
  description: z.string().optional(),
  image_url: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
  published: z.boolean().default(false),
  slug: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CourseFormDialogProps {
  course: Course | null;
  onSuccess: (course: Course, isNew: boolean) => void;
  onCancel: () => void;
}

const CourseFormDialog: React.FC<CourseFormDialogProps> = ({
  course,
  onSuccess,
  onCancel,
}) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const isEditing = !!course;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course?.title || "",
      description: course?.description || "",
      image_url: course?.image_url || "",
      published: course?.published || false,
      slug: course?.slug || "",
    },
  });

  useEffect(() => {
    if (course) {
      form.reset({
        title: course.title,
        description: course.description || "",
        image_url: course.image_url || "",
        published: course.published,
        slug: course.slug,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        image_url: "",
        published: false,
        slug: "",
      });
    }
  }, [course, form]);

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);
      
      // Clean up empty strings
      if (data.image_url === "") {
        data.image_url = undefined;
      }

      let savedCourse: Course;
      if (isEditing && course) {
        savedCourse = await updateCourse(course.id, data);
        toast.success("Course updated successfully");
      } else {
        savedCourse = await createCourse(data);
        toast.success("Course created successfully");
      }

      onSuccess(savedCourse, !isEditing);
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error(isEditing ? "Failed to update course" : "Failed to create course");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[550px]">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Course" : "Create Course"}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Make changes to the course details."
            : "Enter the details for the new course."}
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
                    placeholder="Enter course title"
                    {...field}
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter course description"
                    rows={4}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  A brief description of what this course covers
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  URL to an image for this course (optional)
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
                    Make this course visible to users
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

export default CourseFormDialog;
