import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Edit, Trash2, Copy, Download, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMotorcycleModelBySlug } from "@/services/modelService";
import { fetchModelYears } from "@/services/models/modelYearService";
import { fetchConfigurations, cloneConfiguration, deleteConfiguration } from "@/services/models/configurationService";
import ConfigurationEditor from "@/components/admin/models/ConfigurationEditor";
import MetricsDisplay from "@/components/admin/models/MetricsDisplay";
import { useConfigurationMetrics, useMultipleConfigurationMetrics } from "@/hooks/useConfigurationMetrics";
import AdminModelYearDialog from "@/components/admin/models/AdminModelYearDialog";
import ModelSuggestionsDialog from "@/components/admin/models/ModelSuggestionsDialog";
import { useModelAutofill } from "@/hooks/useModelAutofill";
import { useAuth } from "@/context/auth";

const ModelDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const isAdmin = profile?.is_admin;
  
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [showConfigEditor, setShowConfigEditor] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [showYearDialog, setShowYearDialog] = useState(false);
  const [showSuggestionsDialog, setShowSuggestionsDialog] = useState(false);

  // Autofill functionality
  const { isLoading: isFetching, suggestions, fetchModelInfo, clearSuggestions } = useModelAutofill();

  // Fetch model data
  const { data: model, isLoading: modelLoading } = useQuery({
    queryKey: ["model-detail", slug],
    queryFn: () => getMotorcycleModelBySlug(slug!),
    enabled: !!slug
  });

  // Fetch model years
  const { data: years, isLoading: yearsLoading, refetch: refetchYears } = useQuery({
    queryKey: ["model-years", model?.id],
    queryFn: () => fetchModelYears(model!.id),
    enabled: !!model?.id
  });

  // Fetch configurations for selected year
  const { data: configurations, isLoading: configsLoading, refetch: refetchConfigs } = useQuery({
    queryKey: ["configurations", selectedYear],
    queryFn: () => fetchConfigurations(selectedYear!),
    enabled: !!selectedYear
  });

  // Calculate metrics for all configurations
  const configMetrics = useMultipleConfigurationMetrics(configurations || []);

  // Set default selected year when years are loaded
  React.useEffect(() => {
    if (years && years.length > 0 && !selectedYear) {
      setSelectedYear(years[0].id);
    }
  }, [years, selectedYear]);

  const handleCloneConfiguration = async (config: any) => {
    const clonedConfig = await cloneConfiguration(config.id, `${config.name} (Copy)`);
    if (clonedConfig) {
      toast({
        title: "Configuration cloned",
        description: `${clonedConfig.name} has been created.`,
      });
      refetchConfigs();
    }
  };

  const handleDeleteConfiguration = async (config: any) => {
    if (!confirm(`Are you sure you want to delete the ${config.name} configuration?`)) {
      return;
    }

    const success = await deleteConfiguration(config.id);
    if (success) {
      toast({
        title: "Configuration deleted",
        description: `${config.name} has been removed.`,
      });
      refetchConfigs();
    }
  };

  const handleConfigSaved = () => {
    setShowConfigEditor(false);
    setEditingConfig(null);
    refetchConfigs();
  };

  const handleYearSaved = () => {
    setShowYearDialog(false);
    refetchYears();
  };

  const handleFetchModelInfo = async () => {
    if (!model) return;
    
    const success = await fetchModelInfo(model);
    if (success && suggestions) {
      setShowSuggestionsDialog(true);
    }
  };

  const handleSuggestionsApplied = () => {
    clearSuggestions();
    // Refetch the model data to show updated values
    window.location.reload();
  };

  if (modelLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal"></div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-explorer-text">Model not found</h1>
        <Button onClick={() => navigate('/admin/models')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Models
        </Button>
      </div>
    );
  }

  if (showConfigEditor) {
    return (
      <ConfigurationEditor
        modelYearId={selectedYear!}
        configuration={editingConfig}
        onSave={handleConfigSaved}
        onCancel={() => {
          setShowConfigEditor(false);
          setEditingConfig(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/models')}
            className="border-explorer-chrome/30"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Models
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-explorer-text">
              {model.brand?.name} {model.name}
            </h1>
            <p className="text-explorer-text-muted">
              {model.production_start_year}
              {model.production_end_year ? `-${model.production_end_year}` : '-Present'} • 
              {model.production_status}
            </p>
          </div>
        </div>
        
        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button
              onClick={handleFetchModelInfo}
              disabled={isFetching || model.ignore_autofill}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              {isFetching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                  Fetching...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Fetch Model Info
                </>
              )}
            </Button>
            {model.ignore_autofill && (
              <span className="text-xs text-muted-foreground">
                Autofill disabled
              </span>
            )}
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="years">Model Years</TabsTrigger>
          <TabsTrigger value="configurations">Configurations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Model Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-explorer-text mb-2">Basic Details</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-explorer-text-muted">Type:</span> {model.type}</div>
                      <div><span className="text-explorer-text-muted">Status:</span> {model.production_status}</div>
                      <div><span className="text-explorer-text-muted">Years:</span> {model.production_start_year}-{model.production_end_year || 'Present'}</div>
                    </div>
                  </div>
                  
                  {model.base_description && (
                    <div>
                      <h3 className="font-semibold text-explorer-text mb-2">Description</h3>
                      <p className="text-sm text-explorer-text-muted">{model.base_description}</p>
                    </div>
                  )}
                </div>
                
                {model.default_image_url && (
                  <div>
                    <img 
                      src={model.default_image_url} 
                      alt={`${model.brand?.name} ${model.name}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-explorer-text">Model Years</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent-teal">{years?.length || 0}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-explorer-text">Configurations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {years?.reduce((total, year) => total + (year.configurations?.length || 0), 0) || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-explorer-text">Production Span</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-explorer-text">
                  {model.production_end_year 
                    ? model.production_end_year - model.production_start_year + 1
                    : new Date().getFullYear() - model.production_start_year + 1
                  } years
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="years" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-explorer-text">Model Years</h2>
            <Button 
              onClick={() => setShowYearDialog(true)}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Year
            </Button>
          </div>

          {yearsLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-teal"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {years?.map((year) => (
                <Card key={year.id} className="bg-explorer-card border-explorer-chrome/30">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-explorer-text">{year.year}</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedYear(year.id)}
                        className={selectedYear === year.id ? "bg-accent-teal/20" : ""}
                      >
                        {selectedYear === year.id ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {year.msrp_usd && (
                        <div><span className="text-explorer-text-muted">MSRP:</span> ${year.msrp_usd.toLocaleString()}</div>
                      )}
                      <div><span className="text-explorer-text-muted">Configurations:</span> {year.configurations?.length || 0}</div>
                      {year.changes && (
                        <div className="text-xs text-explorer-text-muted mt-2">{year.changes}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="configurations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-explorer-text">
              Configurations {selectedYear && years && `- ${years.find(y => y.id === selectedYear)?.year}`}
            </h2>
            <Button 
              onClick={() => setShowConfigEditor(true)}
              disabled={!selectedYear}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Configuration
            </Button>
          </div>

          {!selectedYear ? (
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardContent className="p-8 text-center">
                <p className="text-explorer-text-muted">Select a model year to view configurations.</p>
              </CardContent>
            </Card>
          ) : configsLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-teal"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {configurations?.map((config) => (
                <Card key={config.id} className="bg-explorer-card border-explorer-chrome/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-explorer-text">{config.name}</CardTitle>
                        {config.is_default && (
                          <span className="px-2 py-1 text-xs bg-accent-teal/20 text-accent-teal rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCloneConfiguration(config)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingConfig(config);
                            setShowConfigEditor(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteConfiguration(config)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {config.weight_kg && (
                            <div><span className="text-explorer-text-muted">Weight:</span> {config.weight_kg}kg</div>
                          )}
                          {config.seat_height_mm && (
                            <div><span className="text-explorer-text-muted">Seat Height:</span> {config.seat_height_mm}mm</div>
                          )}
                          {config.wheelbase_mm && (
                            <div><span className="text-explorer-text-muted">Wheelbase:</span> {config.wheelbase_mm}mm</div>
                          )}
                          {config.fuel_capacity_l && (
                            <div><span className="text-explorer-text-muted">Fuel:</span> {config.fuel_capacity_l}L</div>
                          )}
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          {config.engine && (
                            <div><span className="text-explorer-text-muted">Engine:</span> {config.engine.name}</div>
                          )}
                          {config.brakes && (
                            <div><span className="text-explorer-text-muted">Brakes:</span> {config.brakes.type}</div>
                          )}
                          {config.frame && (
                            <div><span className="text-explorer-text-muted">Frame:</span> {config.frame.type}</div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        {configMetrics.find(m => m.configId === config.id)?.metrics && (
                          <MetricsDisplay 
                            metrics={configMetrics.find(m => m.configId === config.id)!.metrics} 
                            compact 
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-explorer-text-muted">Coming soon: Performance trends, configuration comparisons, and historical analysis.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Suggestions Dialog */}
      {suggestions && (
        <ModelSuggestionsDialog
          open={showSuggestionsDialog}
          onClose={() => setShowSuggestionsDialog(false)}
          model={model}
          suggestedData={suggestions.suggested_data}
          source={suggestions.source}
          onApplied={handleSuggestionsApplied}
        />
      )}

      {/* Dialogs */}
      <AdminModelYearDialog
        open={showYearDialog}
        model={model}
        onClose={handleYearSaved}
      />
    </div>
  );
};

export default ModelDetailPage;
