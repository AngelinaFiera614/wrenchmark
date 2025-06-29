
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useComponentAssignmentRefresh() {
  const queryClient = useQueryClient();

  const refreshAfterAssignment = useCallback(async (modelId: string) => {
    console.log(`Refreshing data after assignment for model: ${modelId}`);
    
    // Invalidate specific queries that depend on component assignments
    await Promise.all([
      // Model component assignments
      queryClient.invalidateQueries({
        queryKey: ['model-component-assignments', modelId]
      }),
      
      // General model assignments status
      queryClient.invalidateQueries({
        queryKey: ['model-assignments-status']
      }),
      
      // Admin motorcycle queries that include completeness data
      queryClient.invalidateQueries({
        queryKey: ['admin-motorcycle-models']
      }),
      
      // Any motorcycles queries
      queryClient.invalidateQueries({
        queryKey: ['motorcycles']
      }),
      
      // Models with assignments
      queryClient.invalidateQueries({
        queryKey: ['models-with-assignments']
      })
    ]);

    console.log('Query invalidation complete');
  }, [queryClient]);

  const refreshAllAssignments = useCallback(async () => {
    console.log('Refreshing all assignment data');
    
    // Invalidate all related queries
    await Promise.all([
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && (
            queryKey.includes('motorcycles') ||
            queryKey.includes('models-with-assignments') ||
            queryKey.includes('model-assignments') ||
            queryKey.some(key => 
              typeof key === 'string' && (
                key.includes('completeness') ||
                key.includes('assignment')
              )
            )
          );
        }
      })
    ]);

    console.log('All queries invalidated');
  }, [queryClient]);

  return {
    refreshAfterAssignment,
    refreshAllAssignments
  };
}
