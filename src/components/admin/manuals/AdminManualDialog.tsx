
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ManualWithMotorcycle } from '@/services/manuals';
import ManualForm from './ManualForm';
import ImportManualForm from './ImportManualForm';
import { useManualSubmit } from '@/hooks/useManualSubmit';
import { ManualFormValues } from './ManualFormSchema';
import { ImportManualFormValues } from './ImportManualForm';

interface AdminManualDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  manual: ManualWithMotorcycle | null;
  onSaveSuccess: (savedManual: ManualWithMotorcycle) => void;
}

const AdminManualDialog: React.FC<AdminManualDialogProps> = ({ 
  open, 
  onOpenChange, 
  manual, 
  onSaveSuccess 
}) => {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const { handleSubmit, handleImport, isSubmitting } = useManualSubmit({ 
    onOpenChange, 
    onSaveSuccess,
    manualId: manual?.id 
  });
  
  // Extract motorcycle details if editing an existing manual
  const defaultValues = manual 
    ? (() => {
        const [make, ...modelParts] = manual.motorcycle_name?.split(' ') || [];
        // Extract year from the end of the model name
        const yearString = modelParts[modelParts.length - 1];
        const year = !isNaN(Number(yearString)) ? Number(yearString) : new Date().getFullYear();
        // Join the remaining parts as the model name
        const model = modelParts.slice(0, -1).join(' ');
        
        return {
          title: manual.title,
          manual_type: manual.manual_type,
          make,
          model,
          year,
        };
      })()
    : {};
  
  // Close form when dialog is closed
  useEffect(() => {
    if (!open) {
      // Form will be reset by the ManualForm component when it unmounts
    }
  }, [open]);

  // Reset to upload tab when dialog opens for a fresh start
  useEffect(() => {
    if (open) {
      // If editing, always use the upload tab
      setActiveTab(manual ? "upload" : "upload");
    }
  }, [open, manual]);

  const handleFormSubmit = async (values: ManualFormValues) => {
    await handleSubmit(values);
  };

  const handleImportSubmit = async (values: ImportManualFormValues) => {
    await handleImport(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{manual ? 'Edit Manual' : 'Add Manual'}</DialogTitle>
        </DialogHeader>
        
        {manual ? (
          // When editing, only show the upload form
          <ManualForm
            defaultValues={defaultValues}
            onSubmit={handleFormSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
          />
        ) : (
          // When creating, show tabs for upload and import
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="upload">Upload New</TabsTrigger>
              <TabsTrigger value="import">Import Existing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              <ManualForm
                defaultValues={defaultValues}
                onSubmit={handleFormSubmit}
                onCancel={() => onOpenChange(false)}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
            
            <TabsContent value="import">
              <ImportManualForm
                onSubmit={handleImportSubmit}
                onCancel={() => onOpenChange(false)}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminManualDialog;
