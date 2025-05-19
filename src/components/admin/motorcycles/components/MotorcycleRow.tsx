
import React from "react";
import { Check, Info, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableTextCell } from "../cells/EditableTextCell";
import { EditableNumberCell } from "../cells/EditableNumberCell";
import { EditableBrandCell } from "../cells/EditableBrandCell";
import { EditableStatusCell } from "../cells/EditableStatusCell";
import { TableCell, TableRow } from "@/components/ui/table";
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
  onCellChange
}) => {
  return (
    <TableRow className={motorcycle.isDirty ? "bg-muted/20" : ""}>
      <TableCell>
        <EditableNumberCell
          value={motorcycle.year_start}
          isEditing={editingRows[motorcycle.id]}
          onChange={(value) => onCellChange(motorcycle.id, "year_start", value)}
          error={errors[motorcycle.id]?.year_start}
          min={1885}
          max={new Date().getFullYear() + 5}
        />
      </TableCell>
      <TableCell>
        <EditableNumberCell
          value={motorcycle.year_end}
          isEditing={editingRows[motorcycle.id]}
          onChange={(value) => onCellChange(motorcycle.id, "year_end", value)}
          allowNull
          min={motorcycle.year_start || 1885}
          max={2100}
          placeholder="Present"
        />
      </TableCell>
      <TableCell>
        <EditableTextCell
          value={motorcycle.model_name}
          isEditing={editingRows[motorcycle.id]}
          onChange={(value) => onCellChange(motorcycle.id, "model_name", value)}
          error={errors[motorcycle.id]?.model_name}
        />
      </TableCell>
      <TableCell>
        <EditableBrandCell
          value={motorcycle.brand_id}
          displayValue={motorcycle.brand_name || ""}
          isEditing={editingRows[motorcycle.id]}
          onChange={(value) => onCellChange(motorcycle.id, "brand_id", value)}
          brands={brands}
          error={errors[motorcycle.id]?.brand_id}
        />
      </TableCell>
      <TableCell>
        <EditableTextCell
          value={motorcycle.description || ""}
          isEditing={editingRows[motorcycle.id]}
          onChange={(value) => onCellChange(motorcycle.id, "description", value)}
        />
      </TableCell>
      <TableCell>
        <EditableStatusCell
          value={motorcycle.status || "draft"}
          isEditing={editingRows[motorcycle.id]}
          onChange={(value) => onCellChange(motorcycle.id, "status", value)}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {editingRows[motorcycle.id] ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onSave(motorcycle.id)}
                disabled={!motorcycle.isDirty}
              >
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onCancel(motorcycle.id)}
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onEdit(motorcycle.id)}
              >
                <span className="sr-only">Edit</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onOpenDetailedEditor(motorcycle)}
              >
                <Info className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-destructive"
                onClick={() => onDelete(motorcycle.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
