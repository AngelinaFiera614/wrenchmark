
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const suspensionSchema = z.object({
  front_type: z.string().optional(),
  rear_type: z.string().optional(),
  front_brand: z.string().optional(),
  rear_brand: z.string().optional(),
  brand: z.string().optional(),
  front_travel_mm: z.coerce.number().min(0).optional().or(z.literal("")),
  rear_travel_mm: z.coerce.number().min(0).optional().or(z.literal("")),
  adjustability: z.string().optional(),
});

type SuspensionFormData = z.infer<typeof suspensionSchema>;

interface AdminSuspensionDialogProps {
  open: boolean;
  suspension?: any;
  onClose: (refreshData?: boolean) => void;
}

const AdminSuspensionDialog = ({ open, suspension, onClose }: AdminSuspensionDialogProps)  => {
  const { toast } = useToast();
  const isEditing = !!suspension;

  const form = useForm<SuspensionFormData>({
    resolver: zodResolver(suspensionSchema),
    defaultValues: {
      front_type: suspension?.front_type || "",
      rear_type: suspension?.rear_type || "",
      front_brand: suspension?.front_brand || "",
      rear_brand: suspension?.rear_brand || "",
      brand: suspension?.brand || "",
      front_travel_mm: suspension?.front_travel_mm || "",
      rear_travel_mm: suspension?.rear_travel_mm || "",
      adjustability: suspension?.adjustability || "",
    }
  });

  React.useEffect(() => {
    if (open && suspension) {
      form.reset({
        front_type: suspension.front_type || "",
        rear_type: suspension.rear_type || "",
        front_brand: suspension.front_brand || "",
        rear_brand: suspension.rear_brand || "",
        brand: suspension.brand || "",
        front_travel_mm: suspension.front_travel_mm || "",
        rear_travel_mm: suspension.rear_travel_mm || "",
        adjustability: suspension.adjustability || "",
      });
    } else if (open) {
      form.reset({
        front_type: "",
        rear_type: "",
        front_brand: "",
        rear_brand: "",
        brand: "",
        front_travel_mm: "",
        rear_travel_mm: "",
        adjustability: "",
      });
    }
  }, [open, suspension, form]);

  const onSubmit = async (data: SuspensionFormData) => {
    try {
      // Process empty strings for numeric fields
      const processedData = {
        ...data,
        front_travel_mm: data.front_travel_mm === "" ? null : data.front_travel_mm,
        rear_travel_mm: data.rear_travel_mm === "" ? null : data.rear_travel_mm,
      };

      if (isEditing) {
        // Update existing suspension
        const { error } = await supabase
          .from('suspensions')
          .update(processedData)
          .eq('id', suspension.id);

        if (error) throw error;

        toast({
          title: "Suspension updated",
          description: `Suspension system has been successfully updated.`,
        });
      } else {
        // Create new suspension
        const { error } = await supabase
          .from('suspensions')
          .insert([processedData]);

        if (error) throw error;

        toast({
          title: "Suspension created",
          description: `Suspension system has been successfully created.`,
        });
      }

      onClose(true);
    } catch (error) {
      console.error("Error saving suspension:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} suspension. Please try again.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-explorer-text">{isEditing ? "Edit" : "Add"} Suspension System</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Front suspension */}
            <div className="space-y-2">
              <h3 className="font-medium text-explorer-text">Front Suspension</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="front_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                            <SelectValue placeholder="Select front type" />
                          </SelectTrigger>
                          <SelectContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text">
                            <SelectItem value="Telescopic Fork">Telescopic Fork</SelectItem>
                            <SelectItem value="USD Fork">USD Fork</SelectItem>
                            <SelectItem value="Cartridge Fork">Cartridge Fork</SelectItem>
                            <SelectItem value="Conventional Fork">Conventional Fork</SelectItem>
                            <SelectItem value="Leading Link">Leading Link</SelectItem>
                            <SelectItem value="Earles Fork">Earles Fork</SelectItem>
                            <SelectItem value="Springer Fork">Springer Fork</SelectItem>
                            <SelectItem value="Girder Fork">Girder Fork</SelectItem>
                            <SelectItem value="Telelever">Telelever</SelectItem>
                            <SelectItem value="Duolever">Duolever</SelectItem>
                            <SelectItem value="Hossack Fork">Hossack Fork</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="front_brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Öhlins" 
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
                name="front_travel_mm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Travel (mm)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="120" 
                        className="bg-explorer-dark border-explorer-chrome/30"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Rear suspension */}
            <div className="space-y-2">
              <h3 className="font-medium text-explorer-text">Rear Suspension</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rear_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                            <SelectValue placeholder="Select rear type" />
                          </SelectTrigger>
                          <SelectContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text">
                            <SelectItem value="Monoshock">Monoshock</SelectItem>
                            <SelectItem value="Twin Shock">Twin Shock</SelectItem>
                            <SelectItem value="Multi-Link">Multi-Link</SelectItem>
                            <SelectItem value="Cantilever">Cantilever</SelectItem>
                            <SelectItem value="Pro-Link">Pro-Link</SelectItem>
                            <SelectItem value="Uni-Trak">Uni-Trak</SelectItem>
                            <SelectItem value="Full Floater">Full Floater</SelectItem>
                            <SelectItem value="Softail">Softail</SelectItem>
                            <SelectItem value="Progressive Linkage">Progressive Linkage</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rear_brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Showa" 
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
                name="rear_travel_mm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Travel (mm)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="140" 
                        className="bg-explorer-dark border-explorer-chrome/30"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* General info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overall Brand (if same)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Overall brand" 
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
                name="adjustability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adjustability</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                          <SelectValue placeholder="Select adjustability" />
                        </SelectTrigger>
                        <SelectContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text">
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Preload Only">Preload Only</SelectItem>
                          <SelectItem value="Preload and Rebound">Preload and Rebound</SelectItem>
                          <SelectItem value="Fully Adjustable">Fully Adjustable</SelectItem>
                          <SelectItem value="Semi-Active">Semi-Active</SelectItem>
                          <SelectItem value="Electronically Controlled">Electronically Controlled</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

export default AdminSuspensionDialog;
