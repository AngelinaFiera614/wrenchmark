
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CheckSquare, 
  Square, 
  FileDown, 
  Eye, 
  FileText, 
  Trash2,
  X
} from "lucide-react";

interface BulkSelectionToolbarProps {
  selectedCount: number;
  totalCount: number;
  allSelected: boolean;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkPublish: () => void;
  onBulkDraft: () => void;
  onBulkExport: () => void;
  onBulkDelete: () => void;
}

const BulkSelectionToolbar = ({
  selectedCount,
  totalCount,
  allSelected,
  onSelectAll,
  onClearSelection,
  onBulkPublish,
  onBulkDraft,
  onBulkExport,
  onBulkDelete
}: BulkSelectionToolbarProps) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <Card className="border-accent-teal bg-accent-teal/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={allSelected}
                onCheckedChange={allSelected ? onClearSelection : onSelectAll}
                className="border-accent-teal"
              />
              <Badge variant="secondary" className="bg-accent-teal text-black">
                {selectedCount} selected
              </Badge>
              <span className="text-sm text-muted-foreground">
                of {totalCount} motorcycles
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkPublish}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <Eye className="h-4 w-4 mr-1" />
              Publish Selected
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkDraft}
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <FileText className="h-4 w-4 mr-1" />
              Mark as Draft
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkExport}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <FileDown className="h-4 w-4 mr-1" />
              Export Selected
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkDelete}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Selected
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkSelectionToolbar;
