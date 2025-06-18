
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, Edit, Eye, Copy, Trash2, ChevronRight, ChevronLeft, MoreHorizontal
} from "lucide-react";
import { Motorcycle } from "@/types";
import { calculateDataCompleteness } from "@/utils/dataCompleteness";
import { DataCompletenessIndicator } from "@/components/motorcycles/DataCompletenessIndicator";

interface CompactModelBrowserProps {
  motorcycles: Motorcycle[];
  selectedMotorcycle: Motorcycle | null;
  selectedMotorcycles: string[];
  onSelectMotorcycle: (motorcycle: Motorcycle) => void;
  onToggleMotorcycleSelection: (motorcycleId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  isLoading: boolean;
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
  const [showAll, setShowAll] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  
  const displayCount = 4;
  const totalCount = motorcycles.length;
  const canShowMore = totalCount > displayCount;
  
  // Get the motorcycles to display
  const displayedMotorcycles = showAll 
    ? motorcycles 
    : motorcycles.slice(startIndex, startIndex + displayCount);

  const canNavigateNext = startIndex + displayCount < totalCount;
  const canNavigatePrev = startIndex > 0;

  const handleNext = () => {
    if (canNavigateNext) {
      setStartIndex(prev => Math.min(prev + displayCount, totalCount - displayCount));
    }
  };

  const handlePrev = () => {
    if (canNavigatePrev) {
      setStartIndex(prev => Math.max(prev - displayCount, 0));
    }
  };

  const MotorcycleCard = ({ motorcycle, isSelected }: { motorcycle: Motorcycle; isSelected: boolean }) => {
    const completeness = calculateDataCompleteness(motorcycle);
    const isInSelection = selectedMotorcycles.includes(motorcycle.id);
    
    return (
      <div
        className={`relative group p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm min-w-0 ${
          isSelected
            ? 'border-accent-teal bg-accent-teal/10'
            : 'border-explorer-chrome/30 bg-explorer-card hover:border-explorer-chrome/50'
        }`}
        onClick={() => onSelectMotorcycle(motorcycle)}
      >
        {/* Selection Checkbox */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Checkbox
            checked={isInSelection}
            onCheckedChange={() => onToggleMotorcycleSelection(motorcycle.id)}
            onClick={(e) => e.stopPropagation()}
            className="h-3 w-3"
          />
        </div>

        <div className="space-y-2 pr-6">
          <div>
            <div className="font-medium text-explorer-text text-sm truncate">
              {motorcycle.make || motorcycle.name?.split(' ')[0]} {motorcycle.model || motorcycle.name}
            </div>
            <div className="text-xs text-explorer-text-muted">
              {motorcycle.category} • {motorcycle.year || 'Unknown'}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {motorcycle.is_draft && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs px-1 py-0">
                Draft
              </Badge>
            )}
            <DataCompletenessIndicator status={completeness} variant="admin" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-1 text-xs text-explorer-text-muted">
            {motorcycle.engine_size && (
              <div className="truncate">{motorcycle.engine_size}cc</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardContent className="p-4 text-center">
          <div className="text-explorer-text-muted">Loading motorcycles...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-explorer-text flex items-center gap-2 text-base">
            Recent Models
            <Badge variant="secondary" className="text-xs">{totalCount}</Badge>
            {selectedMotorcycles.length > 0 && (
              <Badge variant="default" className="bg-accent-teal text-black text-xs">
                {selectedMotorcycles.length} selected
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-1">
            {!showAll && canShowMore && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrev}
                  disabled={!canNavigatePrev}
                  className="h-6 w-6 p-0"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <span className="text-xs text-explorer-text-muted px-1">
                  {Math.floor(startIndex / displayCount) + 1}/{Math.ceil(totalCount / displayCount)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  disabled={!canNavigateNext}
                  className="h-6 w-6 p-0"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            {canShowMore && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="text-xs h-6 px-2"
              >
                {showAll ? (
                  <>
                    <ChevronLeft className="h-3 w-3 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <MoreHorizontal className="h-3 w-3 mr-1" />
                    Show All
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Selection Controls */}
        {selectedMotorcycles.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-explorer-chrome/30">
            <Button variant="outline" size="sm" onClick={onSelectAll} className="text-xs h-6 px-2">
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={onClearSelection} className="text-xs h-6 px-2">
              Clear
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-3 pt-0">
        {motorcycles.length === 0 ? (
          <div className="text-center py-4 text-explorer-text-muted text-sm">
            No motorcycles available
          </div>
        ) : (
          <div className={showAll 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3' 
            : 'flex gap-3 overflow-x-auto pb-2'
          }>
            {displayedMotorcycles.map((motorcycle) => {
              const isSelected = selectedMotorcycle?.id === motorcycle.id;
              
              return (
                <div key={motorcycle.id} className={showAll ? '' : 'flex-shrink-0 w-48'}>
                  <MotorcycleCard 
                    motorcycle={motorcycle} 
                    isSelected={isSelected} 
                  />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompactModelBrowser;
