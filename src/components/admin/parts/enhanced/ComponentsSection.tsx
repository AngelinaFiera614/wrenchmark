
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Database, Plus } from "lucide-react";
import ComponentLibraryEnhanced from "./ComponentLibraryEnhanced";
import { useAdminPartsLayoutState } from "./layout/useAdminPartsLayoutState";

interface ComponentsSectionProps {
  selectedYears: string[];
  onManageComponents: () => void;
  onBulkAssign: () => void;
}

const ComponentsSection = ({ selectedYears, onManageComponents, onBulkAssign }: ComponentsSectionProps) => {
  const [showLibrary, setShowLibrary] = useState(false);
  const { adminData } = useAdminPartsLayoutState();

  const handleComponentLinked = () => {
    // Refresh configurations when a component is linked
    if (adminData.refreshConfigurations) {
      adminData.refreshConfigurations(selectedYears);
    }
  };

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-accent-teal" />
            <CardTitle className="text-explorer-text">Component Management</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowLibrary(!showLibrary)}
              className="border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              <Database className="mr-2 h-4 w-4" />
              {showLibrary ? 'Hide' : 'Show'} Component Library
            </Button>
            <Button
              onClick={onBulkAssign}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              <Plus className="mr-2 h-4 w-4" />
              Bulk Assign
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {!showLibrary ? (
          <div className="space-y-4">
            <p className="text-explorer-text-muted">
              Manage components for your motorcycle configurations. You can link existing components 
              or create new ones.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-explorer-dark rounded-lg border border-explorer-chrome/30">
                <h4 className="font-medium text-explorer-text mb-2">Component Library</h4>
                <p className="text-sm text-explorer-text-muted mb-3">
                  Browse, create, edit, and manage all motorcycle components
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowLibrary(true)}
                  className="w-full border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
                >
                  Open Component Library
                </Button>
              </div>
              
              <div className="p-4 bg-explorer-dark rounded-lg border border-explorer-chrome/30">
                <h4 className="font-medium text-explorer-text mb-2">Bulk Operations</h4>
                <p className="text-sm text-explorer-text-muted mb-3">
                  Assign components to multiple configurations at once
                </p>
                <Button
                  variant="outline"
                  onClick={onBulkAssign}
                  className="w-full border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
                >
                  Bulk Assign Components
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <ComponentLibraryEnhanced
            selectedConfiguration={adminData.selectedConfigData}
            onComponentLinked={handleComponentLinked}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ComponentsSection;
