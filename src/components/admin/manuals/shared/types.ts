
import { ManualType } from '@/types/manual';
import { BucketFile } from '../ManualBucketBrowser';
import { ManualWithMotorcycle } from '@/services/manuals/types';

export interface ImportItem extends BucketFile {
  status: "pending" | "processing" | "success" | "error";
  manualType: ManualType;
  make: string;
  model: string;
  year: number | null;
  errorMessage?: string;
  importedManual?: ManualWithMotorcycle;
}

// Shared component interfaces
export interface SharedTitleFieldProps {
  control: Control<any>;
  name?: string;
  disabled?: boolean;
}

export interface SharedManualTypeFieldProps {
  control: Control<any>;
  name?: string;
  disabled?: boolean;
}

export interface SharedMotorcycleFieldsProps {
  control: Control<any>;
  disabled?: boolean;
}

export interface SharedFormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

// Need to import this for the control type
import { Control } from 'react-hook-form';
