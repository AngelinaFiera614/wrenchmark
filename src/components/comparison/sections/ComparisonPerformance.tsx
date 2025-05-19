
import React from 'react';
import { Motorcycle } from '@/types';
import ComparisonSectionHeader from '../ComparisonSectionHeader';

interface ComparisonPerformanceProps {
  motorcycles?: Motorcycle[];
  // Add future props for model comparison
}

export default function ComparisonPerformance({ motorcycles = [] }: ComparisonPerformanceProps) {
  return (
    <div>
      <ComparisonSectionHeader title="Performance" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {motorcycles.map((motorcycle) => (
          <div key={motorcycle.id} className="bg-muted/30 border border-border rounded-lg p-4">
            <h3 className="text-lg font-medium">{motorcycle.name}</h3>
            <div className="mt-2 text-sm">
              <p>Power: {motorcycle.power || 'N/A'}</p>
              <p>Torque: {motorcycle.torque || 'N/A'}</p>
              <p>Top Speed: {motorcycle.topSpeed || 'N/A'}</p>
              <p>0-60 mph: {motorcycle.acceleration || 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
