
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Eye, 
  Edit, 
  MoreVertical, 
  CheckCircle, 
  Clock, 
  AlertTriangle 
} from "lucide-react";
import { Motorcycle } from "@/types";
import { calculateDataCompletenessSync } from "@/utils/dataCompleteness";

interface CompactModelBrowserProps {
  motorcycles: Motorcycle[];
  selectedMotorcycle: Motorcycle | null;
  selectedMotorcycles: string[];
  onSelectMotorcycle: (motorcycle: Motorcycle) => void;
  onToggleMotorcycleSelection: (motorcycleId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  isLoading?: boolean;
}

const CompactModelBrowser = ({
  motorcycles,
  selectedMotorcycle,
  selectedMotorcycles,
  onSelectMotorcycle,
  onToggleMotorcycleSelection,
  onSelectAll,
  onClearSelection,
  isLoading
}: CompactModelBrowserProps) => {
  
  const getStatusIcon = (motorcycle: Motorcycle) => {
    if (motorcycle.is_draft) {
      return <Clock className="h-4 w-4 text-orange-400" />;
    }
    
    const completion = calculateDataCompletenessSync(motorcycle);
    if (completion.completionPercentage === 100) {
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    }
    
    return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
  };

  const getStatusColor = (motorcycle: Motorcycle) => {
    if (motorcycle.is_draft) return "bg-orange-500/20 text-orange-400";
    
    const completion = calculateDataCompletenessSync(motorcycle);
    if (completion.completionPercentage === 100) return "bg-green-500/20 text-green-400";
    
    return "bg-yellow-500/20 text-yellow-400";
  };

  const getBrandName = (motorcycle: Motorcycle): string => {
    // Handle multiple possible brand data structures
    return motorcycle.brand?.name || 
           motorcycle.brands?.name || 
           motorcycle.make || 
           'Unknown Brand';
  };

  if (isLoading) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-explorer-text-muted">Loading motorcycles...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (motorcycles.length === 0) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-explorer-text-muted">No motorcycles found</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardContent className="p-4">
        {/* Header with selection controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedMotorcycles.length === motorcycles.length && motorcycles.length > 0}
              onCheckedChange={(checked) => {
                if (checked) {
                  onSelectAll();
                } else {
                  onClearSelection();
                }
              }}
            />
            <span className="text-sm text-explorer-text-muted">
              {selectedMotorcycles.length > 0 
                ? `${selectedMotorcycles.length} selected`
                : `${motorcycles.length} motorcycles`
              }
            </span>
          </div>
          {selectedMotorcycles.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              className="bg-explorer-dark border-explorer-chrome/30"
            >
              Clear Selection
            </Button>
          )}
        </div>

        {/* Motorcycle list */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {motorcycles.map((motorcycle) => {
              const isSelected = selectedMotorcycle?.id === motorcycle.id;
              const isChecked = selectedMotorcycles.includes(motorcycle.id);
              const completion = calculateDataCompletenessSync(motorcycle);
              const brandName = getBrandName(motorcycle);
              
              return (
                <div
                  key={motorcycle.id}
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors
                    ${isSelected 
                      ? 'bg-accent-teal/20 border-accent-teal/50' 
                      : 'bg-explorer-dark border-explorer-chrome/30 hover:bg-explorer-chrome/10'
                    }
                  `}
                  onClick={() => onSelectMotorcycle(motorcycle)}
                >
                  {/* Selection checkbox */}
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      onToggleMotorcycleSelection(motorcycle.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />

                  {/* Motorcycle image */}
                  <div className="w-12 h-12 bg-explorer-chrome/20 rounded-md flex items-center justify-center overflow-hidden">
                    {motorcycle.default_image_url ? (
                      <img 
                        src={motorcycle.default_image_url} 
                        alt={motorcycle.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-explorer-text-muted text-xs">No Image</div>
                    )}
                  </div>

                  {/* Motorcycle info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-explorer-text truncate">
                        {motorcycle.name}
                      </h4>
                      {getStatusIcon(motorcycle)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-explorer-text-muted">
                      <span>{brandName}</span>
                      {motorcycle.type && (
                        <>
                          <span>•</span>
                          <span>{motorcycle.type}</span>
                        </>
                      )}
                      {motorcycle.production_start_year && (
                        <>
                          <span>•</span>
                          <span>{motorcycle.production_start_year}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status and completion */}
                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(motorcycle)}
                    >
                      {motorcycle.is_draft ? 'Draft' : 'Published'}
                    </Badge>
                    <div className="text-xs text-explorer-text-muted">
                      {completion.completionPercentage}% complete
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMotorcycle(motorcycle);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Add edit functionality
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Add more actions menu
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CompactModelBrowser;
