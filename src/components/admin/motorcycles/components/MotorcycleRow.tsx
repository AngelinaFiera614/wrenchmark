
import React from "react";
import { Edit, Save, X, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { EditableBrandCell } from "../cells/EditableBrandCell";
import { EditableTextCell } from "../cells/EditableTextCell";
import { EditableNumberCell } from "../cells/EditableNumberCell";
import { EditableStatusCell } from "../cells/EditableStatusCell";
import { MotorcycleRowProps } from "../types";

export const MotorcycleRow: React.FC<MotorcycleRowProps> = ({
  motorcycle,
  editingRows,
  errors,
  brands,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onOpenDetailedEditor,
  onCellChange,
}) => {
  const isEditing = editingRows[motorcycle.id] || false;
  const rowErrors = errors[motorcycle.id] || {};
  const isBrandsLoading = !brands || brands.length === 0;

  // Get the brand name for display
  const brandName = brands?.find(brand => brand.id === motorcycle.brand_id)?.name || "—";

  return (
    <TableRow key={motorcycle.id} className={motorcycle.is_new ? "bg-muted/20" : ""}>
      <TableCell>
        <EditableTextCell
          value={motorcycle.model_name || ''}
          isEditing={isEditing}
          onChange={(value) => onCellChange(motorcycle.id, 'model_name', value)}
          error={rowErrors.model_name}
        />
      </TableCell>
      
      <TableCell>
        <EditableBrandCell
          value={motorcycle.brand_id || ''}
          displayValue={brandName}
          isEditing={isEditing}
          onChange={(value) => onCellChange(motorcycle.id, 'brand_id', value)}
          brands={brands}
          isLoading={isBrandsLoading}
          error={rowErrors.brand_id}
        />
      </TableCell>
      
      <TableCell>
        <EditableNumberCell
          value={motorcycle.year_start || 0}
          isEditing={isEditing}
          onChange={(value) => onCellChange(motorcycle.id, 'year_start', value)}
          error={rowErrors.year_start}
        />
      </TableCell>
      
      <TableCell>
        <EditableNumberCell
          value={motorcycle.year_end || null}
          isEditing={isEditing}
          onChange={(value) => onCellChange(motorcycle.id, 'year_end', value)}
          error={rowErrors.year_end}
          allowNull={true}
        />
      </TableCell>
      
      <TableCell>
        <EditableTextCell
          value={motorcycle.description || ''}
          isEditing={isEditing}
          onChange={(value) => onCellChange(motorcycle.id, 'description', value)}
          error={rowErrors.description}
        />
      </TableCell>

      <TableCell>
        <EditableStatusCell
          value={motorcycle.status || ''}
          isEditing={isEditing}
          onChange={(value) => onCellChange(motorcycle.id, 'status', value)}
          error={rowErrors.status}
        />
      </TableCell>
      
      <TableCell>
        <div className="flex space-x-2 justify-end">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => onSave(motorcycle.id)}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onCancel(motorcycle.id)}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => onEdit(motorcycle.id)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDelete(motorcycle.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onOpenDetailedEditor(motorcycle)}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
