
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

const brakeSchema = z.object({
  type: z.string().min(2, "Type is required"),
  brake_type_front: z.string().optional(),
  brake_type_rear: z.string().optional(),
  has_traction_control: z.boolean().default(false),
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
      brake_type_front: "",
      brake_type_rear: "",
      has_traction_control: false,
      notes: "",
    },
  });

  const handleSubmit = async (values: BrakeFormValues) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
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
                  <FormLabel>System Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Dual-channel ABS" {...field} />
                  </FormControl>
                  <FormDescription>
                    Main categorization of this brake system
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brake_type_front"
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
                name="brake_type_rear"
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
            
            <FormField
              control={form.control}
              name="has_traction_control"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Traction Control</FormLabel>
                    <FormDescription>
                      Does this brake system include traction control?
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Additional information" {...field} />
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
