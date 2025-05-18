
import { BucketFile } from '../ManualBucketBrowser';
import { ManualWithMotorcycle } from '@/services/manuals/types';
import { ManualType } from '@/types';
import { ImportItem } from '../shared/types';

// Re-export ImportItem for convenience
export type { ImportItem };

export interface BatchImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: (manuals: ManualWithMotorcycle[]) => void;
}

export interface SelectFilesStepProps {
  selectedFiles: BucketFile[];
  onSelectFiles: (files: BucketFile[]) => void;
  onSelectSingleFile: (file: BucketFile) => void;
  onCancel: () => void;
  onContinue: () => void;
}

export interface ConfirmDetailsStepProps {
  importItems: ImportItem[];
  onBack: () => void;
  onStartImport: () => void;
  onManualTypeChange: (fileId: string, manualType: ManualType) => void;
}

export interface ImportProgressStepProps {
  importItems: ImportItem[];
  isProcessing: boolean;
  onDone: () => void;
}

export interface ImportProcessorResult {
  selectedFiles: BucketFile[];
  importItems: ImportItem[];
  isProcessing: boolean;
  step: 'select' | 'confirm' | 'import';
  handleSelectFiles: (files: BucketFile[]) => void;
  handleSelectSingleFile: (file: BucketFile) => void;
  handlePrepareImport: () => void;
  handleManualTypeChange: (fileId: string, manualType: ManualType) => void;
  handleStartImport: () => void;
  processImport: () => Promise<ManualWithMotorcycle[]>;
  resetImport: () => void;
  setStep: (step: 'select' | 'confirm' | 'import') => void;
}
