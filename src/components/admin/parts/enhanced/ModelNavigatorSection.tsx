
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

  // Get unique brands and categories for filters - Fixed brand extraction
  const brands = useMemo(() => {
    console.log("Models data for brand extraction:", models?.slice(0, 2)); // Debug log
    const uniqueBrands = [...new Set(
      models.map(m => {
        // Access brand name from the correct property structure
        const brandName = m.brand?.name || null;
        console.log("Extracting brand from model:", m.name, "Brand:", brandName); // Debug log
        return brandName;
      }).filter(Boolean)
    )];
    console.log("Extracted brands:", uniqueBrands); // Debug log
    return uniqueBrands.sort();
  }, [models]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(models.map(m => m.type).filter(Boolean))];
    return uniqueCategories.sort();
  }, [models]);

  // Filter models based on search and filters - Fixed brand comparison
  const filteredModels = useMemo(() => {
    return models.filter(model => {
      const brandName = model.brand?.name || "";
      
      const matchesSearch = !searchQuery.trim() || 
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBrand = selectedBrand === "all" || brandName === selectedBrand;
      const matchesCategory = selectedCategory === "all" || model.type === selectedCategory;

      return matchesSearch && matchesBrand && matchesCategory;
    });
  }, [models, searchQuery, selectedBrand, selectedCategory]);

  return (
    <Card className="border-2 border-accent-teal bg-explorer-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-explorer-text flex items-center gap-2 text-lg">
          Model Navigator
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          <Badge variant="secondary" className="ml-auto text-xs">
            {filteredModels.length} models
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Filter Controls - Compact Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
            <Input
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-explorer-dark border-explorer-chrome/30 h-9"
            />
          </div>

          {/* Brand Filter */}
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30 h-9">
              <SelectValue placeholder={isLoading ? "Loading brands..." : "All Brands"} />
            </SelectTrigger>
            <SelectContent className="bg-explorer-dark border-explorer-chrome/30 z-50">
              <SelectItem value="all" className="text-explorer-text hover:bg-explorer-chrome/10">
                All Brands ({brands.length})
              </SelectItem>
              {brands.map(brand => (
                <SelectItem 
                  key={brand} 
                  value={brand}
                  className="text-explorer-text hover:bg-explorer-chrome/10"
                >
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30 h-9">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-explorer-dark border-explorer-chrome/30 z-50">
              <SelectItem value="all" className="text-explorer-text hover:bg-explorer-chrome/10">
                All Categories
              </SelectItem>
              {categories.map(category => (
                <SelectItem 
                  key={category} 
                  value={category}
                  className="text-explorer-text hover:bg-explorer-chrome/10"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Models Grid - Reduced Height */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
          {filteredModels.length === 0 ? (
            <div className="col-span-full text-center py-6 text-explorer-text-muted">
              {isLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Loading models...</span>
                </div>
              ) : searchQuery || selectedBrand !== "all" || selectedCategory !== "all" ? (
                "No models match your filters"
              ) : (
                "No models available"
              )}
            </div>
          ) : (
            filteredModels.map((model) => {
              const brandName = model.brand?.name || "Unknown Brand";
              return (
                <Button
                  key={model.id}
                  variant="ghost"
                  onClick={() => onModelSelect(model.id)}
                  className={`h-auto p-3 text-left justify-start ${
                    selectedModel === model.id
                      ? 'bg-accent-teal/20 text-accent-teal border-accent-teal/30 border'
                      : 'bg-explorer-dark hover:bg-explorer-chrome/10 border border-explorer-chrome/20'
                  }`}
                >
                  <div className="w-full">
                    <div className="font-medium text-sm mb-1 line-clamp-1">
                      {brandName} {model.name}
                    </div>
                    <div className="text-xs text-explorer-text-muted line-clamp-1">
                      {model.type} • {model.production_start_year}
                      {model.production_end_year && ` - ${model.production_end_year}`}
                    </div>
                  </div>
                </Button>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelNavigatorSection;
