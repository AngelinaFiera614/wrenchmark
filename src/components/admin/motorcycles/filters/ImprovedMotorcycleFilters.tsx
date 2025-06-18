
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, X, RotateCcw, Bookmark, Settings, Info } from "lucide-react";
import { Motorcycle, MotorcycleFilters } from "@/types";

interface FilterPreset {
  name: string;
  description: string;
  filters: Partial<MotorcycleFilters>;
  icon: React.ReactNode;
}

interface ImprovedMotorcycleFiltersProps {
  filters: MotorcycleFilters;
  motorcycles: Motorcycle[];
  filteredCount: number;
  onFilterChange: (filters: MotorcycleFilters) => void;
  onClearFilters: () => void;
  isOpen: boolean;
}

const ImprovedMotorcycleFilters = ({
  filters,
  motorcycles,
  filteredCount,
  onFilterChange,
  onClearFilters,
  isOpen
}: ImprovedMotorcycleFiltersProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["basic"]));

  const filterPresets: FilterPreset[] = [
    {
      name: "Beginner Friendly",
      description: "Easy to ride motorcycles for new riders",
      icon: <Info className="h-4 w-4" />,
      filters: {
        categories: ["Standard", "Cruiser"],
        engineSizeRange: [125, 650],
        seatHeightRange: [700, 800],
        weightRange: [150, 250]
      }
    },
    {
      name: "Sport Bikes",
      description: "High performance sport motorcycles",
      icon: <Settings className="h-4 w-4" />,
      filters: {
        categories: ["Sport"],
        engineSizeRange: [600, 1400],
        weightRange: [160, 220]
      }
    },
    {
      name: "Adventure Ready",
      description: "Motorcycles built for long distance touring",
      icon: <Bookmark className="h-4 w-4" />,
      filters: {
        categories: ["Adventure", "Touring"],
        engineSizeRange: [800, 1300],
        abs: true
      }
    }
  ];

  const availableCategories = ["Sport", "Cruiser", "Touring", "Adventure", "Standard", "Naked"];

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const applyPreset = (preset: FilterPreset) => {
    onFilterChange({ ...filters, ...preset.filters });
  };

  const activeFiltersCount = [
    filters.categories.length > 0,
    filters.make !== "",
    filters.yearRange[0] !== 1900 || filters.yearRange[1] !== 2030,
    filters.engineSizeRange[0] !== 0 || filters.engineSizeRange[1] !== 3000,
    filters.weightRange[0] !== 0 || filters.weightRange[1] !== 600,
    filters.seatHeightRange[0] !== 400 || filters.seatHeightRange[1] !== 1300,
    filters.abs !== null
  ].filter(Boolean).length;

  if (!isOpen) return null;

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-accent-teal text-black">
                {activeFiltersCount} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="text-sm text-explorer-text-muted">
              {filteredCount} of {motorcycles.length} motorcycles
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              disabled={activeFiltersCount === 0}
              className="bg-explorer-dark border-explorer-chrome/30"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Filter Presets */}
        <div className="flex flex-wrap gap-2">
          {filterPresets.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(preset)}
              className="bg-explorer-dark border-explorer-chrome/30 hover:bg-accent-teal/20"
            >
              {preset.icon}
              <span className="ml-1">{preset.name}</span>
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            {/* Categories */}
            <Collapsible open={expandedSections.has("categories")} onOpenChange={() => toggleSection("categories")}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Categories</span>
                    {filters.categories.length > 0 && (
                      <Badge variant="outline" className="text-xs">{filters.categories.length}</Badge>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableCategories.map((category) => {
                    const isSelected = filters.categories.includes(category);
                    return (
                      <Button
                        key={category}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newCategories = isSelected 
                            ? filters.categories.filter(c => c !== category)
                            : [...filters.categories, category];
                          onFilterChange({ ...filters, categories: newCategories });
                        }}
                        className={isSelected ? "bg-accent-teal text-black" : "bg-explorer-dark border-explorer-chrome/30"}
                      >
                        {category}
                      </Button>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Make */}
            <div>
              <label className="text-sm font-medium text-explorer-text mb-2 block">Manufacturer</label>
              <Select 
                value={filters.make} 
                onValueChange={(value) => onFilterChange({ ...filters, make: value })}
              >
                <SelectTrigger className="bg-explorer-dark border-explorer-chrome/30">
                  <SelectValue placeholder="All manufacturers" />
                </SelectTrigger>
                <SelectContent className="bg-explorer-card border-explorer-chrome/30">
                  <SelectItem value="">All manufacturers</SelectItem>
                  {Array.from(new Set(motorcycles.map(m => m.make).filter(Boolean))).sort().map(make => (
                    <SelectItem key={make} value={make!}>{make}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year Range */}
            <div>
              <label className="text-sm font-medium text-explorer-text mb-2 block">
                Production Year: {filters.yearRange[0]} - {filters.yearRange[1]}
              </label>
              <Slider
                value={filters.yearRange}
                onValueChange={(value) => onFilterChange({ ...filters, yearRange: value as [number, number] })}
                min={1900}
                max={2030}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-explorer-text-muted mt-1">
                <span>1900</span>
                <span>2030</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specs" className="space-y-4 mt-4">
            {/* Engine Size */}
            <div>
              <label className="text-sm font-medium text-explorer-text mb-2 block">
                Engine Size: {filters.engineSizeRange[0]}cc - {filters.engineSizeRange[1]}cc
              </label>
              <Slider
                value={filters.engineSizeRange}
                onValueChange={(value) => onFilterChange({ ...filters, engineSizeRange: value as [number, number] })}
                min={0}
                max={3000}
                step={50}
                className="mt-2"
              />
            </div>

            {/* Weight Range */}
            <div>
              <label className="text-sm font-medium text-explorer-text mb-2 block">
                Weight: {filters.weightRange[0]}kg - {filters.weightRange[1]}kg
              </label>
              <Slider
                value={filters.weightRange}
                onValueChange={(value) => onFilterChange({ ...filters, weightRange: value as [number, number] })}
                min={0}
                max={600}
                step={10}
                className="mt-2"
              />
            </div>

            {/* Seat Height */}
            <div>
              <label className="text-sm font-medium text-explorer-text mb-2 block">
                Seat Height: {filters.seatHeightRange[0]}mm - {filters.seatHeightRange[1]}mm
              </label>
              <Slider
                value={filters.seatHeightRange}
                onValueChange={(value) => onFilterChange({ ...filters, seatHeightRange: value as [number, number] })}
                min={400}
                max={1300}
                step={10}
                className="mt-2"
              />
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-4 mt-4">
            {/* ABS */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-explorer-text">ABS Brakes</span>
              <div className="flex gap-2">
                {[
                  { label: "Any", value: null },
                  { label: "Yes", value: true },
                  { label: "No", value: false }
                ].map((option) => (
                  <Button
                    key={option.label}
                    variant={filters.abs === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange({ ...filters, abs: option.value })}
                    className={filters.abs === option.value ? "bg-accent-teal text-black" : "bg-explorer-dark border-explorer-chrome/30"}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Active Filter Pills */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 pt-4 border-t border-explorer-chrome/30">
            <div className="flex flex-wrap gap-2">
              {filters.categories.map((category) => (
                <Badge key={category} variant="secondary" className="bg-accent-teal/20 text-accent-teal">
                  {category}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => onFilterChange({ 
                      ...filters, 
                      categories: filters.categories.filter(c => c !== category) 
                    })}
                  />
                </Badge>
              ))}
              {filters.make && (
                <Badge variant="secondary" className="bg-accent-teal/20 text-accent-teal">
                  Make: {filters.make}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => onFilterChange({ ...filters, make: "" })}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImprovedMotorcycleFilters;
