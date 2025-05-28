
import { supabase } from "@/integrations/supabase/client";

type LogoSourceType = "custom" | "auto-generated" | "fallback";

/**
 * Gets the appropriate logo URL for a brand with better error handling
 */
export const getBrandLogoUrl = (logoUrl: string | null | undefined, slug: string | undefined): { 
  url: string;
  sourceType: LogoSourceType;
} => {
  // If we have a direct logo URL, validate and use it
  if (logoUrl && logoUrl.trim()) {
    console.log("Using custom logo URL:", logoUrl);
    return { 
      url: logoUrl, 
      sourceType: "custom" 
    };
  }
  
  // If we have a slug but no logo_url, construct from storage bucket
  if (slug && slug.trim()) {
    // Check for different possible filename patterns
    const possibleFilenames = [
      `${slug}-logo.png`,
      `${slug}.png`,
      `${slug}-logo.jpg`,
      `${slug}.jpg`,
      `${slug}.webp`,
      `${slug}-logo.svg`,
      `${slug}.svg`
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
  
  // Fallback with a better placeholder
  console.log("Using fallback logo");
  return {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center', 
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
 * Creates a fallback image URL based on brand name
 */
export const getBrandFallbackImage = (brandName: string): string => {
  const brandNameLower = brandName.toLowerCase();
  
  // Map specific brands to relevant motorcycle images
  const brandImageMap: Record<string, string> = {
    'honda': 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop',
    'yamaha': 'https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=800&auto=format&fit=crop',
    'ducati': 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop',
    'kawasaki': 'https://images.unsplash.com/photo-1539826233524-c9eb499d1d31?w=800&auto=format&fit=crop',
    'harley': 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=800&auto=format&fit=crop',
    'bmw': 'https://images.unsplash.com/photo-1501286353178-1ec871214838?w=800&auto=format&fit=crop',
    'triumph': 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=800&auto=format&fit=crop',
    'suzuki': 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=800&auto=format&fit=crop'
  };

  // Check if brand name contains any mapped keywords
  for (const [key, image] of Object.entries(brandImageMap)) {
    if (brandNameLower.includes(key)) {
      return image;
    }
  }

  // Default fallback
  return 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&auto=format&fit=crop';
};

/**
 * Normalizes logo URLs to ensure consistency
 */
export const normalizeLogoUrl = (url: string | null | undefined): string | null => {
  if (!url || !url.trim()) return null;
  
  // Return URL as-is for now
  return url.trim();
};

/**
 * Extracts the slug from a logo filename
 */
export const extractSlugFromFilename = (filename: string): string | null => {
  if (!filename || !filename.trim()) return null;
  
  // Remove file extension
  const withoutExt = filename.replace(/\.[^/.]+$/, "");
  
  // Check for common patterns
  if (withoutExt.endsWith('-logo')) {
    return withoutExt.slice(0, -5);
  }
  
  return withoutExt;
};
