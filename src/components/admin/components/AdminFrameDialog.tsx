
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const frameSchema = z.object({
  type: z.string().min(1, "Type is required"),
  material: z.string().optional(),
  construction_method: z.string().optional(),
  rake_degrees: z.coerce.number().min(0).optional().or(z.literal("")),
  trail_mm: z.coerce.number().min(0).optional().or(z.literal("")),
  notes: z.string().optional(),
});

type FrameFormData = z.infer<typeof frameSchema>;

interface AdminFrameDialogProps {
  open: boolean;
  frame?: any;
  onClose: (refreshData?: boolean) => void;
}

const AdminFrameDialog = ({ open, frame, onClose }: AdminFrameDialogProps)  => {
  const { toast } = useToast();
  const isEditing = !!frame;

  const form = useForm<FrameFormData>({
    resolver: zodResolver(frameSchema),
    defaultValues: {
      type: frame?.type || "",
      material: frame?.material || "",
      construction_method: frame?.construction_method || "",
      rake_degrees: frame?.rake_degrees || "",
      trail_mm: frame?.trail_mm || "",
      notes: frame?.notes || "",
    }
  });

  React.useEffect(() => {
    if (open && frame) {
      form.reset({
        type: frame.type || "",
        material: frame.material || "",
        construction_method: frame.construction_method || "",
        rake_degrees: frame.rake_degrees || "",
        trail_mm: frame.trail_mm || "",
        notes: frame.notes || "",
      });
    } else if (open) {
      form.reset({
        type: "",
        material: "",
        construction_method: "",
        rake_degrees: "",
        trail_mm: "",
        notes: "",
      });
    }
  }, [open, frame, form]);

  const onSubmit = async (data: FrameFormData) => {
    try {
      // Process empty strings for numeric fields
      const processedData = {
        ...data,
        rake_degrees: data.rake_degrees === "" ? null : data.rake_degrees,
        trail_mm: data.trail_mm === "" ? null : data.trail_mm,
      };

      if (isEditing) {
        // Update existing frame
        const { error } = await supabase
          .from('frames')
          .update(processedData)
          .eq('id', frame.id);

        if (error) throw error;

        toast({
          title: "Frame updated",
          description: `${data.type} has been successfully updated.`,
        });
      } else {
        // Create new frame
        const { error } = await supabase
          .from('frames')
          .insert([processedData]);

        if (error) throw error;

        toast({
          title: "Frame created",
          description: `${data.type} has been successfully created.`,
        });
      }

      onClose(true);
    } catch (error) {
      console.error("Error saving frame:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} frame. Please try again.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-explorer-text">{isEditing ? "Edit" : "Add"} Frame</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type*</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Diamond Frame" 
                        className="bg-explorer-dark border-explorer-chrome/30"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text">
                          <SelectItem value="Aluminum">Aluminum</SelectItem>
                          <SelectItem value="Steel">Steel</SelectItem>
                          <SelectItem value="Carbon Fiber">Carbon Fiber</SelectItem>
                          <SelectItem value="Titanium">Titanium</SelectItem>
                          <SelectItem value="Composite">Composite</SelectItem>
                          <SelectItem value="Chromoly">Chromoly Steel</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rake_degrees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rake (degrees)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.1"
                        placeholder="24.5" 
                        className="bg-explorer-dark border-explorer-chrome/30"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trail_mm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trail (mm)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.1"
                        placeholder="100" 
                        className="bg-explorer-dark border-explorer-chrome/30"
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
              name="construction_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Construction Method</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                        <SelectValue placeholder="Select construction method" />
                      </SelectTrigger>
                      <SelectContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text">
                        <SelectItem value="Welded">Welded</SelectItem>
                        <SelectItem value="Cast">Cast</SelectItem>
                        <SelectItem value="Forged">Forged</SelectItem>
                        <SelectItem value="Extruded">Extruded</SelectItem>
                        <SelectItem value="Molded">Molded</SelectItem>
                        <SelectItem value="Twin-Spar">Twin-Spar</SelectItem>
                        <SelectItem value="Trellis">Trellis</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional information about this frame..." 
                      className="bg-explorer-dark border-explorer-chrome/30 min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onClose()}
                className="border-explorer-chrome/30"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-accent-teal text-black hover:bg-accent-teal/80"
              >
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminFrameDialog;
