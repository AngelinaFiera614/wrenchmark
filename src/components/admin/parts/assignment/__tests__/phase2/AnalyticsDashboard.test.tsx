
import { render } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import { vi, describe, it, expect } from 'vitest';
import AnalyticsDashboard from '../../phase2/AnalyticsDashboard';

describe('AnalyticsDashboard', () => {
  it('renders analytics dashboard', () => {
    render(<AnalyticsDashboard />);
    
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Component assignment insights and trends')).toBeInTheDocument();
  });

  it('displays key metrics', () => {
    render(<AnalyticsDashboard />);
    
    expect(screen.getByText('Total Models')).toBeInTheDocument();
    expect(screen.getByText('Fully Assigned')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
  });

  it('shows component usage statistics', () => {
    render(<AnalyticsDashboard />);
    
    expect(screen.getByText('Component Usage Statistics')).toBeInTheDocument();
    expect(screen.getByText('Engine')).toBeInTheDocument();
    expect(screen.getByText('Brake System')).toBeInTheDocument();
  });

  it('handles time range changes', () => {
    const mockTimeRangeChange = vi.fn();
    
    render(<AnalyticsDashboard onTimeRangeChange={mockTimeRangeChange} />);
    
    const sevenDayButton = screen.getByText('7d');
    fireEvent.click(sevenDayButton);
    
    expect(mockTimeRangeChange).toHaveBeenCalledWith('7d');
  });

  it('displays performance insights', () => {
    render(<AnalyticsDashboard />);
    
    expect(screen.getByText('Performance Insights')).toBeInTheDocument();
    expect(screen.getByText('Most Popular Component')).toBeInTheDocument();
  });
});
