
import { TooltipProvider } from "@/components/ui/tooltip";

type LogoSourceType = "custom" | "auto-generated" | "fallback";

/**
 * Gets the appropriate logo URL for a brand
 * @param logoUrl The direct logo URL from database if available
 * @param slug The brand slug for auto-generating a URL
 * @returns An object containing the URL and source type information
 */
export const getBrandLogoUrl = (logoUrl: string | null | undefined, slug: string | undefined): { 
  url: string;
  sourceType: LogoSourceType;
} => {
  // If we have a direct logo URL, use it
  if (logoUrl) {
    return { 
      url: logoUrl, 
      sourceType: "custom" 
    };
  }
  
  // If we have a slug but no logo_url, construct from storage bucket
  if (slug) {
    return {
      url: `https://njjstrqrwjygwyujdrzk.supabase.co/storage/v1/object/public/brand-logos/${slug}-logo.png`,
      sourceType: "auto-generated"
    };
  }
  
  // Fallback if both are missing
  return {
    url: '/placeholder.svg', 
    sourceType: "fallback"
  };
};

/**
 * Returns the appropriate tooltip content based on the logo source type and brand name
 */
export const getLogoTooltipContent = (sourceType: LogoSourceType, brandName: string): string => {
  switch (sourceType) {
    case "custom":
      return `${brandName} (Custom logo)`;
    case "auto-generated":
      return `${brandName} (Auto-generated logo)`;
    case "fallback":
      return `${brandName} (Missing logo)`;
  }
};
