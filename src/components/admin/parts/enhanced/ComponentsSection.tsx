
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Database, Plus, CheckSquare, AlertTriangle } from "lucide-react";
import ComponentLibraryEnhanced from "./ComponentLibraryEnhanced";
import BulkAssignDialog from "./BulkAssignDialog";
import ValidationResultsDialog from "./ValidationResultsDialog";
import { useAdminPartsLayoutState } from "@/hooks/admin/useAdminPartsLayoutState";
import { validateConfiguration, ValidationResult } from "../validation/ValidationEngine";
import { useToast } from "@/hooks/use-toast";

interface ComponentsSectionProps {
  selectedYears: string[];
  onManageComponents: () => void;
  onBulkAssign: () => void;
}

const ComponentsSection = ({ selectedYears, onManageComponents, onBulkAssign }: ComponentsSectionProps) => {
  const [showLibrary, setShowLibrary] = useState(false);
  const [showBulkAssign, setShowBulkAssign] = useState(false);
  const [showValidationResults, setShowValidationResults] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  
  // Access state directly (no adminData)
  const {
    configurations,
    selectedModelData,
    selectedConfigData,
    refreshConfigurations
  } = useAdminPartsLayoutState();

  const { toast } = useToast();

  const handleComponentLinked = () => {
    // Refresh configurations when a component is linked
    if (refreshConfigurations) {
      refreshConfigurations();
    }
  };

  const handleRunValidation = () => {
    if (!configurations || configurations.length === 0) {
      toast({
        variant: "destructive",
        title: "No Configurations",
        description: "Please select a model and year first to run validation."
      });
      return;
    }

    console.log("Running validation on configurations:", configurations.length);
    
    const results = configurations.map((config: any) => 
      validateConfiguration(
        config,
        selectedModelData,
        null, // selectedYearData is not available here, pass null
        configurations
      )
    );
    
    setValidationResults(results);
    setShowValidationResults(true);
    
    const validCount = results.filter(r => r.isValid).length;
    const totalCount = results.length;
    
    toast({
      title: "Validation Complete",
      description: `Validated ${totalCount} configurations. ${validCount} valid, ${totalCount - validCount} with issues.`
    });
  };

  const handleBulkAssignSuccess = () => {
    handleComponentLinked();
    setShowBulkAssign(false);
  };

  return (
    <>
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
                onClick={handleRunValidation}
                className="border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Run Validation
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowLibrary(!showLibrary)}
                className="border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
              >
                <Database className="mr-2 h-4 w-4" />
                {showLibrary ? 'Hide' : 'Show'} Component Library
              </Button>
              <Button
                onClick={() => setShowBulkAssign(true)}
                className="bg-accent-teal text-black hover:bg-accent-teal/80"
              >
                <CheckSquare className="mr-2 h-4 w-4" />
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    onClick={() => setShowBulkAssign(true)}
                    className="w-full border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
                  >
                    Bulk Assign Components
                  </Button>
                </div>

                <div className="p-4 bg-explorer-dark rounded-lg border border-explorer-chrome/30">
                  <h4 className="font-medium text-explorer-text mb-2">Validation</h4>
                  <p className="text-sm text-explorer-text-muted mb-3">
                    Check configurations for completeness and issues
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleRunValidation}
                    className="w-full border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
                  >
                    Run Full Validation
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <ComponentLibraryEnhanced
              selectedConfiguration={selectedConfigData}
              onComponentLinked={handleComponentLinked}
            />
          )}
        </CardContent>
      </Card>

      {/* Bulk Assign Dialog */}
      <BulkAssignDialog
        open={showBulkAssign}
        onClose={() => setShowBulkAssign(false)}
        configurations={configurations || []}
        onSuccess={handleBulkAssignSuccess}
      />

      {/* Validation Results Dialog */}
      <ValidationResultsDialog
        open={showValidationResults}
        onClose={() => setShowValidationResults(false)}
        results={validationResults}
        configurations={configurations || []}
      />
    </>
  );
};

export default ComponentsSection;

