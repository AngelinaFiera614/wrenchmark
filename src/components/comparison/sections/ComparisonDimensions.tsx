
import React from 'react';
import { Motorcycle } from '@/types';
import { MotorcycleModel } from '@/types/motorcycle';
import ComparisonSectionHeader from '../ComparisonSectionHeader';
import { useMeasurement } from '@/context/MeasurementContext';
import { formatLength, formatWeight } from '@/utils/unitConverters';

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
  const { unit } = useMeasurement();

  return (
    <div>
      <ComparisonSectionHeader title="Dimensions" />
      
      {hasMotorcycles && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {motorcycles.map((motorcycle) => (
            <div key={motorcycle.id} className="bg-muted/30 border border-border rounded-lg p-4">
              <h3 className="text-lg font-medium">{motorcycle.model || motorcycle.id}</h3>
              <div className="mt-2 text-sm">
                <p>Length: {formatLength((motorcycle as any)?.details?.length, unit)}</p>
                <p>Width: {formatLength((motorcycle as any)?.details?.width, unit)}</p>
                <p>Height: {formatLength((motorcycle as any)?.details?.height, unit)}</p>
                <p>Weight: {formatWeight((motorcycle as any)?.details?.weight, unit)}</p>
                <p>Seat Height: {formatLength((motorcycle as any)?.details?.seatHeight, unit)}</p>
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
                  <p>Length: {formatLength(selectedConfig?.specs?.length || selectedYear?.specs?.length, unit)}</p>
                  <p>Width: {formatLength(selectedConfig?.specs?.width || selectedYear?.specs?.width, unit)}</p>
                  <p>Height: {formatLength(selectedConfig?.specs?.height || selectedYear?.specs?.height, unit)}</p>
                  <p>Weight: {formatWeight(selectedConfig?.specs?.weight || selectedYear?.specs?.weight, unit)}</p>
                  <p>Seat Height: {formatLength(selectedConfig?.specs?.seatHeight || selectedYear?.specs?.seatHeight, unit)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
