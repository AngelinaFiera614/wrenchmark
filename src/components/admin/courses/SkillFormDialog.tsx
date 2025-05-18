
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createSkill, updateSkill } from "@/services/skillsService";
import { Skill } from "@/types/course";
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
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  icon: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SkillFormDialogProps {
  skill: Skill | null;
  onSuccess: (skill: Skill, isNew: boolean) => void;
  onCancel: () => void;
}

const SkillFormDialog: React.FC<SkillFormDialogProps> = ({
  skill,
  onSuccess,
  onCancel,
}) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const isEditing = !!skill;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: skill?.name || "",
      description: skill?.description || "",
      category: skill?.category || "",
      icon: skill?.icon || "",
    },
  });

  useEffect(() => {
    if (skill) {
      form.reset({
        name: skill.name,
        description: skill.description || "",
        category: skill.category || "",
        icon: skill.icon || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        category: "",
        icon: "",
      });
    }
  }, [skill, form]);

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);
      
      // Clean up empty strings
      if (data.description === "") data.description = undefined;
      if (data.category === "") data.category = undefined;
      if (data.icon === "") data.icon = undefined;
      
      let savedSkill: Skill;
      if (isEditing && skill) {
        savedSkill = await updateSkill(skill.id, data);
        toast.success("Skill updated successfully");
      } else {
        savedSkill = await createSkill(data);
        toast.success("Skill created successfully");
      }

      onSuccess(savedSkill, !isEditing);
    } catch (error) {
      console.error("Error saving skill:", error);
      toast.error(isEditing ? "Failed to update skill" : "Failed to create skill");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Skill" : "Create Skill"}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Make changes to the skill details."
            : "Enter the details for the new skill."}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter skill name"
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Engine, Electrical, Handling"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Group similar skills together
                </FormDescription>
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
                    placeholder="Describe this skill"
                    rows={3}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Icon name or URL"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Name of an icon or URL to an image
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

export default SkillFormDialog;
