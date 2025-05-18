
import React from 'react';
import { Button } from "@/components/ui/button";
import { ImportItem } from '../shared/types';
import { ManualType } from '@/types';

interface ConfirmDetailsStepProps {
  importItems: ImportItem[];
  onBack: () => void;
  onStartImport: () => void;
  onManualTypeChange: (fileId: string, manualType: ManualType) => void;
}

const ConfirmDetailsStep: React.FC<ConfirmDetailsStepProps> = ({
  importItems,
  onBack,
  onStartImport,
  onManualTypeChange
}) => {
  return (
    <>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">
          Review and confirm the details for each manual before importing. 
          You can change the manual type if needed.
        </p>
      </div>
      
      <div className="border rounded-md">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">File Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Make</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Model</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Year</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {importItems.map(item => (
              <tr key={item.id} className="text-sm">
                <td className="px-4 py-3 truncate max-w-[200px]">
                  {item.name}
                </td>
                <td className="px-4 py-3">{item.make}</td>
                <td className="px-4 py-3">{item.model}</td>
                <td className="px-4 py-3">{item.year}</td>
                <td className="px-4 py-3">
                  <select
                    value={item.manualType}
                    onChange={(e) => onManualTypeChange(
                      item.id, 
                      e.target.value as ManualType
                    )}
                    className="border rounded px-2 py-1 text-sm bg-background"
                  >
                    <option value="owner">Owner</option>
                    <option value="service">Service</option>
                    <option value="wiring">Wiring</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button
          variant="outline"
          className="mr-2"
          onClick={onBack}
        >
          Back
        </Button>
        <Button onClick={onStartImport}>
          Start Import
        </Button>
      </div>
    </>
  );
};

export default ConfirmDetailsStep;
