
import React from 'react';
import { Motorcycle } from '@/types';
import { MotorcycleModel } from '@/types/motorcycle';
import ComparisonSectionHeader from '../ComparisonSectionHeader';

interface ComparisonDimensionsProps {
  motorcycles?: Motorcycle[];
  models?: MotorcycleModel[];
  getSelectedYear?: (model: MotorcycleModel) => any;
  getSelectedConfig?: (model: MotorcycleModel) => any;
}

export default function ComparisonDimensions({ 
  motorcycles = [],
  models = [],
  getSelectedYear,
  getSelectedConfig 
}: ComparisonDimensionsProps) {
  const hasMotorcycles = motorcycles && motorcycles.length > 0;
  const hasModels = models && models.length > 0;

  return (
    <div>
      <ComparisonSectionHeader title="Dimensions" />
      
      {hasMotorcycles && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {motorcycles.map((motorcycle) => (
            <div key={motorcycle.id} className="bg-muted/30 border border-border rounded-lg p-4">
              <h3 className="text-lg font-medium">{motorcycle.model || motorcycle.id}</h3>
              <div className="mt-2 text-sm">
                <p>Length: {(motorcycle as any)?.details?.length || 'N/A'}</p>
                <p>Width: {(motorcycle as any)?.details?.width || 'N/A'}</p>
                <p>Height: {(motorcycle as any)?.details?.height || 'N/A'}</p>
                <p>Weight: {(motorcycle as any)?.details?.weight || 'N/A'}</p>
                <p>Seat Height: {(motorcycle as any)?.details?.seatHeight || 'N/A'}</p>
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
                  <p>Length: {selectedConfig?.specs?.length || selectedYear?.specs?.length || 'N/A'}</p>
                  <p>Width: {selectedConfig?.specs?.width || selectedYear?.specs?.width || 'N/A'}</p>
                  <p>Height: {selectedConfig?.specs?.height || selectedYear?.specs?.height || 'N/A'}</p>
                  <p>Weight: {selectedConfig?.specs?.weight || selectedYear?.specs?.weight || 'N/A'}</p>
                  <p>Seat Height: {selectedConfig?.specs?.seatHeight || selectedYear?.specs?.seatHeight || 'N/A'}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
