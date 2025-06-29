
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const wheelSchema = z.object({
  type: z.string().optional(),
  front_size: z.string().optional(),
  rear_size: z.string().optional(),
  front_tire_size: z.string().optional(),
  rear_tire_size: z.string().optional(),
  rim_material: z.string().optional(),
  tubeless: z.boolean().optional(),
  notes: z.string().optional(),
});

type WheelFormData = z.infer<typeof wheelSchema>;

interface AdminWheelDialogProps {
  open: boolean;
  wheel?: any;
  onClose: (refreshData?: boolean) => void;
}

const AdminWheelDialog = ({ open, wheel, onClose }: AdminWheelDialogProps)  => {
  const { toast } = useToast();
  const isEditing = !!wheel;

  const form = useForm<WheelFormData>({
    resolver: zodResolver(wheelSchema),
    defaultValues: {
      type: wheel?.type || "",
      front_size: wheel?.front_size || "",
      rear_size: wheel?.rear_size || "",
      front_tire_size: wheel?.front_tire_size || "",
      rear_tire_size: wheel?.rear_tire_size || "",
      rim_material: wheel?.rim_material || "",
      tubeless: wheel?.tubeless || false,
      notes: wheel?.notes || "",
    }
  });

  React.useEffect(() => {
    if (open && wheel) {
      form.reset({
        type: wheel.type || "",
        front_size: wheel.front_size || "",
        rear_size: wheel.rear_size || "",
        front_tire_size: wheel.front_tire_size || "",
        rear_tire_size: wheel.rear_tire_size || "",
        rim_material: wheel.rim_material || "",
        tubeless: wheel.tubeless || false,
        notes: wheel.notes || "",
      });
    } else if (open) {
      form.reset({
        type: "",
        front_size: "",
        rear_size: "",
        front_tire_size: "",
        rear_tire_size: "",
        rim_material: "",
        tubeless: false,
        notes: "",
      });
    }
  }, [open, wheel, form]);

  const onSubmit = async (data: WheelFormData) => {
    try {
      console.log("=== SUBMITTING WHEEL DATA ===", data);

      if (isEditing) {
        // Update existing wheel
        const { error } = await supabase
          .from('wheels')
          .update(data)
          .eq('id', wheel.id);

        if (error) {
          console.error("=== UPDATE ERROR ===", error);
          throw error;
        }

        toast({
          title: "Wheel set updated",
          description: `Wheel set has been successfully updated.`,
        });
      } else {
        // Create new wheel
        const { error } = await supabase
          .from('wheels')
          .insert([data]);

        if (error) {
          console.error("=== INSERT ERROR ===", error);
          throw error;
        }

        toast({
          title: "Wheel set created",
          description: `Wheel set has been successfully created.`,
        });
      }

      onClose(true);
    } catch (error) {
      console.error("Error saving wheel set:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} wheel set. Please try again.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-explorer-text">{isEditing ? "Edit" : "Add"} Wheel Set</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wheel Type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                          <SelectValue placeholder="Select wheel type" />
                        </SelectTrigger>
                        <SelectContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text">
                          <SelectItem value="Alloy">Alloy</SelectItem>
                          <SelectItem value="Spoked">Spoked</SelectItem>
                          <SelectItem value="Cast">Cast</SelectItem>
                          <SelectItem value="Wire">Wire</SelectItem>
                          <SelectItem value="Forged">Forged</SelectItem>
                          <SelectItem value="Composite">Composite</SelectItem>
                          <SelectItem value="Tubeless Spoked">Tubeless Spoked</SelectItem>
                          <SelectItem value="Tube Type">Tube Type</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rim_material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rim Material</FormLabel>
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
                          <SelectItem value="Magnesium">Magnesium</SelectItem>
                          <SelectItem value="Composite">Composite</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="font-medium text-explorer-text">Front Wheel</h3>
                <FormField
                  control={form.control}
                  name="front_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="17 inch" 
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
                  name="front_tire_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tire Size</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="120/70-17" 
                          className="bg-explorer-dark border-explorer-chrome/30"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-explorer-text">Rear Wheel</h3>
                <FormField
                  control={form.control}
                  name="rear_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="17 inch" 
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
                  name="rear_tire_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tire Size</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="180/55-17" 
                          className="bg-explorer-dark border-explorer-chrome/30"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="tubeless"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-explorer-chrome/30 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Tubeless</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable if the wheels support tubeless tires
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional information about this wheel set..." 
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

export default AdminWheelDialog;
