
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";
import { MotorcycleModel } from "@/types/motorcycle";

interface ModelNavigatorSectionProps {
  models: MotorcycleModel[];
  selectedModel: string | null;
  onModelSelect: (modelId: string) => void;
  isLoading: boolean;
}

const ModelNavigatorSection = ({
  models,
  selectedModel,
  onModelSelect,
  isLoading
}: ModelNavigatorSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get unique brands and categories for filters
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(models.map(m => m.brand?.name).filter(Boolean))];
    return uniqueBrands.sort();
  }, [models]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(models.map(m => m.type).filter(Boolean))];
    return uniqueCategories.sort();
  }, [models]);

  // Filter models based on search and filters
  const filteredModels = useMemo(() => {
    return models.filter(model => {
      const matchesSearch = !searchQuery.trim() || 
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBrand = selectedBrand === "all" || model.brand?.name === selectedBrand;
      const matchesCategory = selectedCategory === "all" || model.type === selectedCategory;

      return matchesSearch && matchesBrand && matchesCategory;
    });
  }, [models, searchQuery, selectedBrand, selectedCategory]);

  return (
    <Card className="border-2 border-accent-teal bg-explorer-card">
      <CardHeader>
        <CardTitle className="text-explorer-text flex items-center gap-2">
          Model Navigator
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          <Badge variant="secondary" className="ml-auto">
            {filteredModels.length} models
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Controls - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
            <Input
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-explorer-dark border-explorer-chrome/30"
            />
          </div>

          {/* Brand Filter */}
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map(brand => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {filteredModels.length === 0 ? (
            <div className="col-span-full text-center py-8 text-explorer-text-muted">
              {searchQuery || selectedBrand !== "all" || selectedCategory !== "all" 
                ? "No models match your filters" 
                : "No models available"}
            </div>
          ) : (
            filteredModels.map((model) => (
              <Button
                key={model.id}
                variant="ghost"
                onClick={() => onModelSelect(model.id)}
                className={`h-auto p-4 text-left ${
                  selectedModel === model.id
                    ? 'bg-accent-teal/20 text-accent-teal border-accent-teal/30 border'
                    : 'bg-explorer-dark hover:bg-explorer-chrome/10 border border-explorer-chrome/20'
                }`}
              >
                <div className="w-full">
                  <div className="font-medium text-sm mb-1">
                    {model.brand?.name} {model.name}
                  </div>
                  <div className="text-xs text-explorer-text-muted">
                    {model.type} • {model.production_start_year}
                    {model.production_end_year && ` - ${model.production_end_year}`}
                  </div>
                </div>
              </Button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelNavigatorSection;
