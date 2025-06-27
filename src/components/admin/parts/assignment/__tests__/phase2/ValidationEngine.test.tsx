
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { vi } from 'vitest';
import ValidationEngine from '../../phase2/ValidationEngine';

describe('ValidationEngine', () => {
  const mockComponents = {
    engine: {
      id: 'engine-1',
      name: 'V-Twin 883cc',
      power_hp: 50,
      displacement_cc: 883
    },
    brake_system: {
      id: 'brake-1',
      type: 'Standard Disc',
      has_abs: false
    },
    frame: {
      id: 'frame-1',
      type: 'Steel Tubular'
    }
  };

  it('renders validation engine with components', () => {
    render(
      <ValidationEngine
        components={mockComponents}
        onValidationComplete={vi.fn()}
      />
    );
    
    expect(screen.getByText('Validation Engine')).toBeInTheDocument();
    expect(screen.getByText('Overall Score')).toBeInTheDocument();
  });

  it('shows validation results', () => {
    render(
      <ValidationEngine
        components={mockComponents}
        onValidationComplete={vi.fn()}
      />
    );
    
    expect(screen.getByText('Engine-Brake Compatibility')).toBeInTheDocument();
    expect(screen.getByText('Component Completeness')).toBeInTheDocument();
  });

  it('calls onValidationComplete when validation runs', () => {
    const mockCallback = vi.fn();
    
    render(
      <ValidationEngine
        components={mockComponents}
        onValidationComplete={mockCallback}
      />
    );
    
    expect(mockCallback).toHaveBeenCalled();
  });

  it('handles empty components', () => {
    render(
      <ValidationEngine
        components={{}}
        onValidationComplete={vi.fn()}
      />
    );
    
    expect(screen.getByText('Validation Engine')).toBeInTheDocument();
  });
});
