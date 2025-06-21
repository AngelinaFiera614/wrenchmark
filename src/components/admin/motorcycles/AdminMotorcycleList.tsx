
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, Plus } from "lucide-react";
import { Motorcycle } from "@/types";
import EnhancedMotorcycleCard from "./EnhancedMotorcycleCard";

interface AdminMotorcycleListProps {
  motorcycles: Motorcycle[];
  selectedIds: string[];
  isLoading: boolean;
  error: string | null;
  isDraftMode: boolean;
  onSelect: (id: string) => void;
  onEdit: (motorcycle: Motorcycle) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onManageComponents: (motorcycle: Motorcycle) => void;
  onRefresh: () => void;
  onAddMotorcycle: () => void;
}

const AdminMotorcycleList = ({
  motorcycles,
  selectedIds,
  isLoading,
  error,
  isDraftMode,
  onSelect,
  onEdit,
  onDelete,
  onToggleStatus,
  onManageComponents,
  onRefresh,
  onAddMotorcycle
}: AdminMotorcycleListProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading motorcycles...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-800 mb-4">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Error Loading Motorcycles</span>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (motorcycles.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            No {isDraftMode ? 'draft' : 'published'} motorcycles found
          </p>
          <Button 
            className="bg-accent-teal text-black hover:bg-accent-teal/80"
            onClick={onAddMotorcycle}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Motorcycle
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {motorcycles.map((motorcycle) => (
        <EnhancedMotorcycleCard
          key={motorcycle.id}
          motorcycle={motorcycle}
          isSelected={selectedIds.includes(motorcycle.id)}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onManageComponents={onManageComponents}
        />
      ))}
    </div>
  );
};

export default AdminMotorcycleList;
