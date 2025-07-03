
import DOMPurify from 'dompurify';

/**
 * Enhanced input sanitization utilities to prevent XSS and injection attacks
 * Updated with additional security measures and better validation
 */

export const sanitizeHtml = (input: string): string => {
  if (!input) return '';
  
  // Configure DOMPurify to be more restrictive with enhanced security
  const cleanHtml = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre', 'a'],
    ALLOWED_ATTR: ['href', 'class', 'target', 'rel'],
    ALLOWED_URI_REGEXP: /^https?:\/\/|^\/|^#/,
    FORBID_ATTR: ['style', 'onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'javascript:', 'data:', 'vbscript:'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'button', 'meta', 'link', 'style'],
    KEEP_CONTENT: true,
    FORCE_BODY: true,
    SANITIZE_DOM: true,
    SANITIZE_NAMED_PROPS: true,
    ADD_ATTR: ['target', 'rel'], // Ensure external links are safe
    ADD_DATA_URI_TAGS: [], // Don't allow data URIs
    FORBID_CONTENTS: ['script', 'style'] // Remove content from these tags entirely
  });
  
  // Additional security: ensure all external links have security attributes
  const secureHtml = cleanHtml.replace(
    /<a\s+([^>]*href=["']https?:\/\/[^"']*["'][^>]*)>/gi,
    '<a $1 target="_blank" rel="noopener noreferrer">'
  );
  
  return secureHtml.trim();
};

export const sanitizeText = (input: string): string => {
  if (!input) return '';
  
  // Strip all HTML tags for plain text content with enhanced protection
  const textOnly = DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], 
    KEEP_CONTENT: true,
    SANITIZE_DOM: true,
    SANITIZE_NAMED_PROPS: true
  }).trim();
  
  // Additional protection against control characters
  return textOnly.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
};

export const sanitizeMarkdown = (input: string): string => {
  if (!input) return '';
  
  // Allow markdown-safe HTML but still sanitize dangerous content with enhanced rules
  const cleanMarkdown = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre', 'a', 'img'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'],
    ALLOWED_URI_REGEXP: /^https?:\/\/|^\/|^#/,
    FORBID_ATTR: ['style', 'onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'javascript:', 'data:', 'vbscript:', 'on*'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'button', 'meta', 'link', 'style'],
    KEEP_CONTENT: true,
    FORCE_BODY: true,
    SANITIZE_DOM: true,
    SANITIZE_NAMED_PROPS: true,
    ADD_DATA_URI_TAGS: [], // Don't allow data URIs
    FORBID_CONTENTS: ['script', 'style']
  });
  
  return cleanMarkdown.trim();
};

