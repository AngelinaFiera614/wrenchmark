
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
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const engineSchema = z.object({
  name: z.string().min(2, "Name is required"),
  displacement_cc: z.coerce.number().min(1, "Engine size is required"),
  power_hp: z.coerce.number().optional(),
  torque_nm: z.coerce.number().optional(),
  engine_type: z.string().optional(),
  cylinder_count: z.coerce.number().optional(),
  valve_count: z.coerce.number().optional(),
  cooling: z.string().optional(),
});

type EngineFormValues = z.infer<typeof engineSchema>;

interface EngineFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EngineFormValues) => Promise<void>;
}

export function EngineForm({ open, onClose, onSubmit }: EngineFormProps) {
  const form = useForm<EngineFormValues>({
    resolver: zodResolver(engineSchema),
    defaultValues: {
      name: "",
      displacement_cc: undefined,
      power_hp: undefined,
      torque_nm: undefined,
      engine_type: "",
      cylinder_count: undefined,
      valve_count: undefined,
      cooling: "",
    },
  });

  const handleSubmit = async (values: EngineFormValues) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Engine</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Engine Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. CP2 649cc Twin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="displacement_cc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Displacement (cc)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="engine_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engine Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Parallel Twin">Parallel Twin</SelectItem>
                        <SelectItem value="V-Twin">V-Twin</SelectItem>
                        <SelectItem value="Inline-3">Inline-3</SelectItem>
                        <SelectItem value="Inline-4">Inline-4</SelectItem>
                        <SelectItem value="V4">V4</SelectItem>
                        <SelectItem value="Boxer">Boxer</SelectItem>
                        <SelectItem value="Rotary">Rotary</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="power_hp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Power (HP)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="torque_nm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Torque (Nm)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="cylinder_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cylinders</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="valve_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valves</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cooling"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cooling</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Air">Air</SelectItem>
                        <SelectItem value="Liquid">Liquid</SelectItem>
                        <SelectItem value="Oil">Oil</SelectItem>
                        <SelectItem value="Air/Oil">Air/Oil</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Engine</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
