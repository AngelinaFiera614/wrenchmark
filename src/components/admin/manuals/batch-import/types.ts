
import { BucketFile } from '../ManualBucketBrowser';
import { ManualWithMotorcycle } from '@/services/manuals/types';
import { ImportItem } from '../shared/types';

// Re-export ImportItem for convenience
export type { ImportItem };

export interface BatchImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: (manuals: ManualWithMotorcycle[]) => void;
}
