
import DOMPurify from 'dompurify';

/**
 * Enhanced input sanitization utilities to prevent XSS and injection attacks
 */

export const sanitizeHtml = (input: string): string => {
  if (!input) return '';
  
  // Configure DOMPurify to be more restrictive
  const cleanHtml = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['class'],
    FORBID_ATTR: ['style', 'onclick', 'onload', 'onerror'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'button'],
    KEEP_CONTENT: true
  });
  
  return cleanHtml.trim();
};

export const sanitizeText = (input: string): string => {
  if (!input) return '';
  
  // Strip all HTML tags for plain text content
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], KEEP_CONTENT: true }).trim();
};

export const sanitizeMarkdown = (input: string): string => {
  if (!input) return '';
  
  // Allow markdown-safe HTML but still sanitize dangerous content
  const cleanMarkdown = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre', 'a', 'img'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
    ALLOWED_URI_REGEXP: /^https?:\/\/|^\/|^#/,
    FORBID_ATTR: ['style', 'onclick', 'onload', 'onerror', 'javascript:'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'button'],
    KEEP_CONTENT: true
  });
  
  return cleanMarkdown.trim();
};

export const sanitizeFileName = (filename: string): string => {
  if (!filename) return '';
  
  // Remove path traversal attempts and dangerous characters
  return filename
    .replace(/[\.]{2,}/g, '') // Remove multiple dots
    .replace(/[\/\\]/g, '') // Remove path separators
    .replace(/[<>:"|?*]/g, '') // Remove invalid filename characters
    .replace(/[^\w\s.-]/g, '') // Only allow alphanumeric, spaces, dots, hyphens
    .replace(/^\s+|\s+$/g, '') // Trim whitespace
    .substring(0, 255); // Limit length
};

export const sanitizeSearchTerm = (searchTerm: string): string => {
  if (!searchTerm) return '';
  
  // Sanitize search input to prevent injection
  return searchTerm
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/['"]/g, '') // Remove quotes
    .replace(/[&]/g, '&amp;') // Escape ampersands
    .trim()
    .substring(0, 100); // Reasonable search term length
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254 && !email.includes('<') && !email.includes('>');
};

export const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol) && !url.includes('<script') && !url.includes('javascript:');
  } catch {
    return false;
  }
};

export const validateSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && slug.length <= 100 && !slug.startsWith('-') && !slug.endsWith('-');
};

export const validateNumericInput = (input: string | number, min?: number, max?: number): boolean => {
  const num = typeof input === 'string' ? parseFloat(input) : input;
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

export const sanitizeUserInput = (input: string, maxLength: number = 1000): string => {
  if (!input) return '';
  
  return sanitizeText(input).substring(0, maxLength);
};

// Rate limiting helper
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, number[]>();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const userRequests = requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    requests.set(identifier, validRequests);
    return true;
  };
};
