
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
  BrandSlugField,
  BrandDescriptionField,
  BrandFoundedCityField,
  BrandHeadquartersField,
  BrandStatusField,
  BrandTypeField,
  BrandIsElectricField,
  BrandWebsiteField,
  BrandCategoriesField,
  BrandNotesField,
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
      name: "",
      country: "",
      founded: undefined,
      logo_url: null,
      known_for: [],
      slug: "",
      description: "",
      founded_city: "",
      headquarters: "",
      status: "active",
      brand_type: "mass",
      is_electric: false,
      website_url: "",
      categories: [],
      notes: "",
    },
  });

  // Update form when brand changes
  React.useEffect(() => {
    if (brand) {
      console.log("Initializing form with brand data:", brand);
      form.reset({
        name: brand.name || "",
        country: brand.country || "",
        founded: brand.founded || undefined,
        logo_url: brand.logo_url || null,
        known_for: brand.known_for || [],
        slug: brand.slug || "",
        description: brand.description || "",
        founded_city: brand.founded_city || "",
        headquarters: brand.headquarters || "",
        status: brand.status || "active",
        brand_type: brand.brand_type || "mass",
        is_electric: brand.is_electric || false,
        website_url: brand.website_url || "",
        categories: brand.categories || [],
        notes: brand.notes || "",
      });
    } else {
      form.reset({
        name: "",
        country: "",
        founded: undefined,
        logo_url: null,
        known_for: [],
        slug: "",
        description: "",
        founded_city: "",
        headquarters: "",
        status: "active",
        brand_type: "mass",
        is_electric: false,
        website_url: "",
        categories: [],
        notes: "",
      });
    }
  }, [brand, form]);

  const handleFormSubmit = async (data: BrandFormValues) => {
    console.log("Form data before submission:", data);
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-accent-teal">Basic Information</h3>
          <BrandNameField form={form} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BrandCountryField form={form} />
            <BrandFoundedField form={form} />
          </div>
          <BrandDescriptionField form={form} />
        </div>
        
        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-accent-teal">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BrandFoundedCityField form={form} />
            <BrandHeadquartersField form={form} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BrandStatusField form={form} />
            <BrandTypeField form={form} />
          </div>
          <BrandIsElectricField form={form} />
          <BrandWebsiteField form={form} />
        </div>
        
        {/* Tags and Categories */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-accent-teal">Tags and Categories</h3>
          <BrandKnownForField form={form} />
          <BrandCategoriesField form={form} />
        </div>
        
        {/* Admin Fields */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-accent-teal">Admin Fields</h3>
          <BrandNotesField form={form} />
          <BrandLogoField form={form} />
          <BrandSlugField form={form} />
        </div>
          
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
