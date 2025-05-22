
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
  BrandHistoryField,
  BrandMilestonesField,
} from "./fields";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
      brand_history: "",
      milestones: [],
      manufacturing_facilities: [],
      logo_history: [],
      media_gallery: [],
      notable_models: [],
    },
  });

  // Update form when brand changes
  React.useEffect(() => {
    if (brand) {
      console.log("Initializing form with brand data:", brand);
      
      // Ensure categories is an array
      const categories = Array.isArray(brand.categories) ? brand.categories : [];
      console.log("Setting categories:", categories);
      
      form.reset({
        name: brand.name || "",
        country: brand.country || "",
        founded: brand.founded || undefined,
        logo_url: brand.logo_url || null,
        known_for: Array.isArray(brand.known_for) ? brand.known_for : [],
        slug: brand.slug || "",
        description: brand.description || "",
        founded_city: brand.founded_city || "",
        headquarters: brand.headquarters || "",
        status: brand.status || "active",
        brand_type: brand.brand_type || "mass",
        is_electric: brand.is_electric || false,
        website_url: brand.website_url || "",
        categories: categories,
        notes: brand.notes || "",
        brand_history: brand.brand_history || "",
        milestones: brand.milestones || [],
        manufacturing_facilities: brand.manufacturing_facilities || [],
        logo_history: brand.logo_history || [],
        media_gallery: brand.media_gallery || [],
        notable_models: brand.notable_models || [],
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
        brand_history: "",
        milestones: [],
        manufacturing_facilities: [],
        logo_history: [],
        media_gallery: [],
        notable_models: [],
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
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          
          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-accent-teal">Basic Information</h3>
              <BrandNameField form={form} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BrandCountryField form={form} />
                <BrandFoundedField form={form} />
              </div>
              <BrandDescriptionField form={form} />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-accent-teal">Tags and Categories</h3>
              <BrandKnownForField form={form} />
              <BrandCategoriesField form={form} />
            </div>
          </TabsContent>
          
          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
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
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-accent-teal">Brand History</h3>
              <BrandHistoryField form={form} />
              <BrandMilestonesField form={form} />
            </div>
          </TabsContent>
          
          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-accent-teal">Media Gallery</h3>
              <p className="text-sm text-muted-foreground">
                Media gallery features will be implemented in the next phase.
              </p>
            </div>
          </TabsContent>
          
          {/* Admin Tab */}
          <TabsContent value="admin" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-accent-teal">Admin Fields</h3>
              <BrandNotesField form={form} />
              <BrandLogoField form={form} />
              <BrandSlugField form={form} />
            </div>
          </TabsContent>
        </Tabs>
          
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
