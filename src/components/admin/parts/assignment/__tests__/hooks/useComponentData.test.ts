
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { useComponentData } from '../../hooks/useComponentData';

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

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('useComponentData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock responses
    mockSupabaseFrom.mockImplementation((table: string) => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({
            data: [],
            error: null
          }))
        }))
      }))
    }));
  });

  it('fetches all component types', async () => {
    const { result } = renderHook(() => useComponentData(), {
      wrapper: TestWrapper
    });

    await waitFor(() => {
      expect(result.current.engines).toBeDefined();
      expect(result.current.brakes).toBeDefined();
      expect(result.current.frames).toBeDefined();
      expect(result.current.suspensions).toBeDefined();
      expect(result.current.wheels).toBeDefined();
    });

    // Verify that all tables were queried
    expect(mockSupabaseFrom).toHaveBeenCalledWith('engines');
    expect(mockSupabaseFrom).toHaveBeenCalledWith('brake_systems');
    expect(mockSupabaseFrom).toHaveBeenCalledWith('frames');
    expect(mockSupabaseFrom).toHaveBeenCalledWith('suspensions');
    expect(mockSupabaseFrom).toHaveBeenCalledWith('wheels');
  });

  it('getComponentDataByType returns correct data', async () => {
    const mockEngines = [{ id: '1', name: 'V-Twin' }];
    
    mockSupabaseFrom.mockImplementation((table: string) => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({
            data: table === 'engines' ? mockEngines : [],
            error: null
          }))
        }))
      }))
    }));

    const { result } = renderHook(() => useComponentData(), {
      wrapper: TestWrapper
    });

    await waitFor(() => {
      const engineData = result.current.getComponentDataByType('engine');
      expect(engineData).toEqual(mockEngines);
    });
  });

  it('getComponentDataByType returns empty array for invalid type', async () => {
    const { result } = renderHook(() => useComponentData(), {
      wrapper: TestWrapper
    });

    await waitFor(() => {
      const invalidData = result.current.getComponentDataByType('invalid_type' as any);
      expect(invalidData).toEqual([]);
    });
  });
});
