
import { supabase } from "@/integrations/supabase/client";

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export const validatePasswordStrength = async (password: string): Promise<PasswordValidationResult> => {
  try {
    const { data, error } = await supabase.rpc('validate_password_strength', { password });
    
    if (error) {
      console.error('Password validation error:', error);
      return {
        valid: false,
        errors: ['Unable to validate password strength'],
        strength: 'weak'
      };
    }
    
    // Calculate strength based on validation results
    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    if (data.valid) {
      if (password.length >= 16 && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        strength = 'strong';
      } else {
        strength = 'medium';
      }
    }
    
    return {
      valid: data.valid,
      errors: data.errors || [],
      strength
    };
  } catch (error) {
    console.error('Password validation service error:', error);
    return {
      valid: false,
      errors: ['Password validation service unavailable'],
      strength: 'weak'
    };
  }
};

export const getPasswordStrengthColor = (strength: 'weak' | 'medium' | 'strong'): string => {
  switch (strength) {
    case 'weak': return 'text-red-500';
    case 'medium': return 'text-yellow-500';
    case 'strong': return 'text-green-500';
    default: return 'text-gray-500';
  }
};

export const getPasswordStrengthLabel = (strength: 'weak' | 'medium' | 'strong'): string => {
  switch (strength) {
    case 'weak': return 'Weak';
    case 'medium': return 'Medium';
    case 'strong': return 'Strong';
    default: return 'Unknown';
  }
};
