
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Copy, Trash, AlertCircle, CheckCircle } from "lucide-react";
import { Configuration } from "@/types/motorcycle";
import ConfigurationEditor from "@/components/admin/models/ConfigurationEditor";
import ComponentAssignmentGrid from "./ComponentAssignmentGrid";

interface ConfigurationManagerProps {
  modelYearId: string;
  configurations: Configuration[];
  selectedConfig: string | null;
  onConfigSelect: (configId: string) => void;
  onConfigChange: () => void;
}

const ConfigurationManager = ({
  modelYearId,
  configurations,
  selectedConfig,
  onConfigSelect,
  onConfigChange
}: ConfigurationManagerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingConfig, setEditingConfig] = useState<Configuration | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const selectedConfigData = configurations.find(c => c.id === selectedConfig);

  const handleCreateNew = () => {
    setEditingConfig(null);
    setIsEditing(true);
  };

  const handleEdit = (config: Configuration) => {
    setEditingConfig(config);
    setIsEditing(true);
  };

  const handleClone = (config: Configuration) => {
    // Create a copy of the configuration without ID
    const clonedConfig = {
      ...config,
      name: `${config.name} (Copy)`,
      is_default: false
    } as Configuration;
    setEditingConfig(clonedConfig);
    setIsEditing(true);
  };

  const handleEditorClose = (refreshData = false) => {
    setIsEditing(false);
    setEditingConfig(null);
    if (refreshData) {
      onConfigChange();
    }
  };

  const getComponentCompleteness = (config: Configuration) => {
    const components = [
      config.engine_id,
      config.brake_system_id,
      config.frame_id,
      config.suspension_id,
      config.wheel_id
    ];
    const filledComponents = components.filter(Boolean).length;
    return {
      filled: filledComponents,
      total: components.length,
      percentage: Math.round((filledComponents / components.length) * 100)
    };
  };

  if (isEditing) {
    return (
      <ConfigurationEditor
        modelYearId={modelYearId}
        configuration={editingConfig || undefined}
        onSave={(config) => {
          onConfigChange();
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuration Actions */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-explorer-text">
              Configuration Management
            </CardTitle>
            <Button
              onClick={handleCreateNew}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Configuration
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {configurations.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-explorer-text-muted mb-4">
                No configurations found for this model year
              </div>
              <Button
                onClick={handleCreateNew}
                variant="outline"
                className="bg-explorer-card border-explorer-chrome/30 text-explorer-text"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create First Configuration
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {configurations.map((config) => {
                const completeness = getComponentCompleteness(config);
                return (
                  <Card
                    key={config.id}
                    className={`cursor-pointer transition-colors ${
                      selectedConfig === config.id
                        ? 'border-accent-teal bg-accent-teal/10'
                        : 'border-explorer-chrome/30 hover:border-accent-teal/50'
                    }`}
                    onClick={() => onConfigSelect(config.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-explorer-text">
                              {config.name || "Standard"}
                            </h3>
                            {config.trim_level && (
                              <p className="text-sm text-explorer-text-muted">
                                {config.trim_level}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {config.is_default && (
                              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                                Default
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Component Completeness */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-explorer-text-muted">Components</span>
                            <span className="text-explorer-text">
                              {completeness.filled}/{completeness.total}
                            </span>
                          </div>
                          <div className="w-full bg-explorer-chrome/20 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                completeness.percentage === 100
                                  ? 'bg-green-500'
                                  : completeness.percentage >= 60
                                  ? 'bg-accent-teal'
                                  : 'bg-orange-500'
                              }`}
                              style={{ width: `${completeness.percentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(config);
                            }}
                            className="flex-1 text-xs"
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClone(config);
                            }}
                            className="flex-1 text-xs"
                          >
                            <Copy className="mr-1 h-3 w-3" />
                            Clone
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Configuration Details */}
      {selectedConfigData && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle className="text-explorer-text">
                  {selectedConfigData.name || "Standard"} Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-explorer-text-muted">Trim Level</p>
                    <p className="text-explorer-text">{selectedConfigData.trim_level || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-explorer-text-muted">Market Region</p>
                    <p className="text-explorer-text">{selectedConfigData.market_region || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-explorer-text-muted">Price Premium</p>
                    <p className="text-explorer-text">
                      {selectedConfigData.price_premium_usd
                        ? `$${selectedConfigData.price_premium_usd.toLocaleString()}`
                        : "—"
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-explorer-text-muted">Status</p>
                    <Badge variant={selectedConfigData.is_default ? "default" : "secondary"}>
                      {selectedConfigData.is_default ? "Default" : "Alternative"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="components" className="space-y-4">
            <ComponentAssignmentGrid
              configuration={selectedConfigData}
              onComponentChange={(componentType, componentId) => {
                // Handle component assignment
                onConfigChange();
              }}
            />
          </TabsContent>

          <TabsContent value="specifications" className="space-y-4">
            <Card className="bg-explorer-card border-explorer-chrome/30">
              <CardHeader>
                <CardTitle className="text-explorer-text">Physical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-explorer-text-muted">Weight</p>
                    <p className="text-explorer-text">
                      {selectedConfigData.weight_kg ? `${selectedConfigData.weight_kg} kg` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-explorer-text-muted">Seat Height</p>
                    <p className="text-explorer-text">
                      {selectedConfigData.seat_height_mm ? `${selectedConfigData.seat_height_mm} mm` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-explorer-text-muted">Wheelbase</p>
                    <p className="text-explorer-text">
                      {selectedConfigData.wheelbase_mm ? `${selectedConfigData.wheelbase_mm} mm` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-explorer-text-muted">Ground Clearance</p>
                    <p className="text-explorer-text">
                      {selectedConfigData.ground_clearance_mm ? `${selectedConfigData.ground_clearance_mm} mm` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-explorer-text-muted">Fuel Capacity</p>
                    <p className="text-explorer-text">
                      {selectedConfigData.fuel_capacity_l ? `${selectedConfigData.fuel_capacity_l} L` : "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ConfigurationManager;
