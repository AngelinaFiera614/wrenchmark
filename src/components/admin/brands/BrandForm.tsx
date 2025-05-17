
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Brand } from "@/types";
import { brandSchema, BrandFormValues } from "./BrandFormSchema";
import {
  BrandNameField,
  BrandCountryField,
  BrandFoundedField,
  BrandLogoField,
  BrandKnownForField,
  BrandSlugField
} from "./fields";

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
        <BrandNameField form={form} />
        <BrandCountryField form={form} />
        <BrandFoundedField form={form} />
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
