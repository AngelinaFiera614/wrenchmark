
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { useAssignmentActions } from '../../hooks/useAssignmentActions';
import React from 'react';

// Mock Supabase client
const mockSupabaseFrom = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: mockSupabaseFrom
  }
}));

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

interface TestWrapperProps {
  children: React.ReactNode;
}

function TestWrapper({ children }: TestWrapperProps) {
  return React.createElement(
    QueryClientProvider,
    { client: createTestQueryClient() },
    children
  );
}

const mockModel = {
  id: 'test-model-id',
  name: 'Test Model',
  brands: [{ name: 'Test Brand' }]
};

describe('useAssignmentActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock responses
    mockSupabaseFrom.mockImplementation((table: string) => {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [],
            error: null
          })
        }),
        insert: vi.fn().mockResolvedValue({
          data: null,
          error: null
        })
      };
    });
  });

  it('initializes with empty assignments', async () => {
    const { result } = renderHook(() => useAssignmentActions(mockModel), {
      wrapper: TestWrapper
    });

    expect(result.current.assignments).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('handles component assignment', async () => {
    const { result } = renderHook(() => useAssignmentActions(mockModel), {
      wrapper: TestWrapper
    });

    await waitFor(() => {
      result.current.handleAssignComponent('engine', 'test-engine-id');
    });

    expect(mockSupabaseFrom).toHaveBeenCalledWith('model_component_assignments');
  });

  it('handles component removal', async () => {
    const { result } = renderHook(() => useAssignmentActions(mockModel), {
      wrapper: TestWrapper
    });

    await waitFor(() => {
      result.current.handleRemoveComponent('engine');
    });

    expect(mockSupabaseFrom).toHaveBeenCalled();
  });
});
