
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Trash2 } from "lucide-react";
import { ModelYear, MotorcycleModel } from "@/types/motorcycle";
import DeleteYearDialog from "@/components/admin/models/DeleteYearDialog";

interface YearsSectionProps {
  modelYears: ModelYear[];
  selectedModel: string | null;
  selectedYear: string | null;
  selectedModelData?: MotorcycleModel;
  onYearSelect: (yearId: string) => void;
  onYearDelete: (yearId: string) => Promise<void>;
  isLoading: boolean;
}

const YearsSection = ({
  modelYears,
  selectedModel,
  selectedYear,
  selectedModelData,
  onYearSelect,
  onYearDelete,
  isLoading
}: YearsSectionProps) => {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    yearData: { id: string; year: number; brandName?: string; modelName?: string } | null;
  }>({
    open: false,
    yearData: null
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (year: ModelYear, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the year selection
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
      await onYearDelete(deleteDialog.yearData.id);
      setDeleteDialog({ open: false, yearData: null });
    } catch (error) {
      console.error("Error deleting year:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, yearData: null });
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
              <p className="text-xs text-explorer-text-muted">
                This model may need year generation
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
    </>
  );
};

export default YearsSection;
