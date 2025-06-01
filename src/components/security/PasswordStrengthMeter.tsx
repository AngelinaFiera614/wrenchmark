
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Check, X } from 'lucide-react';
import { validatePassword } from '@/services/security/inputSanitizer';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  className = ''
}) => {
  const { isValid, errors } = validatePassword(password);
  
  // Calculate strength score
  let score = 0;
  const checks = [
    password.length >= 12,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    password.length >= 16 // Bonus for longer passwords
  ];
  
  score = checks.filter(Boolean).length;
  const percentage = (score / checks.length) * 100;
  
  const getStrengthLabel = () => {
    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Medium';
    if (score <= 5) return 'Strong';
    return 'Very Strong';
  };
  
  const getStrengthColor = () => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 4) return 'bg-yellow-500';
    if (score <= 5) return 'bg-green-500';
    return 'bg-green-600';
  };
  
  if (!password) return null;
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Password Strength:</span>
        <span className={`font-medium ${
          score <= 2 ? 'text-red-500' : 
          score <= 4 ? 'text-yellow-500' : 
          'text-green-500'
        }`}>
          {getStrengthLabel()}
        </span>
      </div>
      
      <Progress 
        value={percentage} 
        className="h-2"
      />
      
      <div className="space-y-1 text-xs">
        <div className="grid grid-cols-1 gap-1">
          <div className={`flex items-center gap-1 ${password.length >= 12 ? 'text-green-600' : 'text-red-500'}`}>
            {password.length >= 12 ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            <span>At least 12 characters</span>
          </div>
          
          <div className={`flex items-center gap-1 ${/[a-z]/.test(password) ? 'text-green-600' : 'text-red-500'}`}>
            {/[a-z]/.test(password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            <span>Lowercase letter</span>
          </div>
          
          <div className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-red-500'}`}>
            {/[A-Z]/.test(password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            <span>Uppercase letter</span>
          </div>
          
          <div className={`flex items-center gap-1 ${/\d/.test(password) ? 'text-green-600' : 'text-red-500'}`}>
            {/\d/.test(password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            <span>Number</span>
          </div>
          
          <div className={`flex items-center gap-1 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-green-600' : 'text-red-500'}`}>
            {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            <span>Special character</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
