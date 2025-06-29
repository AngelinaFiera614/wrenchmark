
import { useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';

export function useDebounceRefresh(refreshFn: () => void, delay: number = 500) {
  const refreshCallRef = useRef<() => void>();
  
  refreshCallRef.current = refreshFn;
  
  const debouncedRefresh = useCallback(() => {
    if (refreshCallRef.current) {
      refreshCallRef.current();
    }
  }, []);

  const debouncedCall = useDebounce(debouncedRefresh, delay);
  
  return useCallback(() => {
    debouncedCall();
  }, [debouncedCall]);
}
