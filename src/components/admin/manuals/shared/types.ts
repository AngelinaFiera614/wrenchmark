
import { ManualType } from '@/types';
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
