
/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */

export const sanitizeHtml = (input: string): string => {
  if (!input) return '';
  
  // Remove script tags and other dangerous HTML
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

export const sanitizeFileName = (filename: string): string => {
  if (!filename) return '';
  
  // Remove path traversal attempts and dangerous characters
  return filename
    .replace(/[\.]{2,}/g, '') // Remove multiple dots
    .replace(/[\/\\]/g, '') // Remove path separators
    .replace(/[<>:"|?*]/g, '') // Remove invalid filename characters
    .replace(/^\s+|\s+$/g, '') // Trim whitespace
    .substring(0, 255); // Limit length
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

export const validateSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && slug.length <= 100 && !slug.startsWith('-') && !slug.endsWith('-');
};
