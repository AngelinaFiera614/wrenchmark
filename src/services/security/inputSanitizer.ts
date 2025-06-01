
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
    FORBID_ATTR: ['style', 'onclick', 'onload', 'onerror', 'javascript:', 'data:', 'vbscript:'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'button', 'meta', 'link'],
    KEEP_CONTENT: true,
    FORCE_BODY: true,
    SANITIZE_DOM: true
  });
  
  return cleanHtml.trim();
};

export const sanitizeText = (input: string): string => {
  if (!input) return '';
  
  // Strip all HTML tags for plain text content
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], 
    KEEP_CONTENT: true,
    SANITIZE_DOM: true 
  }).trim();
};

export const sanitizeMarkdown = (input: string): string => {
  if (!input) return '';
  
  // Allow markdown-safe HTML but still sanitize dangerous content
  const cleanMarkdown = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre', 'a', 'img'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
    ALLOWED_URI_REGEXP: /^https?:\/\/|^\/|^#/,
    FORBID_ATTR: ['style', 'onclick', 'onload', 'onerror', 'javascript:', 'data:', 'vbscript:'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'button', 'meta', 'link'],
    KEEP_CONTENT: true,
    FORCE_BODY: true,
    SANITIZE_DOM: true
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
    .replace(/[%]/g, '') // Remove percent signs (SQL wildcard)
    .replace(/[_]/g, '') // Remove underscores (SQL wildcard)
    .trim()
    .substring(0, 100); // Reasonable search term length
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && 
         email.length <= 254 && 
         !email.includes('<') && 
         !email.includes('>') &&
         !email.includes('javascript:') &&
         !email.includes('data:');
};

export const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol) && 
           !url.includes('<script') && 
           !url.includes('javascript:') &&
           !url.includes('data:') &&
           !url.includes('vbscript:');
  } catch {
    return false;
  }
};

export const validateSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && 
         slug.length <= 100 && 
         !slug.startsWith('-') && 
         !slug.endsWith('-') &&
         !slug.includes('--');
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

// Enhanced password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for common weak patterns
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /letmein/i
  ];
  
  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('Password contains common weak patterns');
      break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// File upload security
export const validateFileUpload = (file: File, allowedTypes: string[], maxSize: number = 5 * 1024 * 1024): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }
  
  if (file.size > maxSize) {
    errors.push(`File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`);
  }
  
  // Check for dangerous file extensions
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.jar', '.com'];
  const fileName = file.name.toLowerCase();
  
  for (const ext of dangerousExtensions) {
    if (fileName.endsWith(ext)) {
      errors.push('File type is not allowed for security reasons');
      break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Rate limiting helper with enhanced security
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, number[]>();
  
  return (identifier: string): { allowed: boolean; remainingRequests: number; resetTime: number } => {
    const now = Date.now();
    const userRequests = requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    const remaining = Math.max(0, maxRequests - validRequests.length);
    const resetTime = now + windowMs;
    
    if (validRequests.length >= maxRequests) {
      return { 
        allowed: false, 
        remainingRequests: 0, 
        resetTime 
      };
    }
    
    validRequests.push(now);
    requests.set(identifier, validRequests);
    
    return { 
      allowed: true, 
      remainingRequests: remaining - 1, 
      resetTime 
    };
  };
};

// Content Security Policy helper
export const generateCSPNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// SQL injection prevention
export const escapeSqlLikePattern = (pattern: string): string => {
  return pattern.replace(/[%_\\]/g, '\\$&');
};
