import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModelYear } from "@/types/motorcycle";
import { Palette, Star, Calendar, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ColorManagementSectionProps {
  formData: any;
  modelYears: ModelYear[];
  selectedColors: any[];
  validation: any;
  onColorSelection: (yearId: string, colorIds: string[], defaultColorId?: string) => void;
}

const ColorManagementSection = ({
  formData,
  modelYears,
  selectedColors,
  validation,
  onColorSelection
}: ColorManagementSectionProps) => {
  const [selectedYear, setSelectedYear] = useState<string>(
    formData.target_years?.[0] || ""
  );

  // Fetch available colors for the selected year
  const { data: availableColors = [], isLoading } = useQuery({
    queryKey: ['colors', selectedYear],
    queryFn: async () => {
      if (!selectedYear) return [];
      
      const { data, error } = await supabase
        .from('color_options')
        .select('*')
        .eq('model_year_id', selectedYear)
        .order('name');

      if (error) {
        console.error('Error fetching colors:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!selectedYear
  });

  // Fetch color variants for additional options
  const { data: colorVariants = [] } = useQuery({
    queryKey: ['color-variants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('color_variants')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching color variants:', error);
        return [];
      }

      return data || [];
    }
  });

  const getColorsForYear = (yearId: string) => {
    return selectedColors.find(s => s.yearId === yearId)?.colorIds || [];
  };

  const getDefaultColorForYear = (yearId: string) => {
    return selectedColors.find(s => s.yearId === yearId)?.defaultColorId;
  };

  const handleColorToggle = (yearId: string, colorId: string, checked: boolean) => {
    const currentColors = getColorsForYear(yearId);
    const currentDefault = getDefaultColorForYear(yearId);
    
    let newColors;
    let newDefault = currentDefault;

    if (checked) {
      newColors = [...currentColors, colorId];
      // If this is the first color, make it default
      if (currentColors.length === 0) {
        newDefault = colorId;
      }
    } else {
      newColors = currentColors.filter(id => id !== colorId);
      // If removing the default color, clear the default
      if (currentDefault === colorId) {
        newDefault = newColors.length > 0 ? newColors[0] : undefined;
      }
    }

    onColorSelection(yearId, newColors, newDefault);
  };

  const handleDefaultColorChange = (yearId: string, colorId: string) => {
    const currentColors = getColorsForYear(yearId);
    onColorSelection(yearId, currentColors, colorId);
  };

  const selectedYearData = modelYears.find(y => y.id === selectedYear);
  const targetYears = formData.target_years || [];
  const yearColors = getColorsForYear(selectedYear);
  const defaultColor = getDefaultColorForYear(selectedYear);

  return (
    <div className="space-y-6">
      {/* Year Selection */}
      <Card className="bg-explorer-dark border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-explorer-text">
            <Palette className="h-5 w-5 text-accent-teal" />
            Color Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label className="text-explorer-text">Configure colors for year:</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-48 bg-explorer-card border-explorer-chrome/30">
                  <SelectValue placeholder="Select model year" />
                </SelectTrigger>
                <SelectContent>
                  {targetYears.map((yearId: string) => {
                    const year = modelYears.find(y => y.id === yearId);
                    return year ? (
                      <SelectItem key={yearId} value={yearId}>
                        {year.year}
                      </SelectItem>
                    ) : null;
                  })}
                </SelectContent>
              </Select>
            </div>

            {selectedYearData && (
              <div className="p-4 bg-explorer-card rounded-lg border border-explorer-chrome/30">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-accent-teal" />
                  <span className="text-explorer-text font-medium">Year-Specific Colors</span>
                </div>
                <p className="text-explorer-text/70 text-sm">
                  Select which colors are available for the <strong>{selectedYearData.year}</strong> model year. 
                  You can choose from existing colors or create new ones.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Color Selection */}
      {selectedYear && (
        <Card className="bg-explorer-dark border-explorer-chrome/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-explorer-text">
              Available Colors - {selectedYearData?.year}
            </CardTitle>
            <Button variant="outline" size="sm" className="border-accent-teal text-accent-teal">
              <Plus className="h-4 w-4 mr-2" />
              Add New Color
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-explorer-text/70">Loading colors...</div>
            ) : availableColors.length === 0 ? (
              <div className="text-center py-8">
                <Palette className="h-12 w-12 text-explorer-text/30 mx-auto mb-4" />
                <p className="text-explorer-text/70 mb-4">
                  No colors available for {selectedYearData?.year}
                </p>
                <Button variant="outline" className="border-accent-teal text-accent-teal">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Color
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableColors.map((color: any) => {
                    const isSelected = yearColors.includes(color.id);
                    const isDefault = defaultColor === color.id;

                    return (
                      <div
                        key={color.id}
                        className={`p-4 rounded-lg border transition-all ${
                          isSelected
                            ? "border-accent-teal bg-accent-teal/10"
                            : "border-explorer-chrome/30 bg-explorer-card"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => 
                              handleColorToggle(selectedYear, color.id, checked as boolean)
                            }
                          />
                          
                          <div className="flex items-center gap-2 flex-1">
                            {color.hex_code && (
                              <div
                                className="w-6 h-6 rounded-full border border-explorer-chrome/30"
                                style={{ backgroundColor: color.hex_code }}
                              />
                            )}
                            <div>
                              <h4 className="text-explorer-text font-medium">{color.name}</h4>
                              {color.hex_code && (
                                <p className="text-explorer-text/60 text-xs">{color.hex_code}</p>
                              )}
                            </div>
                          </div>

                          {isDefault && (
                            <Badge className="bg-accent-teal text-black">
                              <Star className="h-3 w-3 mr-1" />
                              Default
                            </Badge>
                          )}
                        </div>

                        {isSelected && yearColors.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDefaultColorChange(selectedYear, color.id)}
                            className={`w-full text-xs ${
                              isDefault 
                                ? "text-accent-teal" 
                                : "text-explorer-text/70 hover:text-explorer-text"
                            }`}
                          >
                            {isDefault ? "Default Color" : "Set as Default"}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Selection Summary */}
                <div className="p-4 bg-explorer-card rounded-lg border border-explorer-chrome/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-explorer-text font-medium">Selection Summary</h4>
                    <Badge variant="outline" className="border-explorer-chrome/30">
                      {yearColors.length} color{yearColors.length !== 1 ? 's' : ''} selected
                    </Badge>
                  </div>
                  
                  {yearColors.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {yearColors.map((colorId: string) => {
                        const color = availableColors.find(c => c.id === colorId);
                        const isDefault = defaultColor === colorId;
                        return color ? (
                          <Badge
                            key={colorId}
                            className={
                              isDefault 
                                ? "bg-accent-teal text-black" 
                                : "bg-explorer-chrome/20 text-explorer-text"
                            }
                          >
                            {isDefault && <Star className="h-3 w-3 mr-1" />}
                            {color.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-explorer-text/60 text-sm">No colors selected</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* All Years Overview */}
      <Card className="bg-explorer-dark border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">All Years Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {targetYears.map((yearId: string) => {
              const year = modelYears.find(y => y.id === yearId);
              const yearColors = getColorsForYear(yearId);
              const defaultColor = getDefaultColorForYear(yearId);
              
              return year ? (
                <div
                  key={yearId}
                  className="flex items-center justify-between p-3 rounded-lg bg-explorer-card border border-explorer-chrome/30"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-explorer-text font-medium">{year.year}</span>
                    <Badge variant="outline" className="border-explorer-chrome/30">
                      {yearColors.length} color{yearColors.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {defaultColor && (
                      <Badge className="bg-accent-teal text-black">
                        <Star className="h-3 w-3 mr-1" />
                        Default Set
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedYear(yearId)}
                      className="text-accent-teal hover:text-accent-teal/80"
                    >
                      Configure
                    </Button>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </CardContent>
      </Card>

      {/* Validation Errors */}
      {validation.errors.some((error: any) => error.section === "colors") && (
        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="pt-6">
            <div className="space-y-2">
              {validation.errors
                .filter((error: any) => error.section === "colors")
                .map((error: any, index: number) => (
                  <p key={index} className="text-destructive text-sm">
                    {error.message}
                  </p>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ColorManagementSection;