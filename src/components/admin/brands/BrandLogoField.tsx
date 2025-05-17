
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "../shared/ImageUpload";
import { BrandFormValues } from "./BrandFormSchema";

interface BrandLogoFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

const BrandLogoField = ({ form }: BrandLogoFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="logo_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Brand Logo</FormLabel>
          <FormControl>
            <div className="flex flex-col items-center">
              <ImageUpload
                bucketName="brand-logos"
                value={field.value || null}
                onChange={field.onChange}
                maxSizeMB={5}
                previewHeight={120}
                previewWidth={120}
              />
              <FormDescription className="mt-2 text-center">
                Upload a logo image for the brand (PNG or JPG, max 5MB)
              </FormDescription>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BrandLogoField;
