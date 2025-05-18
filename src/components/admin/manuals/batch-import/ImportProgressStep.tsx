
import React from 'react';
import { Loader2, Check, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ImportProgressStepProps } from './types';

const ImportProgressStep: React.FC<ImportProgressStepProps> = ({
  importItems,
  isProcessing,
  onDone
}) => {
  return (
    <>
      <div className="border rounded-md">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">File Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Make/Model</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {importItems.map(item => (
              <tr key={item.id} className="text-sm">
                <td className="px-4 py-3 truncate max-w-[200px]">
                  {item.name}
                </td>
                <td className="px-4 py-3">
                  {item.make} {item.model} {item.year}
                </td>
                <td className="px-4 py-3 capitalize">
                  {item.manualType}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    {item.status === 'pending' && (
                      <span className="text-muted-foreground">Pending</span>
                    )}
                    {item.status === 'processing' && (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2 text-accent-teal" />
                        <span>Processing</span>
                      </>
                    )}
                    {item.status === 'success' && (
                      <>
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-green-500">Success</span>
                      </>
                    )}
                    {item.status === 'error' && (
                      <>
                        <X className="h-4 w-4 mr-2 text-red-500" />
                        <span className="text-red-500">Error</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 ml-1 text-red-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              {item.errorMessage || 'Unknown error'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <Button 
          onClick={onDone} 
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Done'
          )}
        </Button>
      </div>
    </>
  );
};

export default ImportProgressStep;
