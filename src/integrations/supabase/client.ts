
import { createClient } from '@supabase/supabase-js';

// The URL and key should be accessible from the environment
const supabaseUrl = 'https://njjstrqrwjygwyujdrzk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qanN0cnFyd2p5Z3d5dWpkcnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxOTU2NjcsImV4cCI6MjA2Mjc3MTY2N30.0fk1WVTBTxEaM4XodIyrJyhIzYPz_orsGK_c-WlJjJw';

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false // Changed to false to prevent URL parsing issues
  }
});
