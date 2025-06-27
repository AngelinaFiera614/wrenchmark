
import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { useComponentData } from '../../hooks/useComponentData';
import React from 'react';

// Mock Supabase client
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

describe('useComponentData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock responses
    mockSupabaseFrom.mockImplementation((table: string) => {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: [],
              error: null
            })
          })
        })
      };
    });
  });

  it('fetches component data successfully', async () => {
    const { result } = renderHook(() => useComponentData(), {
      wrapper: TestWrapper
    });

    await waitFor(() => {
      expect(result.current.engines).toEqual([]);
      expect(result.current.brakes).toEqual([]);
      expect(result.current.frames).toEqual([]);
      expect(result.current.suspensions).toEqual([]);
      expect(result.current.wheels).toEqual([]);
    });
  });

  it('provides component data by type', async () => {
    const { result } = renderHook(() => useComponentData(), {
      wrapper: TestWrapper
    });

    await waitFor(() => {
      expect(result.current.getComponentDataByType('engine')).toEqual([]);
      expect(result.current.getComponentDataByType('brake_system')).toEqual([]);
      expect(result.current.getComponentDataByType('frame')).toEqual([]);
      expect(result.current.getComponentDataByType('suspension')).toEqual([]);
      expect(result.current.getComponentDataByType('wheel')).toEqual([]);
    });
  });
});
