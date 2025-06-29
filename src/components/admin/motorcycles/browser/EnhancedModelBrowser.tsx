
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Grid, List, Loader, RefreshCw, MoreVertical, 
  Edit, Eye, Copy, Trash2, CheckCircle, AlertCircle,
  ArrowUpDown
} from "lucide-react";
import { Motorcycle } from "@/types";
import { calculateDataCompletenessSync } from "@/utils/dataCompleteness";
import { DataCompletenessIndicator } from "@/components/motorcycles/DataCompletenessIndicator";

interface EnhancedModelBrowserProps {
  motorcycles: Motorcycle[];
  selectedMotorcycle: Motorcycle | null;
  selectedMotorcycles: string[];
  onSelectMotorcycle: (motorcycle: Motorcycle) => void;
  onToggleMotorcycleSelection: (motorcycleId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  isLoading: boolean;
  onRefresh?: () => void;
  isExpanded?: boolean;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'year' | 'completion' | 'updated' | 'make';

const EnhancedModelBrowser = ({
  motorcycles,
  selectedMotorcycle,
  selectedMotorcycles,
  onSelectMotorcycle,
  onToggleMotorcycleSelection,
  onSelectAll,
  onClearSelection,
  isLoading,
  onRefresh,
  isExpanded = false
}: EnhancedModelBrowserProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortedMotorcycles = [...motorcycles].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = (a.name || '').localeCompare(b.name || '');
        break;
      case 'year':
        comparison = (a.year || 0) - (b.year || 0);
        break;
      case 'completion':
        const aCompletion = calculateDataCompletenessSync(a).completionPercentage;
        const bCompletion = calculateDataCompletenessSync(b).completionPercentage;
        comparison = aCompletion - bCompletion;
        break;
      case 'updated':
        comparison = new Date(a.updated_at || '').getTime() - new Date(b.updated_at || '').getTime();
        break;
      case 'make':
        comparison = (a.make || '').localeCompare(b.make || '');
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  };

  const MotorcycleCard = ({ motorcycle, isSelected }: { motorcycle: Motorcycle; isSelected: boolean }) => {
    const completeness = calculateDataCompletenessSync(motorcycle);
    const isInSelection = selectedMotorcycles.includes(motorcycle.id);
    
    return (
      <div
        className={`relative group p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
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
          />
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-explorer-card border-explorer-chrome/30">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3 pr-8">
          <div>
            <div className="font-medium text-explorer-text">
              {motorcycle.make || motorcycle.name?.split(' ')[0]} {motorcycle.model || motorcycle.name}
            </div>
            <div className="text-sm text-explorer-text-muted">
              {motorcycle.category} • {motorcycle.year || 'Unknown Year'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {motorcycle.is_draft && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                Draft
              </Badge>
            )}
            <DataCompletenessIndicator 
              status={completeness} 
              variant="admin" 
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs text-explorer-text-muted">
            {motorcycle.engine_size && (
              <div>Engine: {motorcycle.engine_size}cc</div>
            )}
            {motorcycle.weight_kg && (
              <div>Weight: {motorcycle.weight_kg}kg</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-explorer-card border-explorer-chrome/30 h-full">
        <CardContent className="p-8 flex items-center justify-center h-full">
          <div className="text-center">
            <Loader className="h-8 w-8 text-accent-teal mx-auto mb-4 animate-spin" />
            <p className="text-explorer-text-muted">Loading motorcycles...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-explorer-text flex items-center gap-2">
            Model Browser
            <Badge variant="secondary">{motorcycles.length}</Badge>
            {selectedMotorcycles.length > 0 && (
              <Badge variant="default" className="bg-accent-teal text-black">
                {selectedMotorcycles.length} selected
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex border border-explorer-chrome/30 rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`rounded-r-none ${viewMode === 'grid' ? 'bg-accent-teal text-black' : ''}`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`rounded-l-none ${viewMode === 'list' ? 'bg-accent-teal text-black' : ''}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value) => handleSort(value as SortOption)}>
              <SelectTrigger className="w-32 bg-explorer-dark border-explorer-chrome/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-explorer-card border-explorer-chrome/30">
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="make">Make</SelectItem>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="completion">Completion</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="bg-explorer-dark border-explorer-chrome/30"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>

            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Selection Controls */}
        {selectedMotorcycles.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-explorer-chrome/30">
            <Button variant="outline" size="sm" onClick={onSelectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={onClearSelection}>
              Clear Selection
            </Button>
            <div className="text-sm text-explorer-text-muted">
              {selectedMotorcycles.length} of {motorcycles.length} selected
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4">
        {motorcycles.length === 0 ? (
          <div className="text-center py-8 text-explorer-text-muted">
            No motorcycles available
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4' 
              : 'space-y-2'
          }>
            {sortedMotorcycles.map((motorcycle) => {
              const isSelected = selectedMotorcycle?.id === motorcycle.id;
              
              return (
                <MotorcycleCard 
                  key={motorcycle.id} 
                  motorcycle={motorcycle} 
                  isSelected={isSelected} 
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedModelBrowser;
