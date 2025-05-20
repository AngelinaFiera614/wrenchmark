
export * from './authenticationService';
export * from './adminService';
export * from './sessionService';
export * from './types';

import { supabase } from '@/integrations/supabase/client';
import { Profile } from '../profileService';
import { toast } from 'sonner';

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('[auth] Sign in error:', error);
    toast.error(`Sign in failed: ${error.message || 'Unknown error'}`);
    throw error;
  }
};

/**
 * Sign up with email and password
 */
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    toast.success('Sign up successful! Please check your email for verification.');
    return data;
  } catch (error: any) {
    console.error('[auth] Sign up error:', error);
    toast.error(`Sign up failed: ${error.message || 'Unknown error'}`);
    throw error;
  }
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    toast.success('You have been signed out');
  } catch (error: any) {
    console.error('[auth] Sign out error:', error);
    toast.error(`Sign out failed: ${error.message || 'Unknown error'}`);
    throw error;
  }
};

/**
 * Verify if user has admin status
 */
export const verifyAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    // Try to use the is_admin function
    try {
      const { data, error } = await supabase.rpc('is_admin');
      
      if (!error) {
        return data === true;
      }
    } catch (funcError) {
      console.warn('[auth] is_admin function not available, falling back to direct query');
    }
    
    // Fallback to direct query
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    return data?.is_admin === true;
  } catch (error: any) {
    console.error('[auth] Admin verification error:', error);
    return false;
  }
};

/**
 * Update profile data
 */
export const updateProfileData = async (
  userId: string, 
  profileData: Partial<Profile>
): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...profileData, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('Profile updated successfully');
    return data as Profile;
  } catch (error: any) {
    console.error('[auth] Profile update error:', error);
    toast.error(`Profile update failed: ${error.message || 'Unknown error'}`);
    throw error;
  }
};
