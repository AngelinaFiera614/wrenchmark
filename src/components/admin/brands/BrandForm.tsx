
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Brand } from "@/types";
import { brandSchema, BrandFormValues } from "./BrandFormSchema";
import BrandLogoField from "./BrandLogoField";
import BrandKnownForField from "./BrandKnownForField";
import BrandSlugField from "./BrandSlugField";

interface BrandFormProps {
  brand: Brand | null;
  loading: boolean;
  onSubmit: (values: BrandFormValues) => Promise<void>;
  onCancel: () => void;
}

const BrandForm = ({ brand, loading, onSubmit, onCancel }: BrandFormProps) => {
  // Set up form
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand?.name || "",
      country: brand?.country || "",
      founded: brand?.founded,
      logo_url: brand?.logo_url || null,
      known_for: brand?.known_for || [],
      slug: brand?.slug || "",
    },
  });

  // Update form when brand changes
  React.useEffect(() => {
    if (brand) {
      form.reset({
        name: brand.name,
        country: brand.country || "",
        founded: brand.founded,
        logo_url: brand.logo_url || null,
        known_for: brand.known_for || [],
        slug: brand.slug || brand.name.toLowerCase().replace(/\s+/g, "-"),
      });
    } else {
      form.reset({
        name: "",
        country: "",
        founded: undefined,
        logo_url: null,
        known_for: [],
        slug: "",
      });
    }
  }, [brand, form]);

  return (
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
        
        <BrandLogoField form={form} />
        
        <BrandKnownForField form={form} />
        
        <BrandSlugField form={form} />
          
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} variant="teal">
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
  );
};

export default BrandForm;
