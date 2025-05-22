
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Brand } from "@/types";
import { brandSchema, BrandFormValues } from "./BrandFormSchema";
import { BrandFormTabs } from "./form/BrandFormTabs";
import { BrandFormFooter } from "./form/BrandFormFooter";
import { useBrandFormInitialization } from "./hooks/useBrandFormInitialization";

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

  // Initialize form when brand changes
  useBrandFormInitialization(form, brand);

  const handleFormSubmit = async (data: BrandFormValues) => {
    console.log("Form data before submission:", data);
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <BrandFormTabs form={form} />
        <BrandFormFooter 
          loading={loading} 
          onCancel={onCancel} 
          isEditMode={!!brand} 
        />
      </form>
    </Form>
  );
};

export default BrandForm;
