
import { useState, useEffect, useCallback } from 'react';
import { GlossaryFormValues } from '@/types/glossary';

interface DraftData {
  values: Partial<GlossaryFormValues>;
  timestamp: number;
  termId?: string;
}

const DRAFT_KEY_PREFIX = 'wrenchmark_glossary_draft_';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
const DRAFT_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export function useGlossaryDraft(termId?: string) {
  const [isDrafting, setIsDrafting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const getDraftKey = useCallback(() => {
    return `${DRAFT_KEY_PREFIX}${termId || 'new'}`;
  }, [termId]);

  const saveDraft = useCallback((values: Partial<GlossaryFormValues>) => {
    const draftData: DraftData = {
      values,
      timestamp: Date.now(),
      termId,
    };

    try {
      localStorage.setItem(getDraftKey(), JSON.stringify(draftData));
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      console.log('Draft saved successfully');
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [getDraftKey, termId]);

  const loadDraft = useCallback((): Partial<GlossaryFormValues> | null => {
    try {
      const stored = localStorage.getItem(getDraftKey());
      if (!stored) return null;

      const draftData: DraftData = JSON.parse(stored);
      
      // Check if draft is expired
      if (Date.now() - draftData.timestamp > DRAFT_EXPIRY) {
        localStorage.removeItem(getDraftKey());
        return null;
      }

      return draftData.values;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  }, [getDraftKey]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(getDraftKey());
    setLastSaved(null);
    setHasUnsavedChanges(false);
  }, [getDraftKey]);

  const hasDraft = useCallback(() => {
    const draft = loadDraft();
    return draft !== null && Object.keys(draft).length > 0;
  }, [loadDraft]);

  // Auto-save functionality
  useEffect(() => {
    if (!isDrafting) return;

    const interval = setInterval(() => {
      // This will be triggered by the form component
      setHasUnsavedChanges(true);
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [isDrafting]);

  // Cleanup expired drafts on mount
  useEffect(() => {
    const cleanupExpiredDrafts = () => {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(DRAFT_KEY_PREFIX)) {
          try {
            const stored = localStorage.getItem(key);
            if (stored) {
              const draftData: DraftData = JSON.parse(stored);
              if (Date.now() - draftData.timestamp > DRAFT_EXPIRY) {
                localStorage.removeItem(key);
              }
            }
          } catch (error) {
            // Remove corrupted drafts
            localStorage.removeItem(key);
          }
        }
      });
    };

    cleanupExpiredDrafts();
  }, []);

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
    isDrafting,
    setIsDrafting,
    lastSaved,
    hasUnsavedChanges,
    setHasUnsavedChanges,
  };
}
