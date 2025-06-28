
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail, X } from 'lucide-react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

const EmailVerificationBanner: React.FC = () => {
  const { emailVerificationStatus, resendVerificationEmail, isLoading } = useEnhancedAuth();
  const [dismissed, setDismissed] = React.useState(false);

  if (!emailVerificationStatus.needsVerification || dismissed) {
    return null;
  }

  return (
    <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            Please verify your email address to access all features.
          </AlertDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resendVerificationEmail}
            disabled={isLoading}
            className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
          >
            {isLoading ? 'Sending...' : 'Resend Email'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Alert>
  );
};

export default EmailVerificationBanner;
