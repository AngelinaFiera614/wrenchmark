
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const brakeSystemSchema = z.object({
  type: z.string().min(1, "Type is required"),
  front_type: z.string().optional(),
  rear_type: z.string().optional(),
  front_disc_size_mm: z.coerce.number().min(0).optional().or(z.literal("")),
  rear_disc_size_mm: z.coerce.number().min(0).optional().or(z.literal("")),
  brake_brand: z.string().optional(),
  caliper_type: z.string().optional(),
  has_abs: z.boolean().default(false),
  has_traction_control: z.boolean().default(false),
  notes: z.string().optional(),
});

type BrakeSystemFormData = z.infer<typeof brakeSystemSchema>;

interface AdminBrakeSystemDialogProps {
  open: boolean;
  brakeSystem?: any;
  onClose: (refreshData?: boolean) => void;
}

const AdminBrakeSystemDialog = ({ open, brakeSystem, onClose }: AdminBrakeSystemDialogProps)  => {
  const { toast } = useToast();
  const isEditing = !!brakeSystem;

  const form = useForm<BrakeSystemFormData>({
    resolver: zodResolver(brakeSystemSchema),
    defaultValues: {
      type: brakeSystem?.type || "",
      front_type: brakeSystem?.front_type || "",
      rear_type: brakeSystem?.rear_type || "",
      front_disc_size_mm: brakeSystem?.front_disc_size_mm || "",
      rear_disc_size_mm: brakeSystem?.rear_disc_size_mm || "",
      brake_brand: brakeSystem?.brake_brand || "",
      caliper_type: brakeSystem?.caliper_type || "",
      has_abs: brakeSystem?.has_abs || false,
      has_traction_control: brakeSystem?.has_traction_control || false,
      notes: brakeSystem?.notes || "",
    }
  });

  React.useEffect(() => {
    if (open && brakeSystem) {
      form.reset({
        type: brakeSystem.type || "",
        front_type: brakeSystem.front_type || "",
        rear_type: brakeSystem.rear_type || "",
        front_disc_size_mm: brakeSystem.front_disc_size_mm || "",
        rear_disc_size_mm: brakeSystem.rear_disc_size_mm || "",
        brake_brand: brakeSystem.brake_brand || "",
        caliper_type: brakeSystem.caliper_type || "",
        has_abs: brakeSystem.has_abs || false,
        has_traction_control: brakeSystem.has_traction_control || false,
        notes: brakeSystem.notes || "",
      });
    } else if (open) {
      form.reset({
        type: "",
        front_type: "",
        rear_type: "",
        front_disc_size_mm: "",
        rear_disc_size_mm: "",
        brake_brand: "",
        caliper_type: "",
        has_abs: false,
        has_traction_control: false,
        notes: "",
      });
    }
  }, [open, brakeSystem, form]);

  const onSubmit = async (data: BrakeSystemFormData) => {
    try {
      // Process empty strings for numeric fields
      const processedData = {
        ...data,
        front_disc_size_mm: data.front_disc_size_mm === "" ? null : data.front_disc_size_mm,
        rear_disc_size_mm: data.rear_disc_size_mm === "" ? null : data.rear_disc_size_mm,
      };

      if (isEditing) {
        // Update existing brake system
        const { error } = await supabase
          .from('brake_systems')
          .update(processedData)
          .eq('id', brakeSystem.id);

        if (error) throw error;

        toast({
          title: "Brake system updated",
          description: `${data.type} has been successfully updated.`,
        });
      } else {
        // Create new brake system
        const { error } = await supabase
          .from('brake_systems')
          .insert([processedData]);

        if (error) throw error;

        toast({
          title: "Brake system created",
          description: `${data.type} has been successfully created.`,
        });
      }

      onClose(true);
    } catch (error) {
      console.error("Error saving brake system:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} brake system. Please try again.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-explorer-text">{isEditing ? "Edit" : "Add"} Brake System</DialogTitle>
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
                        placeholder="ABS Brakes" 
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
                name="brake_brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Brembo" 
                        className="bg-explorer-dark border-explorer-chrome/30"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="front_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Front Brake Type</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Dual 310mm disc" 
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
                name="front_disc_size_mm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Front Disc Size (mm)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="310" 
                        className="bg-explorer-dark border-explorer-chrome/30"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rear_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rear Brake Type</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Single 240mm disc" 
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
                name="rear_disc_size_mm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rear Disc Size (mm)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="240" 
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
              name="caliper_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caliper Type</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="4-piston radial" 
                      className="bg-explorer-dark border-explorer-chrome/30"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="has_abs"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-explorer-chrome/30 p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>ABS</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Anti-lock Braking System
                      </div>
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

              <FormField
                control={form.control}
                name="has_traction_control"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-explorer-chrome/30 p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Traction Control</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Traction control system
                      </div>
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional information about this brake system..." 
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

export default AdminBrakeSystemDialog;
