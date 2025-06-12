
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Star, StarOff } from "lucide-react";
import { MotorcycleModel } from "@/types/motorcycle";

interface EnhancedModelsColumnProps {
  models: MotorcycleModel[];
  selectedModel: string | null;
  onModelSelect: (modelId: string) => void;
}

const EnhancedModelsColumn = ({
  models,
  selectedModel,
  onModelSelect
}: EnhancedModelsColumnProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [pinnedModels, setPinnedModels] = useState<Set<string>>(new Set());

  // Extract unique brands and categories for filters
  const brands = useMemo(() => {
    const uniqueBrands = new Set(models.map(m => m.brand?.name).filter(Boolean));
    return Array.from(uniqueBrands).sort();
  }, [models]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(models.map(m => m.type).filter(Boolean));
    return Array.from(uniqueCategories).sort();
  }, [models]);

  // Filter and sort models
  const filteredModels = useMemo(() => {
    let filtered = models.filter(model => {
      const matchesSearch = !searchQuery || 
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.brand?.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBrand = brandFilter === "all" || model.brand?.name === brandFilter;
      const matchesCategory = categoryFilter === "all" || model.type === categoryFilter;
      const matchesStatus = statusFilter === "all" || model.production_status === statusFilter;

      return matchesSearch && matchesBrand && matchesCategory && matchesStatus;
    });

    // Sort models
    filtered.sort((a, b) => {
      // Pinned models first
      const aPinned = pinnedModels.has(a.id);
      const bPinned = pinnedModels.has(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;

      // Then by selected sort criteria
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "brand":
          return (a.brand?.name || "").localeCompare(b.brand?.name || "");
        case "year":
          return (b.production_start_year || 0) - (a.production_start_year || 0);
        case "status":
          return a.production_status.localeCompare(b.production_status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [models, searchQuery, brandFilter, categoryFilter, statusFilter, sortBy, pinnedModels]);

  const handleTogglePin = (modelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPinned = new Set(pinnedModels);
    if (newPinned.has(modelId)) {
      newPinned.delete(modelId);
    } else {
      newPinned.add(modelId);
    }
    setPinnedModels(newPinned);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setBrandFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all");
    setSortBy("name");
  };

  const activeFilterCount = [brandFilter, categoryFilter, statusFilter].filter(f => f !== "all").length;

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="text-explorer-text flex items-center justify-between">
          Models
          <Badge variant="secondary">{filteredModels.length}/{models.length}</Badge>
        </CardTitle>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
          <Input
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
          />
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-explorer-text-muted" />
            <span className="text-sm text-explorer-text-muted">Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {activeFilterCount} active
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
                <SelectItem value="concept">Concept</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="brand">Brand</SelectItem>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="w-full text-xs"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
        {filteredModels.length === 0 ? (
          <div className="text-center py-8 text-explorer-text-muted">
            {searchQuery || activeFilterCount > 0 ? 
              "No models match your filters" : 
              "No models available"
            }
          </div>
        ) : (
          filteredModels.map((model) => (
            <div
              key={model.id}
              className={`relative group p-3 rounded-md cursor-pointer transition-colors ${
                selectedModel === model.id
                  ? 'bg-accent-teal/20 text-accent-teal border border-accent-teal/30'
                  : 'bg-explorer-dark hover:bg-explorer-chrome/10 border border-explorer-chrome/20'
              }`}
              onClick={() => onModelSelect(model.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm truncate">
                      {model.brand?.name} {model.name}
                    </h3>
                    {pinnedModels.has(model.id) && (
                      <Star className="h-3 w-3 text-amber-400 fill-current" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {model.type}
                    </Badge>
                    <Badge 
                      variant={model.production_status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {model.production_status}
                    </Badge>
                  </div>
                  {model.production_start_year && (
                    <p className="text-xs text-explorer-text-muted mt-1">
                      {model.production_start_year}
                      {model.production_end_year ? `-${model.production_end_year}` : '-Present'}
                    </p>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleTogglePin(model.id, e)}
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {pinnedModels.has(model.id) ? (
                    <StarOff className="h-3 w-3" />
                  ) : (
                    <Star className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedModelsColumn;
