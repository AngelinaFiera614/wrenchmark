
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useComponentAssignmentRefresh() {
  const queryClient = useQueryClient();

  const refreshAfterAssignment = useCallback((modelId: string) => {
    // Invalidate queries related to the specific model
    queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        return (
          // Invalidate motorcycle queries
          (Array.isArray(queryKey) && queryKey.includes('motorcycles')) ||
          // Invalidate specific model queries
          (Array.isArray(queryKey) && queryKey.includes(modelId)) ||
          // Invalidate completeness queries
          (Array.isArray(queryKey) && queryKey.some(key => 
            typeof key === 'string' && key.includes('completeness')
          )) ||
          // Invalidate model assignments
          (Array.isArray(queryKey) && queryKey.includes('model-assignments'))
        );
      }
    });

    // Also refetch any cached data for this specific model
    queryClient.refetchQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        return Array.isArray(queryKey) && queryKey.includes(modelId);
      }
    });
  }, [queryClient]);

  const refreshAllAssignments = useCallback(() => {
    // Invalidate all related queries
    queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        return (
          Array.isArray(queryKey) && (
            queryKey.includes('motorcycles') ||
            queryKey.includes('models-with-assignments') ||
            queryKey.includes('model-assignments') ||
            queryKey.some(key => 
              typeof key === 'string' && key.includes('completeness')
            )
          )
        );
      }
    });
  }, [queryClient]);

  return {
    refreshAfterAssignment,
    refreshAllAssignments
  };
}
