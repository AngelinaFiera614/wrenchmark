
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { ManualWithMotorcycle } from '@/services/manuals';

interface AdminManualsListProps {
  manuals: ManualWithMotorcycle[];
  onEdit: (manual: ManualWithMotorcycle) => void;
  onDelete: (id?: string) => void;
}

const AdminManualsList = ({ manuals, onEdit, onDelete }: AdminManualsListProps) => {
  if (manuals.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">
          No manuals have been created yet. Add your first manual using the button above.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Motorcycle</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {manuals.map((manual) => (
            <TableRow key={manual.id}>
              <TableCell className="font-medium">{manual.title}</TableCell>
              <TableCell>{manual.motorcycle_name}</TableCell>
              <TableCell>
                <Badge variant="outline">{manual.manual_type}</Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(manual)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(manual.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminManualsList;
