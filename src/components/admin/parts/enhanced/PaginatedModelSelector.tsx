
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Filter, RotateCcw, Star, Grid, List } from "lucide-react";
import { MotorcycleModel } from "@/types/motorcycle";
import { useOptimizedAdminData } from "@/hooks/admin/useOptimizedAdminData";

interface PaginatedModelSelectorProps {
  selectedModel: string | null;
  onModelSelect: (modelId: string) => void;
  className?: string;
}

const PaginatedModelSelector = ({
  selectedModel,
  onModelSelect,
  className = ""
}: PaginatedModelSelectorProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const {
    models,
    modelsLoading,
    modelSearch,
    modelFilters,
    modelsPaginationInfo,
    handleModelSearch,
    handleModelFilter,
    handleModelsPageChange,
    handleModelsLimitChange
  } = useOptimizedAdminData();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleModelSearch(e.target.value);
  };

  const handleFilterChange = (key: string, value: string) => {
    handleModelFilter({ ...modelFilters, [key]: value });
  };

  const clearFilters = () => {
    handleModelSearch("");
    handleModelFilter({ brand: "", type: "", production_status: "active" });
  };

  const toggleFavorite = (modelId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(modelId)) {
      newFavorites.delete(modelId);
    } else {
      newFavorites.add(modelId);
    }
    setFavorites(newFavorites);
  };

  const sortedModels = [...models].sort((a, b) => {
    // Favorites first
    const aFav = favorites.has(a.id);
    const bFav = favorites.has(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    
    // Then alphabetical
    return a.name.localeCompare(b.name);
  });

  const renderPagination = () => {
    const { page, total, hasNextPage, hasPreviousPage } = modelsPaginationInfo;
    const totalPages = Math.ceil(total / modelsPaginationInfo.limit);
    
    if (totalPages <= 1) return null;

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (hasPreviousPage) handleModelsPageChange(page - 1);
              }}
              className={!hasPreviousPage ? "opacity-50 cursor-not-allowed" : ""}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleModelsPageChange(pageNum);
                  }}
                  isActive={pageNum === page}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          {totalPages > 5 && page < totalPages - 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (hasNextPage) handleModelsPageChange(page + 1);
              }}
              className={!hasNextPage ? "opacity-50 cursor-not-allowed" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  // Transform model data to match MotorcycleModel interface
  const transformModelForDisplay = (model: any): MotorcycleModel => {
    return {
      ...model,
      // Fix the brands property to match the expected interface
      brands: model.brands && Array.isArray(model.brands) && model.brands.length > 0 
        ? { name: model.brands[0].name } 
        : model.brand_name 
          ? { name: model.brand_name }
          : { name: 'Unknown Brand' }
    };
  };

  const ModelCard = ({ model }: { model: any }) => {
    const transformedModel = transformModelForDisplay(model);
    
    return (
      <div
        key={model.id}
        className={`
          p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md
          ${selectedModel === model.id 
            ? 'border-accent-teal bg-accent-teal/10' 
            : 'border-explorer-chrome/30 bg-explorer-card'
          }
        `}
        onClick={() => onModelSelect(model.id)}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-medium text-explorer-text">{model.name}</h4>
            <p className="text-sm text-explorer-text-muted">{transformedModel.brands?.name}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(model.id);
            }}
          >
            <Star 
              className={`h-4 w-4 ${
                favorites.has(model.id) 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-explorer-text-muted'
              }`} 
            />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {model.type && (
            <Badge variant="secondary" className="text-xs">{model.type}</Badge>
          )}
          {model.production_status && model.production_status !== 'active' && (
            <Badge variant="outline" className="text-xs">{model.production_status}</Badge>
          )}
        </div>
        
        <div className="text-xs text-explorer-text-muted">
          {model.production_start_year && (
            <span>
              {model.production_start_year}
              {model.production_end_year ? `-${model.production_end_year}` : '-Present'}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className={`bg-explorer-card border-explorer-chrome/30 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-explorer-text">Select Model</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="h-8 w-8 p-0"
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
            <Input
              placeholder="Search models..."
              value={modelSearch}
              onChange={handleSearchChange}
              className="pl-10 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={modelFilters.type} onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger className="w-[140px] bg-explorer-dark border-explorer-chrome/30 text-explorer-text">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-explorer-card border-explorer-chrome/30">
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="sport">Sport</SelectItem>
                <SelectItem value="cruiser">Cruiser</SelectItem>
                <SelectItem value="touring">Touring</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="naked">Naked</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={modelFilters.production_status} onValueChange={(value) => handleFilterChange('production_status', value)}>
              <SelectTrigger className="w-[120px] bg-explorer-dark border-explorer-chrome/30 text-explorer-text">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-explorer-card border-explorer-chrome/30">
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
                <SelectItem value="concept">Concept</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={modelsPaginationInfo.limit.toString()} 
              onValueChange={(value) => handleModelsLimitChange(parseInt(value))}
            >
              <SelectTrigger className="w-[100px] bg-explorer-dark border-explorer-chrome/30 text-explorer-text">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-explorer-card border-explorer-chrome/30">
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {modelsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 bg-explorer-chrome/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
                : 'space-y-2'
              }
            `}>
              {sortedModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
            
            {sortedModels.length === 0 && (
              <div className="text-center py-8">
                <p className="text-explorer-text-muted">No models found matching your search.</p>
              </div>
            )}
            
            {/* Pagination */}
            <div className="mt-6 flex justify-center">
              {renderPagination()}
            </div>
            
            {/* Results info */}
            <div className="mt-4 text-center text-sm text-explorer-text-muted">
              Showing {sortedModels.length} of {modelsPaginationInfo.total} models
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PaginatedModelSelector;
