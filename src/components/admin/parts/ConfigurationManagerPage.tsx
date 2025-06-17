
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Settings, 
  Plus,
  Calendar,
  Wrench
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ModelYearSelectorProps {
  onModelSelect: (modelId: string) => void;
  onYearSelect: (yearId: string) => void;
  selectedModel: string | null;
  selectedYear: string | null;
}

const ModelYearSelector: React.FC<ModelYearSelectorProps> = ({
  onModelSelect,
  onYearSelect,
  selectedModel,
  selectedYear
}) => {
  const { data: models = [] } = useQuery({
    queryKey: ['models-for-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('motorcycle_models')
        .select('id, name, brands(name)')
        .eq('is_draft', false)
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: years = [] } = useQuery({
    queryKey: ['years-for-model', selectedModel],
    queryFn: async () => {
      if (!selectedModel) return [];
      
      const { data, error } = await supabase
        .from('model_years')
        .select('id, year')
        .eq('motorcycle_id', selectedModel)
        .order('year', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedModel
  });

  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1">
        <Select
          value={selectedModel || ''}
          onValueChange={(value) => {
            onModelSelect(value);
            onYearSelect(''); // Reset year when model changes
          }}
        >
          <SelectTrigger className="bg-explorer-card border-explorer-chrome/30">
            <SelectValue placeholder="Select a motorcycle model..." />
          </SelectTrigger>
          <SelectContent className="bg-explorer-card border-explorer-chrome/30">
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.brands?.name} {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-48">
        <Select
          value={selectedYear || ''}
          onValueChange={onYearSelect}
          disabled={!selectedModel}
        >
          <SelectTrigger className="bg-explorer-card border-explorer-chrome/30">
            <SelectValue placeholder="Select year..." />
          </SelectTrigger>
          <SelectContent className="bg-explorer-card border-explorer-chrome/30">
            {years.map((year) => (
              <SelectItem key={year.id} value={year.id}>
                {year.year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

interface ConfigurationCardProps {
  config: any;
  onEdit: (configId: string) => void;
  onManageComponents: (configId: string) => void;
}

const ConfigurationCard: React.FC<ConfigurationCardProps> = ({
  config,
  onEdit,
  onManageComponents
}) => {
  const componentCount = [
    config.engine_id,
    config.brake_system_id,
    config.frame_id,
    config.suspension_id,
    config.wheel_id
  ].filter(Boolean).length;

  const completeness = Math.round((componentCount / 5) * 100);

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="font-medium text-explorer-text mb-1">
              {config.name || 'Standard Configuration'}
            </div>
            {config.description && (
              <div className="text-sm text-explorer-text-muted mb-2">
                {config.description}
              </div>
            )}
            <div className="flex items-center gap-2">
              {config.is_default && (
                <Badge className="bg-accent-teal/20 text-accent-teal">
                  Default
                </Badge>
              )}
              {config.trim_level && (
                <Badge variant="outline" className="border-explorer-chrome/30">
                  {config.trim_level}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium text-explorer-text mb-1">
              {componentCount}/5 Components
            </div>
            <div className="w-16 h-2 bg-explorer-chrome/30 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  completeness >= 80 ? 'bg-green-400' :
                  completeness >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => onEdit(config.id)}
            variant="outline"
            size="sm"
            className="flex-1 border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
          >
            <Settings className="h-3 w-3 mr-2" />
            Edit Details
          </Button>
          <Button
            onClick={() => onManageComponents(config.id)}
            variant="outline"
            size="sm"
            className="flex-1 border-accent-teal/30 text-accent-teal hover:bg-accent-teal/20"
          >
            <Wrench className="h-3 w-3 mr-2" />
            Components
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ConfigurationManagerPage = () => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: configurations = [], isLoading } = useQuery({
    queryKey: ['configurations-for-year', selectedYear],
    queryFn: async () => {
      if (!selectedYear) return [];
      
      const { data, error } = await supabase
        .from('model_configurations')
        .select(`
          *,
          engines:engine_id(name),
          brake_systems:brake_system_id(type),
          frames:frame_id(type),
          suspensions:suspension_id(brand),
          wheels:wheel_id(type)
        `)
        .eq('model_year_id', selectedYear)
        .order('created_at');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedYear
  });

  const filteredConfigurations = configurations.filter(config =>
    (config.name || 'Standard').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (config.trim_level || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateConfiguration = () => {
    console.log('Create new configuration for year:', selectedYear);
    // TODO: Open create configuration dialog
  };

  const handleEditConfiguration = (configId: string) => {
    console.log('Edit configuration:', configId);
    // TODO: Open edit configuration dialog
  };

  const handleManageComponents = (configId: string) => {
    console.log('Manage components for configuration:', configId);
    // TODO: Open component management interface
  };

  return (
    <div className="flex-1 p-6 bg-explorer-dark">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-explorer-text mb-2">
          Configuration Manager
        </h1>
        <p className="text-explorer-text-muted">
          Manage trim configurations and component overrides
        </p>
      </div>

      <ModelYearSelector
        onModelSelect={setSelectedModel}
        onYearSelect={setSelectedYear}
        selectedModel={selectedModel}
        selectedYear={selectedYear}
      />

      {selectedYear && (
        <>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
              <Input
                placeholder="Search configurations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-explorer-card border-explorer-chrome/30"
              />
            </div>
            <Button
              onClick={handleCreateConfiguration}
              className="bg-accent-teal hover:bg-accent-teal/80"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Configuration
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-explorer-text-muted">Loading configurations...</div>
            </div>
          ) : filteredConfigurations.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
              <div className="text-explorer-text-muted mb-4">
                {searchTerm ? 'No configurations found matching your search' : 'No configurations created yet'}
              </div>
              {!searchTerm && (
                <Button
                  onClick={handleCreateConfiguration}
                  className="bg-accent-teal hover:bg-accent-teal/80"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Configuration
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredConfigurations.map((config) => (
                <ConfigurationCard
                  key={config.id}
                  config={config}
                  onEdit={handleEditConfiguration}
                  onManageComponents={handleManageComponents}
                />
              ))}
            </div>
          )}
        </>
      )}

      {!selectedModel && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-explorer-text-muted mx-auto mb-4" />
          <div className="text-explorer-text-muted">
            Select a motorcycle model and year to manage configurations
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationManagerPage;
