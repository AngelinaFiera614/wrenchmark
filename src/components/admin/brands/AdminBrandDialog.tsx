
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Brand } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

// Form schema
const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  country: z.string().optional(),
  founded: z.coerce.number().int().min(1800, "Invalid year").max(2100, "Invalid year").optional(),
  logo_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  known_for: z.array(z.string()).optional(),
  slug: z.string().min(1, "Slug is required"),
});

type FormValues = z.infer<typeof brandSchema>;

interface AdminBrandDialogProps {
  open: boolean;
  brand: Brand | null;
  onClose: (refreshData?: boolean) => void;
}

const AdminBrandDialog: React.FC<AdminBrandDialogProps> = ({ 
  open, 
  brand, 
  onClose 
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [knownForInput, setKnownForInput] = React.useState("");
  
  // Set up form
  const form = useForm<FormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      country: "",
      founded: undefined,
      logo_url: "",
      known_for: [],
      slug: "",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (brand) {
      form.reset({
        name: brand.name,
        country: brand.country || "",
        founded: brand.founded,
        logo_url: brand.logo_url || "",
        known_for: brand.known_for || [],
        slug: brand.slug || brand.name.toLowerCase().replace(/\s+/g, "-"),
      });
    } else {
      form.reset({
        name: "",
        country: "",
        founded: undefined,
        logo_url: "",
        known_for: [],
        slug: "",
      });
    }
  }, [brand, form]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const brandData = {
        name: values.name,
        country: values.country || null,
        founded: values.founded || null,
        logo_url: values.logo_url || null,
        known_for: values.known_for || [],
        slug: values.slug,
      };

      let error;
      
      if (brand) {
        // Update existing brand
        const { error: updateError } = await supabase
          .from('brands')
          .update(brandData)
          .eq('id', brand.id);
          
        error = updateError;
        
        if (!error) {
          toast({
            title: "Brand updated",
            description: `${values.name} has been updated successfully.`,
          });
        }
      } else {
        // Create new brand
        const { error: insertError } = await supabase
          .from('brands')
          .insert([brandData]);
          
        error = insertError;
        
        if (!error) {
          toast({
            title: "Brand added",
            description: `${values.name} has been added successfully.`,
          });
        }
      }

      if (error) throw error;
      
      onClose(true); // Close and refresh data
      
    } catch (error) {
      console.error("Error saving brand:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save brand. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddKnownFor = () => {
    if (knownForInput.trim()) {
      const currentValues = form.getValues("known_for") || [];
      form.setValue("known_for", [...currentValues, knownForInput.trim()]);
      setKnownForInput("");
    }
  };

  const handleRemoveKnownFor = (index: number) => {
    const currentValues = form.getValues("known_for") || [];
    form.setValue(
      "known_for",
      currentValues.filter((_, i) => i !== index)
    );
  };

  const handleGenerateSlug = () => {
    const name = form.getValues("name");
    
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
        
      form.setValue("slug", slug);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {brand ? "Edit Brand" : "Add New Brand"}
          </DialogTitle>
          <DialogDescription>
            {brand 
              ? "Update the details for this motorcycle brand."
              : "Fill in the details to add a new motorcycle brand to the database."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Kawasaki" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country of Origin</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Japan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="founded"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Founded Year</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 1896" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="known_for"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Known For</FormLabel>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="e.g. Sport Bikes" 
                        value={knownForInput}
                        onChange={(e) => setKnownForInput(e.target.value)}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleAddKnownFor}
                      >
                        Add
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value?.map((item, index) => (
                        <div 
                          key={index}
                          className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveKnownFor(index)}
                            className="text-secondary-foreground/70 hover:text-secondary-foreground"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <FormDescription>
                      Add tags for what this brand is known for (e.g., Sport Bikes, Cruisers)
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="brand-slug" {...field} />
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleGenerateSlug}
                      size="sm"
                    >
                      Generate
                    </Button>
                  </div>
                  <FormDescription>
                    Used for URLs (e.g., kawasaki, honda)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
              
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onClose()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : brand ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminBrandDialog;
