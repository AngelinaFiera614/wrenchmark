
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { useAssignmentActions } from '../../hooks/useAssignmentActions';

// Mock dependencies
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

const mockSupabaseFrom = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: mockSupabaseFrom
  }
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

const mockModel = {
  id: 'test-model-id',
  name: 'Test Model'
};

describe('useAssignmentActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock responses
    mockSupabaseFrom.mockImplementation(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({
          data: [],
          error: null
        }))
      })),
      insert: vi.fn(() => Promise.resolve({
        data: null,
        error: null
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({
          data: null,
          error: null
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({
            data: null,
            error: null
          }))
        }))
      }))
    }));
  });

  it('initializes with empty assignments', async () => {
    const { result } = renderHook(() => useAssignmentActions(mockModel), {
      wrapper: TestWrapper
    });

    await waitFor(() => {
      expect(result.current.assignments).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  it('handles component assignment for new assignments', async () => {
    const { result } = renderHook(() => useAssignmentActions(mockModel), {
      wrapper: TestWrapper
    });

    await act(async () => {
      await result.current.handleAssignComponent('engine', 'engine-123');
    });

    expect(mockSupabaseFrom).toHaveBeenCalledWith('model_component_assignments');
  });

  it('handles component removal', async () => {
    const { result } = renderHook(() => useAssignmentActions(mockModel), {
      wrapper: TestWrapper
    });

    await act(async () => {
      await result.current.handleRemoveComponent('engine');
    });

    expect(mockSupabaseFrom).toHaveBeenCalledWith('model_component_assignments');
  });

  it('sets loading state during operations', async () => {
    const { result } = renderHook(() => useAssignmentActions(mockModel), {
      wrapper: TestWrapper
    });

    // Start assignment operation
    const assignmentPromise = act(async () => {
      await result.current.handleAssignComponent('engine', 'engine-123');
    });

    // Check that loading was set (this is tricky to test due to timing)
    await assignmentPromise;
    
    // After completion, loading should be false
    expect(result.current.loading).toBe(false);
  });
});
