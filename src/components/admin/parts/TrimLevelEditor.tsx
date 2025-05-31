
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Configuration } from "@/types/motorcycle";
import ComponentSelector from "@/components/admin/models/ComponentSelector";
import MetricsDisplay from "@/components/admin/models/MetricsDisplay";
import { useConfigurationMetrics } from "@/hooks/useConfigurationMetrics";
import { createConfiguration, updateConfiguration } from "@/services/models/configurationService";

interface TrimLevelEditorProps {
  modelYearId: string;
  configuration?: Configuration;
  onSave: (config: Configuration) => void;
  onCancel: () => void;
}

const TrimLevelEditor = ({ 
  modelYearId, 
  configuration, 
  onSave, 
  onCancel 
}: TrimLevelEditorProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: configuration?.name || "",
    engine_id: configuration?.engine_id || "",
    brake_system_id: configuration?.brake_system_id || "",
    frame_id: configuration?.frame_id || "",
    suspension_id: configuration?.suspension_id || "",
    wheel_id: configuration?.wheel_id || "",
    seat_height_mm: configuration?.seat_height_mm || "",
    weight_kg: configuration?.weight_kg || "",
    wheelbase_mm: configuration?.wheelbase_mm || "",
    fuel_capacity_l: configuration?.fuel_capacity_l || "",
    ground_clearance_mm: configuration?.ground_clearance_mm || "",
    is_default: configuration?.is_default || false,
    market_region: configuration?.market_region || "",
    price_premium_usd: configuration?.price_premium_usd || "",
  });

  const [selectedComponents, setSelectedComponents] = useState({
    engine: configuration?.engine || null,
    brakes: configuration?.brakes || null,
    frame: configuration?.frame || null,
    suspension: configuration?.suspension || null,
    wheels: configuration?.wheels || null,
  });

  // Create a mock configuration for metrics calculation
  const mockConfig: Configuration = {
    id: configuration?.id || 'temp',
    model_year_id: modelYearId,
    name: formData.name,
    engine_id: formData.engine_id,
    brake_system_id: formData.brake_system_id,
    frame_id: formData.frame_id,
    suspension_id: formData.suspension_id,
    wheel_id: formData.wheel_id,
    seat_height_mm: Number(formData.seat_height_mm) || undefined,
    weight_kg: Number(formData.weight_kg) || undefined,
    wheelbase_mm: Number(formData.wheelbase_mm) || undefined,
    fuel_capacity_l: Number(formData.fuel_capacity_l) || undefined,
    ground_clearance_mm: Number(formData.ground_clearance_mm) || undefined,
    is_default: formData.is_default,
    market_region: formData.market_region,
    price_premium_usd: Number(formData.price_premium_usd) || undefined,
    engine: selectedComponents.engine,
    brakes: selectedComponents.brakes,
    frame: selectedComponents.frame,
    suspension: selectedComponents.suspension,
    wheels: selectedComponents.wheels,
  };

  const metrics = useConfigurationMetrics(mockConfig);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleComponentSelect = (componentType: string, componentId: string, component: any) => {
    handleInputChange(`${componentType}_id`, componentId);
    setSelectedComponents(prev => ({ ...prev, [componentType]: component }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Trim level name is required.",
      });
      return;
    }

    setSaving(true);
    try {
      const configData = {
        model_year_id: modelYearId,
        name: formData.name,
        engine_id: formData.engine_id || null,
        brake_system_id: formData.brake_system_id || null,
        frame_id: formData.frame_id || null,
        suspension_id: formData.suspension_id || null,
        wheel_id: formData.wheel_id || null,
        seat_height_mm: formData.seat_height_mm ? Number(formData.seat_height_mm) : null,
        weight_kg: formData.weight_kg ? Number(formData.weight_kg) : null,
        wheelbase_mm: formData.wheelbase_mm ? Number(formData.wheelbase_mm) : null,
        fuel_capacity_l: formData.fuel_capacity_l ? Number(formData.fuel_capacity_l) : null,
        ground_clearance_mm: formData.ground_clearance_mm ? Number(formData.ground_clearance_mm) : null,
        is_default: formData.is_default,
        market_region: formData.market_region || null,
        price_premium_usd: formData.price_premium_usd ? Number(formData.price_premium_usd) : null,
      };

      let savedConfig;
      if (configuration?.id) {
        savedConfig = await updateConfiguration(configuration.id, configData);
      } else {
        savedConfig = await createConfiguration(configData);
      }

      if (savedConfig) {
        toast({
          title: "Trim level saved",
          description: `${formData.name} has been ${configuration ? 'updated' : 'created'} successfully.`,
        });
        onSave(savedConfig);
      } else {
        throw new Error("Failed to save trim level");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save trim level. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-explorer-text">
          {configuration ? 'Edit Trim Level' : 'New Trim Level'}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-accent-teal text-black hover:bg-accent-teal/80"
          >
            {saving ? "Saving..." : configuration ? "Update" : "Create"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Trim Level Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Trim Level Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Fireball, Stellar, Sport, Touring"
                    className="bg-explorer-dark border-explorer-chrome/30"
                  />
                  <p className="text-xs text-explorer-text-muted">
                    Examples: Fireball, Stellar, Supernova, Sport, Touring, Base
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="market_region">Market Region</Label>
                  <Input
                    id="market_region"
                    value={formData.market_region}
                    onChange={(e) => handleInputChange('market_region', e.target.value)}
                    placeholder="e.g., North America, Europe, Global"
                    className="bg-explorer-dark border-explorer-chrome/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_premium_usd">Price Premium (USD)</Label>
                  <Input
                    id="price_premium_usd"
                    type="number"
                    step="0.01"
                    value={formData.price_premium_usd}
                    onChange={(e) => handleInputChange('price_premium_usd', e.target.value)}
                    placeholder="0.00"
                    className="bg-explorer-dark border-explorer-chrome/30"
                  />
                  <p className="text-xs text-explorer-text-muted">
                    Additional cost over base model (leave empty for base model)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_default"
                  checked={formData.is_default}
                  onCheckedChange={(checked) => handleInputChange('is_default', checked)}
                />
                <Label htmlFor="is_default">Base Model (Default Trim)</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSelector
              componentType="engine"
              selectedId={formData.engine_id}
              onSelect={(id, component) => handleComponentSelect('engine', id, component)}
            />
            
            <ComponentSelector
              componentType="brakes"
              selectedId={formData.brake_system_id}
              onSelect={(id, component) => handleComponentSelect('brake_system', id, component)}
            />
            
            <ComponentSelector
              componentType="frame"
              selectedId={formData.frame_id}
              onSelect={(id, component) => handleComponentSelect('frame', id, component)}
            />
            
            <ComponentSelector
              componentType="suspension"
              selectedId={formData.suspension_id}
              onSelect={(id, component) => handleComponentSelect('suspension', id, component)}
            />
            
            <ComponentSelector
              componentType="wheels"
              selectedId={formData.wheel_id}
              onSelect={(id, component) => handleComponentSelect('wheel', id, component)}
            />
          </div>
        </TabsContent>

        <TabsContent value="dimensions" className="space-y-4">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Physical Dimensions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight_kg">Weight (kg)</Label>
                  <Input
                    id="weight_kg"
                    type="number"
                    step="0.1"
                    value={formData.weight_kg}
                    onChange={(e) => handleInputChange('weight_kg', e.target.value)}
                    className="bg-explorer-dark border-explorer-chrome/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seat_height_mm">Seat Height (mm)</Label>
                  <Input
                    id="seat_height_mm"
                    type="number"
                    value={formData.seat_height_mm}
                    onChange={(e) => handleInputChange('seat_height_mm', e.target.value)}
                    className="bg-explorer-dark border-explorer-chrome/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wheelbase_mm">Wheelbase (mm)</Label>
                  <Input
                    id="wheelbase_mm"
                    type="number"
                    value={formData.wheelbase_mm}
                    onChange={(e) => handleInputChange('wheelbase_mm', e.target.value)}
                    className="bg-explorer-dark border-explorer-chrome/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ground_clearance_mm">Ground Clearance (mm)</Label>
                  <Input
                    id="ground_clearance_mm"
                    type="number"
                    value={formData.ground_clearance_mm}
                    onChange={(e) => handleInputChange('ground_clearance_mm', e.target.value)}
                    className="bg-explorer-dark border-explorer-chrome/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuel_capacity_l">Fuel Capacity (L)</Label>
                  <Input
                    id="fuel_capacity_l"
                    type="number"
                    step="0.1"
                    value={formData.fuel_capacity_l}
                    onChange={(e) => handleInputChange('fuel_capacity_l', e.target.value)}
                    className="bg-explorer-dark border-explorer-chrome/30"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <MetricsDisplay metrics={metrics} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrimLevelEditor;
