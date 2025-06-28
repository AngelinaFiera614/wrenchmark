
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { sendAuthEmail, logEmailVerification } from '@/services/emailService';
import { toast } from 'sonner';

export const useEnhancedAuth = () => {
  const { user, signUp, signIn, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<{
    needsVerification: boolean;
    isVerified: boolean;
  }>({ needsVerification: false, isVerified: false });

  // Check email verification status
  useEffect(() => {
    const checkEmailVerification = async () => {
      if (!user) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email_verified, email_verified_at')
          .eq('user_id', user.id)
          .single();

        setEmailVerificationStatus({
          needsVerification: !profile?.email_verified && !user.email_confirmed_at,
          isVerified: !!profile?.email_verified || !!user.email_confirmed_at
        });
      } catch (error) {
        console.error('Failed to check email verification:', error);
      }
    };

    checkEmailVerification();
  }, [user]);

  const enhancedSignUp = async (email: string, password: string, fullName?: string) => {
    setIsLoading(true);
    try {
      const result = await signUp(email, password, fullName);
      
      if (!result.error && result.user) {
        // Send welcome email with verification link
        await sendAuthEmail({
          email,
          type: 'welcome',
          userName: fullName,
          confirmationUrl: `${window.location.origin}/auth/confirm?token=${result.user.id}`
        });

        // Log the email verification attempt
        await logEmailVerification(email, 'signup', 'pending');

        toast.success('Account created! Please check your email to verify your account.');
      }

      return result;
    } catch (error: any) {
      console.error('Enhanced signup error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const enhancedSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await signIn(email, password);
      
      if (!result.error && result.user) {
        // Log successful login
        await supabase.rpc('log_user_activity', {
          p_action: 'login_success',
          p_resource_type: 'authentication',
          p_details: { method: 'email_password' }
        });

        toast.success('Welcome back!');
      }

      return result;
    } catch (error: any) {
      // Log failed login attempt
      await supabase.rpc('log_user_activity', {
        p_action: 'login_failed',
        p_resource_type: 'authentication',
        p_details: { method: 'email_password', error: error.message }
      });

      console.error('Enhanced signin error:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) throw error;

      // Send custom password reset email
      await sendAuthEmail({
        email,
        type: 'password_reset',
        confirmationUrl: `${window.location.origin}/auth/reset-password?email=${email}`
      });

      // Log password reset request
      await logEmailVerification(email, 'password_reset', 'pending');

      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send password reset email');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!user?.email) return;

    setIsLoading(true);
    try {
      await sendAuthEmail({
        email: user.email,
        type: 'welcome',
        confirmationUrl: `${window.location.origin}/auth/confirm?token=${user.id}`
      });

      await logEmailVerification(user.email, 'resend_verification', 'pending');
      toast.success('Verification email sent!');
    } catch (error: any) {
      console.error('Resend verification error:', error);
      toast.error('Failed to resend verification email');
    } finally {
      setIsLoading(false);
    }
  };

  const enhancedSignOut = async () => {
    setIsLoading(true);
    try {
      // Log logout
      await supabase.rpc('log_user_activity', {
        p_action: 'logout',
        p_resource_type: 'authentication'
      });

      await signOut();
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Enhanced signout error:', error);
      toast.error('Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Enhanced auth methods
    enhancedSignUp,
    enhancedSignIn,
    enhancedSignOut,
    sendPasswordReset,
    resendVerificationEmail,

    // State
    isLoading,
    emailVerificationStatus,

    // Original auth state
    user,
    isAuthenticated: !!user
  };
};
