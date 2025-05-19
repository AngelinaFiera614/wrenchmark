
import React from 'react';
import { Motorcycle } from '@/types';
import { MotorcycleModel } from '@/types/motorcycle';
import ComparisonSectionHeader from '../ComparisonSectionHeader';

interface ComparisonPerformanceProps {
  motorcycles?: Motorcycle[];
  models?: MotorcycleModel[];
  getSelectedYear?: (model: MotorcycleModel) => any;
  getSelectedConfig?: (model: MotorcycleModel) => any;
}

export default function ComparisonPerformance({ 
  motorcycles = [],
  models = [],
  getSelectedYear,
  getSelectedConfig 
}: ComparisonPerformanceProps) {
  const hasMotorcycles = motorcycles && motorcycles.length > 0;
  const hasModels = models && models.length > 0;

  return (
    <div>
      <ComparisonSectionHeader title="Performance" />
      
      {hasMotorcycles && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {motorcycles.map((motorcycle) => (
            <div key={motorcycle.id} className="bg-muted/30 border border-border rounded-lg p-4">
              <h3 className="text-lg font-medium">{motorcycle.model || motorcycle.id}</h3>
              <div className="mt-2 text-sm">
                <p>Power: {motorcycle.details?.power || 'N/A'}</p>
                <p>Torque: {motorcycle.details?.torque || 'N/A'}</p>
                <p>Top Speed: {motorcycle.details?.topSpeed || 'N/A'}</p>
                <p>0-60 mph: {motorcycle.details?.acceleration || 'N/A'}</p>
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
                <div className="mt-2 text-sm">
                  <p>Power: {selectedConfig?.specs?.power || selectedYear?.specs?.power || 'N/A'}</p>
                  <p>Torque: {selectedConfig?.specs?.torque || selectedYear?.specs?.torque || 'N/A'}</p>
                  <p>Top Speed: {selectedConfig?.specs?.topSpeed || selectedYear?.specs?.topSpeed || 'N/A'}</p>
                  <p>0-60 mph: {selectedConfig?.specs?.acceleration || selectedYear?.specs?.acceleration || 'N/A'}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
