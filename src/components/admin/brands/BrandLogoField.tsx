
import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import LogoBrowserDialog from "./LogoBrowserDialog";

interface BrandLogoFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

const BrandLogoField = ({ form }: BrandLogoFieldProps) => {
  const [isLogoBrowserOpen, setIsLogoBrowserOpen] = useState(false);

  const handleSelectLogo = (url: string) => {
    form.setValue('logo_url', url);
  };

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
              
              <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsLogoBrowserOpen(true)}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Browse Existing Logos
                </Button>
              </div>
              
              <FormDescription className="mt-2 text-center">
                Upload a logo image for the brand (PNG or JPG, max 5MB)
              </FormDescription>
            </div>
          </FormControl>
          <FormMessage />
          
          <LogoBrowserDialog
            isOpen={isLogoBrowserOpen}
            onClose={() => setIsLogoBrowserOpen(false)}
            onSelectLogo={handleSelectLogo}
          />
        </FormItem>
      )}
    />
  );
};

export default BrandLogoField;
