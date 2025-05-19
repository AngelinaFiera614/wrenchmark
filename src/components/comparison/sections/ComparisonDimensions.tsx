
import React from 'react';
import { Motorcycle } from '@/types';
import ComparisonSectionHeader from '../ComparisonSectionHeader';

interface ComparisonDimensionsProps {
  motorcycles?: Motorcycle[];
  // Add future props for model comparison
}

export default function ComparisonDimensions({ motorcycles = [] }: ComparisonDimensionsProps) {
  return (
    <div>
      <ComparisonSectionHeader title="Dimensions" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {motorcycles.map((motorcycle) => (
          <div key={motorcycle.id} className="bg-muted/30 border border-border rounded-lg p-4">
            <h3 className="text-lg font-medium">{motorcycle.name}</h3>
            <div className="mt-2 text-sm">
              <p>Length: {motorcycle.length || 'N/A'}</p>
              <p>Width: {motorcycle.width || 'N/A'}</p>
              <p>Height: {motorcycle.height || 'N/A'}</p>
              <p>Weight: {motorcycle.weight || 'N/A'}</p>
              <p>Seat Height: {motorcycle.seatHeight || 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