export const sanitizeFileName = (filename: string): string => {
  if (!filename) return '';
  
  // Enhanced filename sanitization to prevent path traversal and malicious files
  return filename
    .replace(/[\.]{2,}/g, '') // Remove multiple dots
    .replace(/[\/\\]/g, '') // Remove path separators
    .replace(/[<>:"|?*]/g, '') // Remove invalid filename characters
    .replace(/[^\w\s.-]/g, '') // Only allow alphanumeric, spaces, dots, hyphens
    .replace(/^\s+|\s+$/g, '') // Trim whitespace
    .replace(/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, '') // Remove Windows reserved names
    .substring(0, 255); // Limit length
};

export const sanitizeSearchTerm = (searchTerm: string): string => {
  if (!searchTerm) return '';
  
  // Enhanced search sanitization to prevent injection and improve security
  return searchTerm
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/['"]/g, '') // Remove quotes
    .replace(/[&]/g, '&amp;') // Escape ampersands
    .replace(/[%]/g, '') // Remove percent signs (SQL wildcard)
    .replace(/[_]/g, '') // Remove underscores (SQL wildcard)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
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
         !email.includes('data:') &&
         !email.includes('vbscript:') &&
         !/[\x00-\x1F\x7F]/.test(email); // No control characters
};

export const validateUrl = (url: string): boolean => {
  if (!url || url.length > 2048) return false; // Reasonable URL length limit
  
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol) && 
           !url.includes('<script') && 
           !url.includes('javascript:') &&
           !url.includes('data:') &&
           !url.includes('vbscript:') &&
           !url.includes('file:') &&
           !/[\x00-\x1F\x7F]/.test(url) && // No control characters
           !url.match(/[<>'"]/); // No HTML injection characters
  } catch {
    return false;
  }
};

export const validateSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && 
         slug.length <= 100 && 
         slug.length >= 1 &&
         !slug.startsWith('-') && 
         !slug.endsWith('-') &&
         !slug.includes('--') &&
         !/^\d+$/.test(slug); // Not purely numeric
};

export const validateNumericInput = (input: string | number, min?: number, max?: number): boolean => {
  const num = typeof input === 'string' ? parseFloat(input) : input;
  if (isNaN(num) || !isFinite(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

export const sanitizeUserInput = (input: string, maxLength: number = 1000): string => {
  if (!input) return '';
  
  return sanitizeText(input)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .substring(0, maxLength);
};

// Enhanced password validation with additional security checks
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters long');
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
  
  // Check for control characters
  if (/[\x00-\x1F\x7F]/.test(password)) {
    errors.push('Password contains invalid characters');
  }
  
  // Check for common weak patterns
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /letmein/i,
    /welcome/i,
    /monkey/i
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

// Enhanced file upload security with additional checks
export const validateFileUpload = (file: File, allowedTypes: string[], maxSize: number = 5 * 1024 * 1024): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }
  
  if (file.size > maxSize) {
    errors.push(`File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`);
  }
  
  if (file.size === 0) {
    errors.push('File appears to be empty');
  }
  
  // Check for dangerous file extensions (enhanced list)
  const dangerousExtensions = [
    '.exe', '.bat', '.cmd', '.scr', '.pif', '.jar', '.com', '.msi', '.vbs', 
    '.js', '.jse', '.ws', '.wsf', '.wsc', '.wsh', '.ps1', '.ps1xml', '.ps2', 
    '.ps2xml', '.psc1', '.psc2', '.msh', '.msh1', '.msh2', '.mshxml', '.msh1xml', 
    '.msh2xml', '.scf', '.lnk', '.inf', '.reg'
  ];
  
  const fileName = file.name.toLowerCase();
  
  for (const ext of dangerousExtensions) {
    if (fileName.endsWith(ext)) {
      errors.push('File type is not allowed for security reasons');
      break;
    }
  }
  
  // Check for double extensions (e.g., file.txt.exe)
  const parts = fileName.split('.');
  if (parts.length > 2) {
    const secondToLast = '.' + parts[parts.length - 2];
    if (dangerousExtensions.includes(secondToLast)) {
      errors.push('File has suspicious double extension');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Rate limiting helper with enhanced security and better performance
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, number[]>();
  
  // Cleanup old entries periodically to prevent memory leaks
  setInterval(() => {
    const now = Date.now();
    const cutoff = now - windowMs;
    
    for (const [key, timestamps] of requests.entries()) {
      const validTimestamps = timestamps.filter(time => time > cutoff);
      if (validTimestamps.length === 0) {
        requests.delete(key);
      } else {
        requests.set(key, validTimestamps);
      }
    }
  }, windowMs);
  
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

// Content Security Policy helper with enhanced nonce generation
export const generateCSPNonce = (): string => {
  const array = new Uint8Array(32); // Increased from 16 to 32 for better security
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Enhanced SQL injection prevention
export const escapeSqlLikePattern = (pattern: string): string => {
  return pattern.replace(/[%_\\]/g, '\\$&').replace(/[\x00-\x1F\x7F]/g, '');
};

// Additional security utility: Content length validation
export const validateContentLength = (content: string, maxLength: number = 10000): boolean => {
  return content.length <= maxLength && content.length > 0;
};

// Additional security utility: Detect potential XSS patterns
export const detectXSSPatterns = (input: string): boolean => {
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /vbscript:/i,
    /data:text\/html/i
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
};
