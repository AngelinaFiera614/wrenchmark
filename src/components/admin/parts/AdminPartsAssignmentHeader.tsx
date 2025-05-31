
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Copy, History } from "lucide-react";

interface AdminPartsAssignmentHeaderProps {
  selectedConfig: string | null;
  onPreviewConfig: () => void;
}

const AdminPartsAssignmentHeader = ({ 
  selectedConfig, 
  onPreviewConfig 
}: AdminPartsAssignmentHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-explorer-text">Configurations</h1>
        <p className="text-explorer-text-muted mt-1">
          Manage motorcycle configurations: select brand → model → year → configuration, then assign components, options, and trim levels
        </p>
      </div>
      
      {selectedConfig && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onPreviewConfig}
            className="bg-explorer-card border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview Configuration
          </Button>
          <Button
            variant="outline"
            className="bg-explorer-card border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
          >
            <Copy className="mr-2 h-4 w-4" />
            Clone Configuration
          </Button>
          <Button
            variant="outline"
            className="bg-explorer-card border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
          >
            <History className="mr-2 h-4 w-4" />
            View History
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminPartsAssignmentHeader;
