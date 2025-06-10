
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { MotorcycleModel } from "@/types/motorcycle";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  year: z.number().min(1900).max(2030),
  changes: z.string().optional(),
  msrp_usd: z.number().positive().optional(),
  marketing_tagline: z.string().optional(),
  is_available: z.boolean().default(true),
  image_url: z.string().url().optional().or(z.literal('')),
});

interface AdminModelYearDialogProps {
  open: boolean;
  model: MotorcycleModel | null;
  onClose: () => void;
}

const AdminModelYearDialog: React.FC<AdminModelYearDialogProps> = ({
  open,
  model,
  onClose
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      changes: '',
      msrp_usd: undefined,
      marketing_tagline: '',
      is_available: true,
      image_url: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!model) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('model_years')
        .insert({
          motorcycle_id: model.id,
          year: values.year,
          changes: values.changes || null,
          msrp_usd: values.msrp_usd || null,
          marketing_tagline: values.marketing_tagline || null,
          is_available: values.is_available,
          image_url: values.image_url || null,
        });

      if (error) throw error;

      toast({
        title: "Model Year Added",
        description: `${values.year} model year has been created for ${model.brand?.name} ${model.name}.`,
      });

      // Refresh the model years data
      queryClient.invalidateQueries({ queryKey: ["model-years", model.id] });
      
      // Reset form and close dialog
      form.reset();
      onClose();
    } catch (error: any) {
      console.error("Error creating model year:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create model year. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-explorer-card border-explorer-chrome/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-explorer-text">
            Add Model Year
          </DialogTitle>
          <DialogDescription className="text-explorer-text-muted">
            {model && `Add a new model year for ${model.brand?.name} ${model.name}`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-explorer-text">Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1900}
                      max={2030}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="changes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-explorer-text">Changes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What changed in this model year?"
                      {...field}
                      className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="msrp_usd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-explorer-text">MSRP (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="15000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketing_tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-explorer-text">Marketing Tagline</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Built for Excellence"
                      {...field}
                      className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-explorer-text">
                      Available for purchase
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-explorer-text">Image URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      {...field}
                      className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-accent-teal text-black hover:bg-accent-teal/80"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Model Year'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminModelYearDialog;
