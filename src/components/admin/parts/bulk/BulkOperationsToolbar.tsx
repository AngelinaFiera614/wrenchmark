
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Copy, 
  Edit, 
  Trash2, 
  CheckCircle,
  X,
  ChevronDown,
  Download,
  Upload
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BulkOperationsToolbarProps {
  selectedConfigurations: string[];
  totalConfigurations: number;
  onBulkCopy: (configIds: string[]) => void;
  onBulkEdit: (configIds: string[]) => void;
  onBulkDelete: (configIds: string[]) => void;
  onBulkExport: (configIds: string[]) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  isVisible: boolean;
}

const BulkOperationsToolbar = ({
  selectedConfigurations,
  totalConfigurations,
  onBulkCopy,
  onBulkEdit,
  onBulkDelete,
  onBulkExport,
  onSelectAll,
  onClearSelection,
  isVisible
}: BulkOperationsToolbarProps) => {
  if (!isVisible || selectedConfigurations.length === 0) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-explorer-card border-accent-teal shadow-lg animate-slide-in-bottom">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedConfigurations.length === totalConfigurations}
              onCheckedChange={(checked) => checked ? onSelectAll() : onClearSelection()}
            />
            <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal">
              {selectedConfigurations.length} of {totalConfigurations} selected
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkCopy(selectedConfigurations)}
              className="flex items-center gap-1"
            >
              <Copy className="h-3 w-3" />
              Copy
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Edit className="h-3 w-3" />
                  Edit
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onBulkEdit(selectedConfigurations)}>
                  <CheckCircle className="h-3 w-3 mr-2" />
                  Publish Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBulkEdit(selectedConfigurations)}>
                  <Edit className="h-3 w-3 mr-2" />
                  Set as Draft
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onBulkEdit(selectedConfigurations)}>
                  <Copy className="h-3 w-3 mr-2" />
                  Update Market Region
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkExport(selectedConfigurations)}
              className="flex items-center gap-1"
            >
              <Download className="h-3 w-3" />
              Export
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkDelete(selectedConfigurations)}
              className="flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="ml-auto"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkOperationsToolbar;
