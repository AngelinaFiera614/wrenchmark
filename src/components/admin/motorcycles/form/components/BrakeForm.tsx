
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const brakeSchema = z.object({
  type: z.string().min(2, "Type is required"),
  brake_brand: z.string().optional(),
  front_type: z.string().optional(),
  rear_type: z.string().optional(),
  front_disc_size_mm: z.coerce.number().min(0).optional().or(z.literal("")),
  rear_disc_size_mm: z.coerce.number().min(0).optional().or(z.literal("")),
  caliper_type: z.string().optional(),
  has_traction_control: z.boolean().default(false),
  has_abs: z.boolean().default(false),
  notes: z.string().optional(),
});

type BrakeFormValues = z.infer<typeof brakeSchema>;

interface BrakeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BrakeFormValues) => Promise<void>;
}

export function BrakeForm({ open, onClose, onSubmit }: BrakeFormProps) {
  const form = useForm<BrakeFormValues>({
    resolver: zodResolver(brakeSchema),
    defaultValues: {
      type: "",
      brake_brand: "",
      front_type: "",
      rear_type: "",
      front_disc_size_mm: "",
      rear_disc_size_mm: "",
      caliper_type: "",
      has_traction_control: false,
      has_abs: false,
      notes: "",
    },
  });

  const handleSubmit = async (values: BrakeFormValues) => {
    console.log("BrakeForm submitting values:", values);
    await onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Brake System</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Type *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Dual-channel ABS, Standard Disc Brakes" {...field} />
                  </FormControl>
                  <FormDescription>
                    Main categorization of this brake system
                  </FormDescription>
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
                    <Input placeholder="e.g. Brembo, Nissin, Tokico" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="front_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Front Brake Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Dual 320mm Discs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rear_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rear Brake Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Single 245mm Disc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="front_disc_size_mm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Front Disc Size (mm)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="320" 
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
                        placeholder="245" 
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
                    <Input placeholder="e.g. 4-piston radial, 2-piston floating" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="has_abs"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>ABS</FormLabel>
                      <FormDescription>
                        Anti-lock Braking System
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

              <FormField
                control={form.control}
                name="has_traction_control"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Traction Control</FormLabel>
                      <FormDescription>
                        Traction control system
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional information about this brake system..." 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Brake System</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
