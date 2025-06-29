
import { useState, useEffect } from 'react';
import { calculateDataCompleteness, DataCompletion } from '@/utils/dataCompleteness';
import { Motorcycle } from '@/types';

export function useMotorcycleCompleteness(motorcycle: Motorcycle | null) {
  const [completeness, setCompleteness] = useState<DataCompletion | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!motorcycle) {
      setCompleteness(null);
      return;
    }

    setLoading(true);
    calculateDataCompleteness(motorcycle)
      .then(setCompleteness)
      .catch((error) => {
        console.error('Error calculating completeness:', error);
        setCompleteness(null);
      })
      .finally(() => setLoading(false));
  }, [motorcycle]);

  return { completeness, loading };
}
