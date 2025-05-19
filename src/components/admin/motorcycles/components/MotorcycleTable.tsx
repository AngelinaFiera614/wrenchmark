
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MotorcycleRow } from "./MotorcycleRow";
import { MotorcycleTableProps } from "../types";

export const MotorcycleTable: React.FC<MotorcycleTableProps> = ({
  motorcycles,
  editingRows,
  errors,
  brands,
  isBrandsLoading,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onOpenDetailedEditor,
  onCellChange
}) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Model Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Year Start</TableHead>
            <TableHead>Year End</TableHead>
            <TableHead className="w-1/4">Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {motorcycles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No motorcycles found
              </TableCell>
            </TableRow>
          ) : (
            motorcycles.map((motorcycle) => (
              <MotorcycleRow
                key={motorcycle.id}
                motorcycle={motorcycle}
                editingRows={editingRows}
                errors={errors}
                brands={brands}
                isBrandsLoading={isBrandsLoading}
                onEdit={onEdit}
                onSave={onSave}
                onCancel={onCancel}
                onDelete={onDelete}
                onOpenDetailedEditor={onOpenDetailedEditor}
                onCellChange={onCellChange}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
