
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Settings, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Motorcycle } from "@/types";
import { Configuration } from "@/types/motorcycle";
import { fetchModelYears, generateModelYears, createModelYear } from "@/services/models/modelYearService";
import { fetchConfigurations } from "@/services/models/configurationService";
import TrimLevelManagerEnhanced from "@/components/admin/parts/TrimLevelManagerEnhanced";
import { supabase } from "@/integrations/supabase/client";

interface MotorcycleYearsFormProps {
  motorcycle: Motorcycle;
  isEditing: boolean;
  onUpdate: (data: Partial<Motorcycle>) => void;
}

interface ModelYear {
  id: string;
  year: number;
  changes?: string;
  msrp_usd?: number;
  marketing_tagline?: string;
  is_available: boolean;
  image_url?: string;
  configurations?: any[]; // Simplified to avoid type conflicts
}

const MotorcycleYearsForm = ({ motorcycle, isEditing, onUpdate }: MotorcycleYearsFormProps) => {
  const { toast } = useToast();
  const [modelYears, setModelYears] = useState<ModelYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("years");

  // Load model years when component mounts or motorcycle changes
  useEffect(() => {
    if (motorcycle.id) {
      loadModelYears();
    }
  }, [motorcycle.id]);

  // Load configurations when a year is selected
  useEffect(() => {
    if (selectedYear) {
      loadConfigurations();
    } else {
      setConfigurations([]);
      setSelectedConfig(null);
    }
  }, [selectedYear]);

  const loadModelYears = async () => {
    try {
      setLoading(true);
      const years = await fetchModelYears(motorcycle.id);
      // Transform to match our ModelYear interface
      const transformedYears: ModelYear[] = years.map(year => ({
        id: year.id,
        year: year.year,
        changes: year.changes,
        msrp_usd: year.msrp_usd,
        marketing_tagline: year.marketing_tagline,
        is_available: year.is_available,
        image_url: year.image_url,
        configurations: year.configurations || []
      }));
      setModelYears(transformedYears);
      
      // Auto-select the most recent year if none selected
      if (transformedYears.length > 0 && !selectedYear) {
        const mostRecentYear = transformedYears.sort((a, b) => b.year - a.year)[0];
        setSelectedYear(mostRecentYear.id);
      }
    } catch (error) {
      console.error("Error loading model years:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load model years."
      });
    } finally {
      setLoading(false);
    }
  };

  const loadConfigurations = async () => {
    if (!selectedYear) return;
    
    try {
      const configs = await fetchConfigurations(selectedYear);
      setConfigurations(configs);
      
      // Auto-select the default configuration if available
      const defaultConfig = configs.find(c => c.is_default);
      if (defaultConfig) {
        setSelectedConfig(defaultConfig.id);
      } else if (configs.length > 0) {
        setSelectedConfig(configs[0].id);
      }
    } catch (error) {
      console.error("Error loading configurations:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load configurations for the selected year."
      });
    }
  };

  const handleGenerateYears = async () => {
    if (!motorcycle.production_start_year) {
      toast({
        variant: "destructive",
        title: "Missing Production Year",
        description: "Please set the production start year in the Basic Info tab first."
      });
      return;
    }

    try {
      const success = await generateModelYears(motorcycle.id);
      if (success) {
        toast({
          title: "Success!",
          description: "Model years have been generated based on production dates."
        });
        await loadModelYears();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate model years."
      });
    }
  };

  const handleAddYear = async () => {
    const currentYear = new Date().getFullYear();
    const nextYear = Math.max(currentYear, ...modelYears.map(y => y.year)) + 1;
    
    try {
      const success = await createModelYear(motorcycle.id, {
        year: nextYear,
        changes: `${nextYear} model year`,
        is_available: true
      });
      
      if (success) {
        toast({
          title: "Success!",
          description: `${nextYear} model year has been added.`
        });
        await loadModelYears();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add new model year."
      });
    }
  };

  const selectedYearData = modelYears.find(y => y.id === selectedYear);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-explorer-text">Loading years and trim levels...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="years">Model Years</TabsTrigger>
          <TabsTrigger value="trims">Trim Levels</TabsTrigger>
        </TabsList>

        <TabsContent value="years" className="space-y-4">
          {/* Years Management Header */}
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent-teal" />
                  <CardTitle className="text-explorer-text">Model Years</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-explorer-dark border-explorer-chrome/30">
                    {modelYears.length} {modelYears.length === 1 ? 'Year' : 'Years'}
                  </Badge>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleGenerateYears}
                        className="bg-explorer-dark border-explorer-chrome/30"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Generate Years
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleAddYear}
                        className="bg-accent-teal text-black hover:bg-accent-teal/80"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Year
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {modelYears.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-explorer-text-muted" />
                  <h3 className="text-lg font-medium text-explorer-text mb-2">
                    No Model Years Found
                  </h3>
                  <p className="text-explorer-text-muted mb-4">
                    {motorcycle.production_start_year 
                      ? "Generate model years based on production dates or add them manually"
                      : "Set the production start year in Basic Info to generate model years automatically"
                    }
                  </p>
                  {isEditing && (
                    <div className="flex justify-center gap-2">
                      {motorcycle.production_start_year && (
                        <Button 
                          variant="outline" 
                          onClick={handleGenerateYears}
                          className="bg-explorer-dark border-explorer-chrome/30"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Generate Years
                        </Button>
                      )}
                      <Button onClick={handleAddYear} className="bg-accent-teal text-black hover:bg-accent-teal/80">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Year Manually
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {modelYears.map((year) => (
                    <div
                      key={year.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedYear === year.id
                          ? 'bg-accent-teal/20 border-accent-teal'
                          : 'bg-explorer-dark border-explorer-chrome/30 hover:border-explorer-chrome/50'
                      }`}
                      onClick={() => setSelectedYear(year.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-explorer-text">{year.year}</h3>
                        <Badge 
                          variant={year.is_available ? "default" : "secondary"}
                          className={year.is_available ? "bg-green-600/20 text-green-400" : "bg-gray-600/20 text-gray-400"}
                        >
                          {year.is_available ? "Available" : "Discontinued"}
                        </Badge>
                      </div>
                      {year.changes && (
                        <p className="text-sm text-explorer-text-muted mb-2">{year.changes}</p>
                      )}
                      {year.msrp_usd && (
                        <p className="text-sm text-accent-teal">MSRP: ${year.msrp_usd.toLocaleString()}</p>
                      )}
                      <div className="mt-2 text-xs text-explorer-text-muted">
                        {configurations.filter(c => c.model_year_id === year.id).length} trim levels
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Year Details */}
          {selectedYearData && (
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle className="text-explorer-text">
                  {selectedYearData.year} Model Year Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-explorer-text">Changes</label>
                    <p className="text-explorer-text-muted">{selectedYearData.changes || "No changes noted"}</p>
                  </div>
                  {selectedYearData.msrp_usd && (
                    <div>
                      <label className="text-sm font-medium text-explorer-text">Base MSRP</label>
                      <p className="text-accent-teal">${selectedYearData.msrp_usd.toLocaleString()}</p>
                    </div>
                  )}
                  {selectedYearData.marketing_tagline && (
                    <div>
                      <label className="text-sm font-medium text-explorer-text">Marketing Tagline</label>
                      <p className="text-explorer-text-muted">{selectedYearData.marketing_tagline}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-explorer-chrome/30">
                  <span className="text-sm text-explorer-text-muted">
                    Switch to Trim Levels tab to manage configurations for this year
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveTab("trims")}
                    className="bg-explorer-dark border-explorer-chrome/30"
                  >
                    Manage Trim Levels
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trims" className="space-y-4">
          {!selectedYear ? (
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardContent className="p-8">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                  <h3 className="text-lg font-medium text-explorer-text mb-2">
                    Select a Model Year
                  </h3>
                  <p className="text-explorer-text-muted mb-4">
                    Choose a model year from the Years tab to manage its trim levels and configurations
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("years")}
                    className="bg-explorer-dark border-explorer-chrome/30"
                  >
                    Go to Model Years
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <TrimLevelManagerEnhanced
              modelYearId={selectedYear}
              configurations={configurations}
              selectedConfig={selectedConfig}
              onConfigSelect={setSelectedConfig}
              onConfigChange={loadConfigurations}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MotorcycleYearsForm;
