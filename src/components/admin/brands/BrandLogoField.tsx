
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
import { Search, Link as LinkIcon } from "lucide-react";
import LogoBrowserDialog from "./LogoBrowserDialog";
import { toast } from "@/hooks/use-toast";

interface BrandLogoFieldProps {
  form: UseFormReturn<BrandFormValues>;
}

const BrandLogoField = ({ form }: BrandLogoFieldProps) => {
  const [isLogoBrowserOpen, setIsLogoBrowserOpen] = useState(false);
  const logoUrl = form.watch('logo_url');
  const isExternalUrl = logoUrl?.startsWith('http') && !logoUrl?.includes('supabase.co');

  const handleSelectLogo = (url: string) => {
    if (url) {
      console.log("Setting logo URL in form:", url);
      form.setValue('logo_url', url);
      form.trigger('logo_url');
      toast({
        title: "Logo selected",
        description: "Logo has been selected successfully",
      });
    }
  };

  const handleClearLogo = () => {
    form.setValue('logo_url', null);
    form.trigger('logo_url');
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
                onChange={(url) => {
                  field.onChange(url);
                  console.log("Logo URL changed to:", url);
                }}
                maxSizeMB={5}
                previewHeight={120}
                previewWidth={120}
              />
              
              {isExternalUrl && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-xs flex items-center">
                  <LinkIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span>External URL detected. Consider uploading to Supabase for better reliability.</span>
                </div>
              )}
              
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
                {field.value && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={handleClearLogo}
                  >
                    Clear Logo
                  </Button>
                )}
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
