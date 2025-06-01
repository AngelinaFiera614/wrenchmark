
import { useState, useCallback } from 'react';
import { 
  sanitizeUserInput, 
  sanitizeSearchTerm, 
  validateEmail, 
  validateUrl, 
  validateNumericInput,
  sanitizeFileName,
  validatePassword,
  validateFileUpload
} from '@/services/security/inputSanitizer';
import { auditLogger } from '@/services/security/auditLogger';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  sanitizer?: (value: string) => string;
  type?: 'email' | 'password' | 'url' | 'filename' | 'search' | 'file';
}

interface FormValidationConfig {
  [fieldName: string]: ValidationRule;
}

interface UseSecureFormOptions {
  validationConfig: FormValidationConfig;
  onSubmit: (sanitizedData: any) => Promise<void> | void;
  logFormActivity?: boolean;
  enableRateLimit?: boolean;
  maxSubmissions?: number;
  rateLimitWindow?: number;
}

export const useSecureForm = ({ 
  validationConfig, 
  onSubmit, 
  logFormActivity = true,
  enableRateLimit = true,
  maxSubmissions = 5,
  rateLimitWindow = 60000 // 1 minute
}: UseSecureFormOptions) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState<number[]>([]);

  const validateField = useCallback((fieldName: string, value: any): string | null => {
    const rule = validationConfig[fieldName];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || value.toString().trim() === '')) {
      return `${fieldName} is required`;
    }

    if (!value) return null; // Skip other validations if field is empty and not required

    const stringValue = value.toString();

    // Type-specific validation
    if (rule.type === 'email' && !validateEmail(stringValue)) {
      return 'Please enter a valid email address';
    }

    if (rule.type === 'url' && stringValue && !validateUrl(stringValue)) {
      return 'Please enter a valid URL';
    }

    if (rule.type === 'password') {
      const passwordValidation = validatePassword(stringValue);
      if (!passwordValidation.isValid) {
        return passwordValidation.errors[0]; // Return first error
      }
    }

    if (rule.type === 'file' && value instanceof File) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      const fileValidation = validateFileUpload(value, allowedTypes);
      if (!fileValidation.isValid) {
        return fileValidation.errors[0];
      }
    }

    // Length validations
    if (rule.minLength && stringValue.length < rule.minLength) {
      return `${fieldName} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && stringValue.length > rule.maxLength) {
      return `${fieldName} must not exceed ${rule.maxLength} characters`;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(stringValue)) {
      return `${fieldName} format is invalid`;
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) return customError;
    }

    return null;
  }, [validationConfig]);

  const sanitizeField = useCallback((fieldName: string, value: string): string => {
    const rule = validationConfig[fieldName];
    if (rule?.sanitizer) {
      return rule.sanitizer(value);
    }
    
    // Type-based sanitization
    if (rule?.type === 'email') {
      return value.trim().toLowerCase();
    }
    
    if (rule?.type === 'search') {
      return sanitizeSearchTerm(value);
    }
    
    if (rule?.type === 'filename') {
      return sanitizeFileName(value);
    }
    
    if (rule?.type === 'url') {
      return value.trim();
    }
    
    // Fallback patterns based on field name
    if (fieldName.toLowerCase().includes('email')) {
      return value.trim().toLowerCase();
    }
    
    if (fieldName.toLowerCase().includes('search')) {
      return sanitizeSearchTerm(value);
    }
    
    if (fieldName.toLowerCase().includes('filename') || fieldName.toLowerCase().includes('file_name')) {
      return sanitizeFileName(value);
    }
    
    if (fieldName.toLowerCase().includes('url') || fieldName.toLowerCase().includes('link')) {
      return value.trim();
    }
    
    // Default text sanitization
    return sanitizeUserInput(value, rule?.maxLength || 1000);
  }, [validationConfig]);

  const checkRateLimit = useCallback((): boolean => {
    if (!enableRateLimit) return true;
    
    const now = Date.now();
    const recentSubmissions = submissions.filter(time => now - time < rateLimitWindow);
    
    if (recentSubmissions.length >= maxSubmissions) {
      return false;
    }
    
    return true;
  }, [submissions, enableRateLimit, maxSubmissions, rateLimitWindow]);

  const updateField = useCallback((fieldName: string, value: any) => {
    // Sanitize the input
    const sanitizedValue = typeof value === 'string' ? sanitizeField(fieldName, value) : value;
    
    // Update form data
    setFormData(prev => ({ ...prev, [fieldName]: sanitizedValue }));
    
    // Clear existing error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    
    // Validate the field
    const error = validateField(fieldName, sanitizedValue);
    if (error) {
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  }, [sanitizeField, validateField]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(validationConfig).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validateField, validationConfig]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (isSubmitting) return;

    // Check rate limit
    if (!checkRateLimit()) {
      setErrors({ _form: 'Too many submissions. Please wait before trying again.' });
      if (logFormActivity) {
        await auditLogger.logSuspiciousActivity('rate_limit_exceeded', {
          formFields: Object.keys(validationConfig)
        });
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Validate all fields
      if (!validateForm()) {
        if (logFormActivity) {
          await auditLogger.logSuspiciousActivity('form_validation_failed', {
            formFields: Object.keys(validationConfig),
            errorCount: Object.keys(errors).length
          });
        }
        return;
      }

      // Final sanitization pass
      const sanitizedData: Record<string, any> = {};
      Object.keys(formData).forEach(fieldName => {
        const value = formData[fieldName];
        sanitizedData[fieldName] = typeof value === 'string' ? sanitizeField(fieldName, value) : value;
      });

      // Update rate limit tracking
      if (enableRateLimit) {
        setSubmissions(prev => [...prev, Date.now()]);
      }

      if (logFormActivity) {
        await auditLogger.logSecurityEvent({
          action: 'secure_form_submit',
          resource_type: 'form',
          details: { formFields: Object.keys(validationConfig) },
          severity: 'low'
        });
      }

      await onSubmit(sanitizedData);
    } catch (error) {
      console.error('Form submission error:', error);
      if (logFormActivity) {
        await auditLogger.logSecurityEvent({
          action: 'form_submit_error',
          resource_type: 'form',
          details: { error: error instanceof Error ? error.message : 'Unknown error' },
          severity: 'medium'
        });
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, sanitizeField, onSubmit, isSubmitting, validationConfig, errors, logFormActivity, checkRateLimit, enableRateLimit]);

  const resetForm = useCallback(() => {
    setFormData({});
    setErrors({});
    setIsSubmitting(false);
    setSubmissions([]);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    validateForm,
    resetForm,
    hasErrors: Object.keys(errors).length > 0,
    canSubmit: checkRateLimit() && !isSubmitting
  };
};

// Enhanced validation rules with security improvements
export const commonValidationRules = {
  email: {
    type: 'email' as const,
    required: true,
    maxLength: 254,
    sanitizer: (value: string) => value.trim().toLowerCase()
  },
  
  password: {
    type: 'password' as const,
    required: true,
    minLength: 12,
    maxLength: 128
  },
  
  url: {
    type: 'url' as const,
    maxLength: 2048,
    sanitizer: (value: string) => value.trim()
  },
  
  searchTerm: {
    type: 'search' as const,
    maxLength: 100
  },
  
  filename: {
    type: 'filename' as const,
    required: true,
    maxLength: 255,
    pattern: /^[a-zA-Z0-9._-]+$/
  },
  
  numericInput: {
    custom: (value: any) => validateNumericInput(value) ? null : 'Must be a valid number'
  },
  
  fileUpload: {
    type: 'file' as const,
    required: true
  }
};
