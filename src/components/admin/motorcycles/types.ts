
import { Brand } from "@/types";

export type MotorcycleGridItem = {
  id: string;
  model_name: string;
  brand_id: string;
  brand_name?: string;
  year_start?: number;
  year_end?: number | null;
  description?: string;
  status?: string;
  is_new?: boolean;
  isDirty?: boolean;
};

export interface MotorcycleRowProps {
  motorcycle: MotorcycleGridItem;
  editingRows: Record<string, boolean>;
  errors: Record<string, Record<string, string>>;
  brands: Brand[];
  onEdit: (id: string) => void;
  onSave: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenDetailedEditor: (motorcycle: MotorcycleGridItem) => void;
  onCellChange: (id: string, field: string, value: any) => void;
}

export interface MotorcycleTableProps {
  motorcycles: MotorcycleGridItem[];
  editingRows: Record<string, boolean>;
  errors: Record<string, Record<string, string>>;
  brands: Brand[];
  onEdit: (id: string) => void;
  onSave: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenDetailedEditor: (motorcycle: MotorcycleGridItem) => void;
  onCellChange: (id: string, field: string, value: any) => void;
}
