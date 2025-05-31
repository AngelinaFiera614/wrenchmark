
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Copy, Trash, AlertCircle, Car, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Configuration } from "@/types/motorcycle";
import TrimLevelEditor from "./TrimLevelEditor";
import ComponentAssignmentGrid from "./ComponentAssignmentGrid";

interface TrimLevelManagerProps {
  modelYearId: string;
  configurations: Configuration[];
  selectedConfig: string | null;
  onConfigSelect: (configId: string) => void;
  onConfigChange: () => void;
}

const TrimLevelManager = ({
  modelYearId,
  configurations,
  selectedConfig,
  onConfigSelect,
  onConfigChange
}: TrimLevelManagerProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingConfig, setEditingConfig] = useState<Configuration | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const selectedConfigData = configurations.find(c => c.id === selectedConfig);

  const handleCreateNew = () => {
    console.log("Creating new trim level for model year:", modelYearId);
    setEditingConfig(null);
    setIsEditing(true);
  };

  const handleEdit = (config: Configuration) => {
    console.log("Editing trim level:", config);
    setEditingConfig(config);
    setIsEditing(true);
  };

  const handleClone = (config: Configuration) => {
    console.log("Cloning trim level:", config);
    const clonedConfig = {
      ...config,
      name: `${config.name} (Copy)`,
      is_default: false
    } as Configuration;
    setEditingConfig(clonedConfig);
    setIsEditing(true);
  };

  const handleEditorClose = (refreshData = false) => {
    console.log("Closing editor, refreshData:", refreshData);
    setIsEditing(false);
    setEditingConfig(null);
    if (refreshData) {
      onConfigChange();
    }
  };

  const handleSaveSuccess = (savedConfig: Configuration) => {
    console.log("Trim level saved successfully:", savedConfig);
    toast({
      title: "Success!",
      description: `Trim level "${savedConfig.name}" has been saved successfully.`,
    });
    handleEditorClose(true);
    // Auto-select the newly created/updated config
    onConfigSelect(savedConfig.id);
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
      <TrimLevelEditor
        modelYearId={modelYearId}
        configuration={editingConfig || undefined}
        onSave={handleSaveSuccess}
        onCancel={() => handleEditorClose(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Trim Level Actions */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-explorer-text flex items-center gap-2">
              <Car className="h-5 w-5" />
              Trim Level Management
              <Button
                variant="ghost"
                size="sm"
                onClick={onConfigChange}
                className="ml-2 h-6 w-6 p-0"
                title="Refresh trim levels"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </CardTitle>
            <Button
              onClick={handleCreateNew}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Trim Level
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {configurations.length === 0 ? (
            <div className="text-center py-8">
              <Car className="h-16 w-16 text-explorer-text-muted mx-auto mb-4" />
              <div className="text-explorer-text-muted mb-2">
                No trim levels found for this model year
              </div>
              <p className="text-sm text-explorer-text-muted mb-6">
                Create trim levels like "Base", "Sport", "Touring", or model-specific variants like "Fireball", "Stellar", "Supernova"
              </p>
              <Button
                onClick={handleCreateNew}
                variant="outline"
                className="bg-explorer-card border-explorer-chrome/30 text-explorer-text"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create First Trim Level
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {configurations.map((config) => {
                const completeness = getComponentCompleteness(config);
                return (
                  <Card
                    key={config.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedConfig === config.id
                        ? 'border-accent-teal bg-accent-teal/10 shadow-lg'
                        : 'border-explorer-chrome/30 hover:border-accent-teal/50'
                    }`}
                    onClick={() => onConfigSelect(config.id)}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg text-explorer-text">
                              {config.name || "Base"}
                            </h3>
                            {config.price_premium_usd && (
                              <p className="text-green-400 font-medium">
                                +${config.price_premium_usd.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {config.is_default && (
                              <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                                Base Model
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Key Specs Preview */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {config.weight_kg && (
                            <div className="text-explorer-text-muted">
                              <span className="font-medium">{config.weight_kg}kg</span>
                            </div>
                          )}
                          {config.seat_height_mm && (
                            <div className="text-explorer-text-muted">
                              <span className="font-medium">{config.seat_height_mm}mm</span> seat
                            </div>
                          )}
                        </div>

                        {/* Component Completeness */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-explorer-text-muted">Components</span>
                            <span className="text-explorer-text font-medium">
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

      {/* Selected Trim Level Details */}
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
                  {selectedConfigData.name || "Base"} Trim Level
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-explorer-text-muted">Market Region</p>
                    <p className="text-explorer-text">{selectedConfigData.market_region || "Global"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-explorer-text-muted">Price Premium</p>
                    <p className="text-explorer-text">
                      {selectedConfigData.price_premium_usd
                        ? `+$${selectedConfigData.price_premium_usd.toLocaleString()}`
                        : "Base price"
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-explorer-text-muted">Trim Status</p>
                    <Badge variant={selectedConfigData.is_default ? "default" : "secondary"}>
                      {selectedConfigData.is_default ? "Base Model" : "Variant"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-explorer-text-muted">Special Equipment</p>
                    <p className="text-explorer-text">
                      {selectedConfigData.optional_equipment?.length ? 
                        `${selectedConfigData.optional_equipment.length} items` : "Standard"
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="components" className="space-y-4">
            <ComponentAssignmentGrid
              configuration={selectedConfigData}
              onComponentChange={(componentType, componentId) => {
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
                    <p className="text-explorer-text font-medium">
                      {selectedConfigData.weight_kg ? `${selectedConfigData.weight_kg} kg` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-explorer-text-muted">Seat Height</p>
                    <p className="text-explorer-text font-medium">
                      {selectedConfigData.seat_height_mm ? `${selectedConfigData.seat_height_mm} mm` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-explorer-text-muted">Wheelbase</p>
                    <p className="text-explorer-text font-medium">
                      {selectedConfigData.wheelbase_mm ? `${selectedConfigData.wheelbase_mm} mm` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-explorer-text-muted">Ground Clearance</p>
                    <p className="text-explorer-text font-medium">
                      {selectedConfigData.ground_clearance_mm ? `${selectedConfigData.ground_clearance_mm} mm` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-explorer-text-muted">Fuel Capacity</p>
                    <p className="text-explorer-text font-medium">
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

export default TrimLevelManager;
