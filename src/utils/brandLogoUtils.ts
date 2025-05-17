
import { supabase } from "@/integrations/supabase/client";

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
    console.log("Using custom logo URL:", logoUrl);
    return { 
      url: logoUrl, 
      sourceType: "custom" 
    };
  }
  
  // If we have a slug but no logo_url, construct from storage bucket
  if (slug) {
    // Check for different possible filename patterns
    const possibleFilenames = [
      `${slug}-logo.png`,
      `${slug}.png`,
      `${slug}-logo.jpg`,
      `${slug}.jpg`,
      `${slug}.webp`
    ];
    
    // Use the first pattern for now - in a real implementation,
    // we could check if each file exists but that would require multiple API calls
    const generatedUrl = supabase.storage
      .from('brand-logos')
      .getPublicUrl(possibleFilenames[0]).data.publicUrl;
    
    console.log("Generated auto logo URL from slug:", generatedUrl);
    
    return {
      url: generatedUrl,
      sourceType: "auto-generated"
    };
  }
  
  // Fallback if both are missing
  console.log("Using fallback logo");
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

/**
 * Normalizes logo URLs to ensure consistency
 * @param url The URL to normalize
 * @returns Normalized URL
 */
export const normalizeLogoUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  
  // Return URL as-is for now
  // In a more complex implementation, you could standardize URLs here
  return url;
};

/**
 * Extracts the slug from a logo filename
 * @param filename The filename to extract from (e.g. "ducati-logo.png")
 * @returns The extracted slug (e.g. "ducati")
 */
export const extractSlugFromFilename = (filename: string): string | null => {
  // Remove file extension
  const withoutExt = filename.replace(/\.[^/.]+$/, "");
  
  // Check for common patterns
  if (withoutExt.endsWith('-logo')) {
    return withoutExt.slice(0, -5);
  }
  
  return withoutExt;
};
