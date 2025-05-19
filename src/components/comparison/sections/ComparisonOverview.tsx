
import React from 'react';
import { Motorcycle } from '@/types';
import ComparisonSectionHeader from '../ComparisonSectionHeader';

interface ComparisonOverviewProps {
  motorcycles?: Motorcycle[];
  // Add future props for model comparison
}

export default function ComparisonOverview({ motorcycles = [] }: ComparisonOverviewProps) {
  return (
    <div>
      <ComparisonSectionHeader title="Overview" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {motorcycles.map((motorcycle) => (
          <div key={motorcycle.id} className="bg-muted/30 border border-border rounded-lg p-4">
            <h3 className="text-lg font-medium">{motorcycle.name}</h3>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>{motorcycle.description || 'No description available'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
