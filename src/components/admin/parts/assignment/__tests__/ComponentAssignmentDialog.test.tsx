
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import ComponentAssignmentDialog from '../ComponentAssignmentDialog';

// Mock the hooks
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({
            data: [],
            error: null
          }))
        }))
      }))
    }))
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

const mockModel = {
  id: 'test-model-id',
  name: 'Test Model',
  brands: [{ name: 'Test Brand' }]
};

describe('ComponentAssignmentDialog', () => {
  it('renders when open', () => {
    render(
      <TestWrapper>
        <ComponentAssignmentDialog
          open={true}
          onClose={vi.fn()}
          model={mockModel}
          onSuccess={vi.fn()}
        />
      </TestWrapper>
    );
    
    expect(screen.getByText('Component Assignments')).toBeInTheDocument();
    expect(screen.getByText('Test Brand Test Model')).toBeInTheDocument();
  });

  it('shows inheritance information', () => {
    render(
      <TestWrapper>
        <ComponentAssignmentDialog
          open={true}
          onClose={vi.fn()}
          model={mockModel}
          onSuccess={vi.fn()}
        />
      </TestWrapper>
    );
    
    expect(screen.getByText('Model-Level Assignment')).toBeInTheDocument();
    expect(screen.getByText(/Components assigned here will be inherited/)).toBeInTheDocument();
  });

  it('displays all component types', () => {
    render(
      <TestWrapper>
        <ComponentAssignmentDialog
          open={true}
          onClose={vi.fn()}
          model={mockModel}
          onSuccess={vi.fn()}
        />
      </TestWrapper>
    );
    
    expect(screen.getByText('Engine')).toBeInTheDocument();
    expect(screen.getByText('Brake System')).toBeInTheDocument();
    expect(screen.getByText('Frame')).toBeInTheDocument();
    expect(screen.getByText('Suspension')).toBeInTheDocument();
    expect(screen.getByText('Wheels')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    
    render(
      <TestWrapper>
        <ComponentAssignmentDialog
          open={true}
          onClose={onClose}
          model={mockModel}
          onSuccess={vi.fn()}
        />
      </TestWrapper>
    );
    
    fireEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });
});
