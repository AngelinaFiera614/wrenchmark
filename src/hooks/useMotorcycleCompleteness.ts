
import { useState, useEffect, useMemo } from 'react';
import { calculateDataCompleteness, DataCompletion } from '@/utils/dataCompleteness';
import { Motorcycle } from '@/types';

// Cache to prevent multiple simultaneous calculations for the same motorcycle
const completenessCache = new Map<string, Promise<DataCompletion>>();
const completenessResults = new Map<string, DataCompletion>();

export function useMotorcycleCompleteness(motorcycle: Motorcycle | null) {
  const [completeness, setCompleteness] = useState<DataCompletion | null>(null);
  const [loading, setLoading] = useState(false);

  // Memoize the motorcycle key to prevent unnecessary recalculations
  const motorcycleKey = useMemo(() => {
    if (!motorcycle) return null;
    return `${motorcycle.id}-${motorcycle.updated_at || motorcycle.created_at}`;
  }, [motorcycle?.id, motorcycle?.updated_at, motorcycle?.created_at]);

  useEffect(() => {
    if (!motorcycleKey || !motorcycle) {
      setCompleteness(null);
      setLoading(false);
      return;
    }

    // Check if we already have the result cached
    const cachedResult = completenessResults.get(motorcycleKey);
    if (cachedResult) {
      setCompleteness(cachedResult);
      setLoading(false);
      return;
    }

    // Check if calculation is already in progress
    let calculationPromise = completenessCache.get(motorcycleKey);
    
    if (!calculationPromise) {
      // Start new calculation
      setLoading(true);
      calculationPromise = calculateDataCompleteness(motorcycle);
      completenessCache.set(motorcycleKey, calculationPromise);
    } else {
      // Calculation already in progress, just set loading if we don't have cached result
      if (!cachedResult) {
        setLoading(true);
      }
    }

    calculationPromise
      .then((result) => {
        completenessResults.set(motorcycleKey, result);
        completenessCache.delete(motorcycleKey);
        setCompleteness(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error calculating completeness:', error);
        completenessCache.delete(motorcycleKey);
        setCompleteness(null);
        setLoading(false);
      });

  }, [motorcycleKey, motorcycle]);

  return { completeness, loading };
}

// Utility function to clear cache when needed
export function clearCompletenessCache() {
  completenessCache.clear();
  completenessResults.clear();
}
