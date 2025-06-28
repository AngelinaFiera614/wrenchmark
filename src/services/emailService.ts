
import { supabase } from '@/integrations/supabase/client';

interface SendEmailParams {
  email: string;
  type: 'welcome' | 'password_reset' | 'email_change' | 'magic_link';
  confirmationUrl?: string;
  token?: string;
  userName?: string;
}

export const sendAuthEmail = async ({
  email,
  type,
  confirmationUrl,
  token,
  userName
}: SendEmailParams): Promise<void> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-auth-email', {
      body: {
        email,
        type,
        confirmationUrl,
        token,
        userName
      }
    });

    if (error) throw error;
    
    console.log('Email sent successfully:', data);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

export const logEmailVerification = async (
  email: string,
  type: string,
  status: 'pending' | 'verified' | 'expired' | 'failed' = 'pending'
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('email_verification_log')
      .insert({
        email,
        verification_type: type,
        status
      });

    if (error) throw error;
  } catch (error) {
    console.error('Failed to log email verification:', error);
    // Don't throw - logging failures shouldn't break the flow
  }
};
