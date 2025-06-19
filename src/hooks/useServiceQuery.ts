
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ServiceResponse } from "@/services/base/BaseDataService";

export interface UseServiceQueryOptions<T> {
  queryKey: (string | number | boolean | null | undefined)[];
  queryFn: () => Promise<ServiceResponse<T>>;
  enabled?: boolean;
  staleTime?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export function useServiceQuery<T>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 5 * 60 * 1000,
  onSuccess,
  onError
}: UseServiceQueryOptions<T>) {
  const { toast } = useToast();

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await queryFn();
      
      if (!response.success) {
        const errorMessage = response.error || 'An unexpected error occurred';
        onError?.(errorMessage);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
        throw new Error(errorMessage);
      }
      
      if (response.data && onSuccess) {
        onSuccess(response.data);
      }
      
      return response.data;
    },
    enabled,
    staleTime,
    retry: (failureCount, error) => {
      // Don't retry on validation errors or permission errors
      if (error.message.includes('permission') || error.message.includes('required')) {
        return false;
      }
      return failureCount < 2;
    }
  });
}

export interface UseServiceMutationOptions<T, V> {
  mutationFn: (variables: V) => Promise<ServiceResponse<T>>;
  onSuccess?: (data: T, variables: V) => void;
  onError?: (error: string, variables: V) => void;
  invalidateQueries?: (string | number | boolean | null | undefined)[][];
}

export function useServiceMutation<T, V>({
  mutationFn,
  onSuccess,
  onError,
  invalidateQueries = []
}: UseServiceMutationOptions<T, V>) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: V) => {
      const response = await mutationFn(variables);
      
      if (!response.success) {
        const errorMessage = response.error || 'An unexpected error occurred';
        onError?.(errorMessage, variables);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
        throw new Error(errorMessage);
      }
      
      return response.data;
    },
    onSuccess: (data, variables) => {
      onSuccess?.(data!, variables);
      
      // Invalidate specified queries
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
      
      toast({
        title: "Success",
        description: "Operation completed successfully.",
      });
    }
  });
}
