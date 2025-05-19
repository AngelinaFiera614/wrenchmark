
import React from 'react';
import { Motorcycle } from '@/types';
import { MotorcycleModel } from '@/types/motorcycle';
import ComparisonSectionHeader from '../ComparisonSectionHeader';

interface ComparisonOverviewProps {
  motorcycles?: Motorcycle[];
  models?: MotorcycleModel[];
  getSelectedYear?: (model: MotorcycleModel) => any;
  getSelectedConfig?: (model: MotorcycleModel) => any;
}

export default function ComparisonOverview({ 
  motorcycles = [], 
  models = [],
  getSelectedYear,
  getSelectedConfig
}: ComparisonOverviewProps) {
  const hasMotorcycles = motorcycles && motorcycles.length > 0;
  const hasModels = models && models.length > 0;

  if (!hasMotorcycles && !hasModels) {
    return <div className="text-center py-8 text-muted-foreground">No motorcycles to compare</div>;
  }

  return (
    <div>
      <ComparisonSectionHeader title="Overview" />
      
      {hasMotorcycles && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {motorcycles.map((motorcycle) => (
            <div key={motorcycle.id} className="bg-muted/30 border border-border rounded-lg p-4">
              <h3 className="text-lg font-medium">{motorcycle.model || motorcycle.id}</h3>
              <div className="mt-2 text-sm text-muted-foreground">
                <p>{motorcycle.details?.description || 'No description available'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasModels && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {models.map((model) => {
            const selectedYear = getSelectedYear?.(model);
            const selectedConfig = getSelectedConfig?.(model);
            
            return (
              <div key={model.id} className="bg-muted/30 border border-border rounded-lg p-4">
                <h3 className="text-lg font-medium">{model.name}</h3>
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>{selectedYear?.description || model.description || 'No description available'}</p>
                  {selectedConfig && (
                    <p className="mt-2 text-xs text-accent-teal">
                      {selectedConfig.name} configuration
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
