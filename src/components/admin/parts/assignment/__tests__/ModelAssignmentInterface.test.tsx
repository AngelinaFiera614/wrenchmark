
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { ModelAssignmentInterface } from '../ModelAssignmentInterface';

// Mock the hooks
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
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

describe('ModelAssignmentInterface', () => {
  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <ModelAssignmentInterface />
      </TestWrapper>
    );
    
    expect(screen.getByText('Model Component Assignments')).toBeInTheDocument();
  });

  it('displays stats cards', () => {
    render(
      <TestWrapper>
        <ModelAssignmentInterface />
      </TestWrapper>
    );
    
    expect(screen.getByText('Total Models')).toBeInTheDocument();
    expect(screen.getByText('Fully Assigned')).toBeInTheDocument();
    expect(screen.getByText('Incomplete')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
  });

  it('shows bulk operations button', () => {
    render(
      <TestWrapper>
        <ModelAssignmentInterface />
      </TestWrapper>
    );
    
    expect(screen.getByText('Bulk Operations')).toBeInTheDocument();
  });

  it('has working search functionality', async () => {
    render(
      <TestWrapper>
        <ModelAssignmentInterface />
      </TestWrapper>
    );
    
    const searchInput = screen.getByPlaceholderText('Search models...');
    fireEvent.change(searchInput, { target: { value: 'Honda' } });
    
    expect(searchInput).toHaveValue('Honda');
  });
});
