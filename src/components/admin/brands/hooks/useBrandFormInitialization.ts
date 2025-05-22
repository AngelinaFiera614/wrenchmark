
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { BrandFormValues } from "../BrandFormSchema";
import { Brand } from "@/types";

export const useBrandFormInitialization = (
  form: UseFormReturn<BrandFormValues>,
  brand: Brand | null
) => {
  useEffect(() => {
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
};
