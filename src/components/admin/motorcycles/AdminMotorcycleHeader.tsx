
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Upload, Plus } from "lucide-react";

interface AdminMotorcycleHeaderProps {
  onRefresh: () => void;
  onExportAll: () => void;
  onImport: () => void;
  onAddMotorcycle: () => void;
  isLoading: boolean;
}

const AdminMotorcycleHeader = ({
  onRefresh,
  onExportAll,
  onImport,
  onAddMotorcycle,
  isLoading
}: AdminMotorcycleHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold text-explorer-text">Motorcycle Management</h1>
        <p className="text-explorer-text-muted mt-1">
          Enhanced interface with bulk operations and detailed motorcycle information
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button variant="outline" size="sm" onClick={onExportAll}>
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
        <Button variant="outline" size="sm" onClick={onImport}>
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
        <Button 
          size="sm" 
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
          onClick={onAddMotorcycle}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Model
        </Button>
      </div>
    </div>
  );
};

export default AdminMotorcycleHeader;
