
import { useState, useCallback } from 'react';
import { 
  sanitizeUserInput, 
  sanitizeSearchTerm, 
  validateEmail, 
  validateUrl, 
  validateNumericInput,
  sanitizeFileName 
} from '@/services/security/inputSanitizer';
import { auditLogger } from '@/services/security/auditLogger';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  sanitizer?: (value: string) => string;
}

interface FormValidationConfig {
  [fieldName: string]: ValidationRule;
}

interface UseSecureFormOptions {
  validationConfig: FormValidationConfig;
  onSubmit: (sanitizedData: any) => Promise<void> | void;
  logFormActivity?: boolean;
}

export const useSecureForm = ({ validationConfig, onSubmit, logFormActivity = true }: UseSecureFormOptions) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((fieldName: string, value: any): string | null => {
    const rule = validationConfig[fieldName];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || value.toString().trim() === '')) {
      return `${fieldName} is required`;
    }

    if (!value) return null; // Skip other validations if field is empty and not required

    const stringValue = value.toString();

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
    
    // Default sanitization based on field name patterns
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
  }, [formData, validateForm, sanitizeField, onSubmit, isSubmitting, validationConfig, errors, logFormActivity]);

  const resetForm = useCallback(() => {
    setFormData({});
    setErrors({});
    setIsSubmitting(false);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    validateForm,
    resetForm,
    hasErrors: Object.keys(errors).length > 0
  };
};

// Pre-configured validation rules for common field types
export const commonValidationRules = {
  email: {
    required: true,
    maxLength: 254,
    custom: (value: string) => validateEmail(value) ? null : 'Invalid email format',
    sanitizer: (value: string) => value.trim().toLowerCase()
  },
  
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, // At least one lowercase, uppercase, and digit
  },
  
  url: {
    maxLength: 2048,
    custom: (value: string) => value && !validateUrl(value) ? 'Invalid URL format' : null,
    sanitizer: (value: string) => value.trim()
  },
  
  searchTerm: {
    maxLength: 100,
    sanitizer: sanitizeSearchTerm
  },
  
  filename: {
    required: true,
    maxLength: 255,
    pattern: /^[a-zA-Z0-9._-]+$/,
    sanitizer: sanitizeFileName
  },
  
  numericInput: {
    custom: (value: any) => validateNumericInput(value) ? null : 'Must be a valid number'
  }
};
