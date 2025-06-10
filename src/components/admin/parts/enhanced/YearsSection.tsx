
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Trash2, Plus, RefreshCw } from "lucide-react";
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

    // Check if production years are set
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
        const endYear = selectedModelData.production_end_year || new Date().getFullYear();
        const yearCount = endYear - selectedModelData.production_start_year + 1;
        
        toast({
          title: "Years Generated",
          description: `Successfully generated ${yearCount} model years (${selectedModelData.production_start_year}-${endYear}).`,
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
          
          {/* Year Management Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddYearDialogOpen(true)}
              className="text-accent-teal border-accent-teal/30 hover:bg-accent-teal/10"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Year
            </Button>
            
            {/* Show generation info and button */}
            {selectedModelData && (
              <div className="flex items-center gap-2">
                {selectedModelData.production_start_year && (
                  <span className="text-xs text-explorer-text-muted">
                    Production: {selectedModelData.production_start_year}
                    {selectedModelData.production_end_year && ` - ${selectedModelData.production_end_year}`}
                    {!selectedModelData.production_end_year && ' - Present'}
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateYears}
                  disabled={isGenerating || !selectedModelData.production_start_year}
                  className="text-blue-400 border-blue-400/30 hover:bg-blue-400/10"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Generating...' : 'Generate Years'}
                </Button>
              </div>
            )}
          </div>
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
              <p className="text-xs text-explorer-text-muted mb-4">
                {selectedModelData?.production_start_year 
                  ? `Generate years from ${selectedModelData.production_start_year}${selectedModelData.production_end_year ? ` to ${selectedModelData.production_end_year}` : ' to present'}`
                  : 'Set production years in the model details first'
                }
              </p>
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
