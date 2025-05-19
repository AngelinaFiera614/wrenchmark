
import { useState, useCallback } from "react";
import { Session } from "@supabase/supabase-js";
import { useAuthListener } from "./useAuthListener";
import { useSessionInit } from "./useSessionInit";
import type { AdminVerificationState } from "@/context/auth/types";

export interface AuthInitializationProps {
  setSession: (session: Session | null) => void;
  setUser: (user: any) => void;
  setIsLoading: (isLoading: boolean) => void;
  fetchProfile: (userId: string) => Promise<void>;
  setIsProfileLoading: (isLoading: boolean) => void;
  setAdminVerificationState: (state: AdminVerificationState) => void;
}

export function useAuthInitialization({
  setSession,
  setUser,
  setIsLoading,
  fetchProfile,
  setIsProfileLoading,
  setAdminVerificationState
}: AuthInitializationProps) {
  const [isProcessingAuthEvents, setIsProcessingAuthEvents] = useState(false);
  const [authStateEventQueue, setAuthStateEventQueue] = useState<Array<{event: string, session: Session | null}>>([]);
  
  // Process auth events one at a time to prevent race conditions
  const processAuthEventQueue = useCallback(async () => {
    if (isProcessingAuthEvents || authStateEventQueue.length === 0) {
      return;
    }
    
    setIsProcessingAuthEvents(true);
    const { event, session } = authStateEventQueue[0];
    setAuthStateEventQueue(prevQueue => prevQueue.slice(1));
    
    console.log(`[useAuthInitialization] Processing auth event: ${event}`);
    
    // Special handling for token refresh events to preserve admin state
    const preserveAdminVerification = (
      event === 'TOKEN_REFRESHED' || 
      event === 'REFRESHED' ||
      event === 'SIGNED_IN'
    );
    
    if (!preserveAdminVerification) {
      // Only reset admin verification for non-refresh events
      setAdminVerificationState('pending');
    } else {
      console.log(`[useAuthInitialization] Preserving admin verification state for ${event} event`);
    }
    
    setSession(session);
    setUser(session?.user ?? null);
    
    if (session?.user) {
      console.log(`[useAuthInitialization] Auth event processed, fetching profile for: ${session.user.id}`);
      setIsProfileLoading(true);
      
      try {
        await fetchProfile(session.user.id);
      } catch (err) {
        console.error("[useAuthInitialization] Error in fetchProfile during queue processing:", err);
        if (!preserveAdminVerification) {
          setAdminVerificationState('failed');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // No user session
      setIsLoading(false);
      setAdminVerificationState('unknown');
    }
    
    setIsProcessingAuthEvents(false);
    
    // Process next event if available with a small delay to prevent race conditions
    if (authStateEventQueue.length > 0) {
      setTimeout(() => processAuthEventQueue(), 50);
    }
  }, [
    authStateEventQueue, 
    isProcessingAuthEvents, 
    setAdminVerificationState, 
    setIsLoading, 
    setIsProfileLoading, 
    setSession, 
    setUser,
    fetchProfile
  ]);
  
  // Handle auth state changes callback
  const handleAuthStateChange = useCallback((event: string, currentSession: Session | null) => {
    console.log(`[useAuthInitialization] Auth event: ${event}, user: ${currentSession?.user?.email || "none"}`);
    
    // Add event to queue
    setAuthStateEventQueue(prevQueue => [...prevQueue, { event, session: currentSession }]);
    
    // Start processing if not already processing
    if (!isProcessingAuthEvents) {
      setTimeout(() => processAuthEventQueue(), 0);
    }
  }, [isProcessingAuthEvents, processAuthEventQueue]);
  
  // Set up auth listener
  useAuthListener(handleAuthStateChange);
  
  // Initialize session
  useSessionInit(handleAuthStateChange, true);
}
