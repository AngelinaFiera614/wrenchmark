
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import ModelAssignmentInterface from '../../ModelAssignmentInterface';

// Mock all dependencies
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Create mock data for integration test
const mockModels = [
  {
    id: 'model-1',
    name: 'Sportster',
    slug: 'harley-davidson-sportster',
    production_start_year: 2020,
    production_end_year: null,
    brands: [{ name: 'Harley-Davidson' }],
    type: 'Cruiser'
  }
];

const mockAssignments = [
  {
    id: 'assignment-1',
    model_id: 'model-1',
    component_type: 'engine',
    component_id: 'engine-1'
  }
];

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

describe('Assignment Workflow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSupabaseFrom.mockImplementation((table: string) => {
      const mockChain = {
        select: vi.fn(() => mockChain),
        eq: vi.fn(() => mockChain),
        order: vi.fn(() => mockChain),
        insert: vi.fn(() => mockChain),
        update: vi.fn(() => mockChain),
        delete: vi.fn(() => mockChain),
        then: vi.fn((callback) => {
          // Return appropriate mock data based on table
          let mockData;
          switch (table) {
            case 'motorcycle_models':
              mockData = { data: mockModels, error: null };
              break;
            case 'model_component_assignments':
              mockData = { data: mockAssignments, error: null };
              break;
            default:
              mockData = { data: [], error: null };
          }
          return Promise.resolve(callback(mockData));
        })
      };
      return mockChain;
    });
  });

  it('completes full assignment workflow', async () => {
    render(
      <TestWrapper>
        <ModelAssignmentInterface />
      </TestWrapper>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Model Component Assignments')).toBeInTheDocument();
    });

    // Check that stats are displayed
    expect(screen.getByText('Total Models')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // Should show 1 model

    // Verify bulk operations button is available
    expect(screen.getByText('Bulk Operations')).toBeInTheDocument();

    // Test search functionality
    const searchInput = screen.getByPlaceholderText('Search models...');
    fireEvent.change(searchInput, { target: { value: 'Sportster' } });
    expect(searchInput).toHaveValue('Sportster');

    // Test tab switching
    const overviewTab = screen.getByText('Assignment Overview');
    fireEvent.click(overviewTab);
    expect(screen.getByText('Assignment analytics coming soon...')).toBeInTheDocument();

    // Switch back to models tab
    const modelsTab = screen.getByText('Model Assignments');
    fireEvent.click(modelsTab);
  });

  it('handles error states gracefully', async () => {
    // Mock an error response
    mockSupabaseFrom.mockImplementation(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({
            data: null,
            error: { message: 'Database error' }
          }))
        }))
      }))
    }));

    render(
      <TestWrapper>
        <ModelAssignmentInterface />
      </TestWrapper>
    );

    // Should still render the interface structure
    await waitFor(() => {
      expect(screen.getByText('Model Component Assignments')).toBeInTheDocument();
    });

    // Should show 0 models due to error
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
