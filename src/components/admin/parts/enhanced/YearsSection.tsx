import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Trash2, Plus, RefreshCw, Calendar, Info } from "lucide-react";
import { ModelYear, MotorcycleModel } from "@/types/motorcycle";
import { useToast } from "@/hooks/use-toast";
import { generateModelYears, deleteModelYear } from "@/services/models/modelYearService";
import { useQueryClient } from "@tanstack/react-query";
import DeleteYearDialog from "@/components/admin/models/DeleteYearDialog";
import AdminModelYearDialog from "@/components/admin/models/AdminModelYearDialog";

interface YearsSectionProps {
  modelYears: ModelYear[];
  selectedModel: string | null;
  selectedYear: string | null;
  selectedModelData?: MotorcycleModel;
  onYearSelect: (yearId: string) => void;
  isLoading: boolean;
}

const YearsSection = ({
  modelYears,
  selectedModel,
  selectedYear,
  selectedModelData,
  onYearSelect,
  isLoading
}: YearsSectionProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    yearData: { id: string; year: number; brandName?: string; modelName?: string } | null;
  }>({
    open: false,
    yearData: null
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [addYearDialogOpen, setAddYearDialogOpen] = useState(false);

  // Generate expected years from production data
  const getExpectedYears = () => {
    if (!selectedModelData?.production_start_year) return [];
    
    const startYear = selectedModelData.production_start_year;
    const currentYear = new Date().getFullYear();
    // For active models without end year, include next year for upcoming models
    const endYear = selectedModelData.production_end_year || 
      (selectedModelData.production_status === 'active' ? currentYear + 1 : currentYear);
    
    const expectedYears = [];
    for (let year = startYear; year <= endYear; year++) {
      expectedYears.push(year);
    }
    return expectedYears;
  };

  const expectedYears = getExpectedYears();
  const existingYearNumbers = modelYears.map(y => y.year);
  const missingYears = expectedYears.filter(year => !existingYearNumbers.includes(year));

  const getProductionStatusInfo = () => {
    if (!selectedModelData) return null;
    
    const { production_start_year, production_end_year, production_status } = selectedModelData;
    
    if (!production_start_year) {
      return {
        type: 'warning',
        message: 'No production start year set. Please update model details first.',
        action: null
      };
    }
    
    if (production_status === 'active' && !production_end_year) {
      return {
        type: 'info',
        message: `Current production model (${production_start_year}-Present)`,
        action: missingYears.length > 0 ? 'generate' : null
      };
    }
    
    if (production_end_year) {
      return {
        type: 'info',
        message: `Production ended in ${production_end_year} (${production_start_year}-${production_end_year})`,
        action: missingYears.length > 0 ? 'generate' : null
      };
    }
    
    return {
      type: 'info',
      message: `Production status: ${production_status}`,
      action: missingYears.length > 0 ? 'generate' : null
    };
  };

  const productionInfo = getProductionStatusInfo();

  const handleDeleteClick = (year: ModelYear, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialog({
      open: true,
      yearData: {
        id: year.id,
        year: year.year,
        brandName: selectedModelData?.brand?.name,
        modelName: selectedModelData?.name
      }
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.yearData) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteModelYear(deleteDialog.yearData.id);
      if (success) {
        toast({
          title: "Year deleted",
          description: `${deleteDialog.yearData.year} model year has been removed.`,
        });
        queryClient.invalidateQueries({ queryKey: ["model-years", selectedModel] });
        setDeleteDialog({ open: false, yearData: null });
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete model year. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, yearData: null });
  };

  const handleGenerateYears = async () => {
    if (!selectedModel || !selectedModelData) {
      toast({
        variant: "destructive",
        title: "No Model Selected",
        description: "Please select a model first.",
      });
      return;
    }

    if (!selectedModelData.production_start_year) {
      toast({
        variant: "destructive",
        title: "Missing Production Data",
        description: "This model needs a production start year set before generating years.",
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      const success = await generateModelYears(selectedModel);
      if (success) {
        const currentYear = new Date().getFullYear();
        const endYear = selectedModelData.production_end_year || 
          (selectedModelData.production_status === 'active' ? currentYear + 1 : currentYear);
        
        toast({
          title: "Years Generated",
          description: `Successfully generated model years for ${selectedModelData.production_start_year}-${endYear}.`,
        });
        queryClient.invalidateQueries({ queryKey: ["model-years", selectedModel] });
      } else {
        throw new Error("Generation failed");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate model years. Please check the model's production data.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!selectedModel) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Model Years</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-explorer-text-muted">
            Select a model to view available years
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            Model Years
            {selectedModelData && (
              <Badge variant="outline" className="text-xs">
                {selectedModelData.brand?.name} {selectedModelData.name}
              </Badge>
            )}
            <Badge variant="secondary" className="ml-auto">
              {modelYears.length} years
            </Badge>
          </CardTitle>
          
          {/* Production Status Info */}
          {productionInfo && (
            <div className={`p-3 rounded-md border ${
              productionInfo.type === 'warning' 
                ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
            }`}>
              <div className="flex items-center gap-2 text-sm">
                {productionInfo.type === 'warning' ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <Info className="h-4 w-4" />
                )}
                <span>{productionInfo.message}</span>
              </div>
            </div>
          )}
          
          {/* Year Management Actions */}
          <div className="flex gap-2 pt-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddYearDialogOpen(true)}
              className="text-accent-teal border-accent-teal/30 hover:bg-accent-teal/10"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Year
            </Button>
            
            {productionInfo?.action === 'generate' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateYears}
                disabled={isGenerating}
                className="text-blue-400 border-blue-400/30 hover:bg-blue-400/10"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Generating...' : `Generate ${missingYears.length} Missing Years`}
              </Button>
            )}
          </div>
          
          {/* Show missing years info */}
          {missingYears.length > 0 && (
            <div className="mt-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded text-xs">
              <span className="text-orange-400">Missing years:</span>{' '}
              <span className="text-explorer-text-muted">
                {missingYears.slice(0, 5).join(', ')}
                {missingYears.length > 5 && ` and ${missingYears.length - 5} more`}
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal mx-auto"></div>
              <p className="text-explorer-text-muted mt-4">Loading years...</p>
            </div>
          ) : modelYears.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <p className="text-explorer-text-muted mb-2">No model years found</p>
              {expectedYears.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-explorer-text-muted">
                    Expected years based on production data: {expectedYears[0]} - {expectedYears[expectedYears.length - 1]}
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {expectedYears.map(year => (
                      <Badge key={year} variant="outline" className="text-xs">
                        {year}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-explorer-text-muted">
                  Set production years in the model details first
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {modelYears.map((year) => (
                <div
                  key={year.id}
                  className={`relative group border rounded-md transition-colors ${
                    selectedYear === year.id
                      ? 'bg-accent-teal/20 text-accent-teal border-accent-teal/30'
                      : 'bg-explorer-dark hover:bg-explorer-chrome/10 border-explorer-chrome/20'
                  }`}
                >
                  <Button
                    variant="ghost"
                    onClick={() => onYearSelect(year.id)}
                    className="h-auto p-4 text-left w-full justify-start"
                  >
                    <div className="w-full">
                      <div className="font-medium text-lg">{year.year}</div>
                      <div className="space-y-1">
                        {year.is_available && (
                          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                            Available
                          </Badge>
                        )}
                        {year.msrp_usd && (
                          <div className="text-xs text-green-400">
                            MSRP: ${year.msrp_usd.toLocaleString()}
                          </div>
                        )}
                        {year.changes && (
                          <div className="text-xs text-explorer-text-muted">
                            {year.changes}
                          </div>
                        )}
                        {year.configurations && year.configurations.length > 0 && (
                          <div className="text-xs text-blue-400">
                            {year.configurations.length} config{year.configurations.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </Button>
                  
                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDeleteClick(year, e)}
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600/20 hover:bg-red-600/40 text-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteYearDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        yearData={deleteDialog.yearData}
        isDeleting={isDeleting}
      />

      <AdminModelYearDialog
        open={addYearDialogOpen}
        model={selectedModelData}
        onClose={() => setAddYearDialogOpen(false)}
      />
    </>
  );
};

export default YearsSection;
