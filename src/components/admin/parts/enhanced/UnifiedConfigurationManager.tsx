
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Save, 
  X, 
  Palette, 
  DollarSign, 
  Ruler, 
  Settings,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UnifiedConfigurationManagerProps {
  configuration: any;
  modelYearIds: string[];
  onSave: (configData: any) => void;
  onCancel: () => void;
}

const UnifiedConfigurationManager = ({
  configuration,
  modelYearIds,
  onSave,
  onCancel
}: UnifiedConfigurationManagerProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: configuration?.name || "Standard",
    description: configuration?.description || "",
    trim_level: configuration?.trim_level || "",
    market_region: configuration?.market_region || "US",
    seat_height_mm: configuration?.seat_height_mm || "",
    weight_kg: configuration?.weight_kg || "",
    wheelbase_mm: configuration?.wheelbase_mm || "",
    fuel_capacity_l: configuration?.fuel_capacity_l || "",
    ground_clearance_mm: configuration?.ground_clearance_mm || "",
    msrp_usd: configuration?.msrp_usd || "",
    price_premium_usd: configuration?.price_premium_usd || "",
    special_features: configuration?.special_features || [],
    optional_equipment: configuration?.optional_equipment || [],
    notes: configuration?.notes || "",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      if (configuration?.id) {
        // Update existing configuration
        const { error } = await supabase
          .from('model_configurations')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', configuration.id);

        if (error) throw error;
        
        toast({
          title: "Configuration Updated",
          description: "Trim configuration has been updated successfully."
        });
      } else {
        // Create new configurations for selected years
        const configurationsToCreate = modelYearIds.map(yearId => ({
          model_year_id: yearId,
          ...formData,
          is_default: false
        }));

        const { error } = await supabase
          .from('model_configurations')
          .insert(configurationsToCreate);

        if (error) throw error;
        
        toast({
          title: "Configurations Created",
          description: `Created ${modelYearIds.length} trim configuration(s) successfully.`
        });
      }

      onSave(formData);
    } catch (error: any) {
      console.error('Error saving configuration:', error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: `Failed to save configuration: ${error.message}`
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-explorer-text">
                {configuration?.id ? 'Edit Configuration' : 'Create New Configuration'}
              </CardTitle>
              <p className="text-sm text-explorer-text-muted mt-1">
                {configuration?.id 
                  ? `Editing: ${configuration.name || 'Standard'}`
                  : `Creating for ${modelYearIds.length} year${modelYearIds.length > 1 ? 's' : ''}`
                }
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={onCancel}
                variant="outline"
                className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-accent-teal text-black hover:bg-accent-teal/80"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Configuration"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Configuration Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="dimensions" className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Dimensions
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Pricing
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Features
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-explorer-text">Configuration Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                    placeholder="e.g., Standard, Sport, Touring"
                  />
                </div>
                
                <div>
                  <Label htmlFor="trim_level" className="text-explorer-text">Trim Level</Label>
                  <Input
                    id="trim_level"
                    value={formData.trim_level}
                    onChange={(e) => handleInputChange('trim_level', e.target.value)}
                    className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                    placeholder="e.g., Base, Premium, Limited"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-explorer-text">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                  placeholder="Describe this configuration..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="market_region" className="text-explorer-text">Market Region</Label>
                <Input
                  id="market_region"
                  value={formData.market_region}
                  onChange={(e) => handleInputChange('market_region', e.target.value)}
                  className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                  placeholder="e.g., US, EU, Global"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dimensions" className="space-y-4">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Physical Dimensions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="seat_height_mm" className="text-explorer-text">Seat Height (mm)</Label>
                  <Input
                    id="seat_height_mm"
                    type="number"
                    value={formData.seat_height_mm}
                    onChange={(e) => handleInputChange('seat_height_mm', e.target.value)}
                    className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                  />
                </div>

                <div>
                  <Label htmlFor="weight_kg" className="text-explorer-text">Weight (kg)</Label>
                  <Input
                    id="weight_kg"
                    type="number"
                    step="0.1"
                    value={formData.weight_kg}
                    onChange={(e) => handleInputChange('weight_kg', e.target.value)}
                    className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                  />
                </div>

                <div>
                  <Label htmlFor="wheelbase_mm" className="text-explorer-text">Wheelbase (mm)</Label>
                  <Input
                    id="wheelbase_mm"
                    type="number"
                    value={formData.wheelbase_mm}
                    onChange={(e) => handleInputChange('wheelbase_mm', e.target.value)}
                    className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                  />
                </div>

                <div>
                  <Label htmlFor="fuel_capacity_l" className="text-explorer-text">Fuel Capacity (L)</Label>
                  <Input
                    id="fuel_capacity_l"
                    type="number"
                    step="0.1"
                    value={formData.fuel_capacity_l}
                    onChange={(e) => handleInputChange('fuel_capacity_l', e.target.value)}
                    className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                  />
                </div>

                <div>
                  <Label htmlFor="ground_clearance_mm" className="text-explorer-text">Ground Clearance (mm)</Label>
                  <Input
                    id="ground_clearance_mm"
                    type="number"
                    value={formData.ground_clearance_mm}
                    onChange={(e) => handleInputChange('ground_clearance_mm', e.target.value)}
                    className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Pricing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="msrp_usd" className="text-explorer-text">MSRP (USD)</Label>
                  <Input
                    id="msrp_usd"
                    type="number"
                    step="0.01"
                    value={formData.msrp_usd}
                    onChange={(e) => handleInputChange('msrp_usd', e.target.value)}
                    className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                    placeholder="Base price"
                  />
                </div>

                <div>
                  <Label htmlFor="price_premium_usd" className="text-explorer-text">Price Premium (USD)</Label>
                  <Input
                    id="price_premium_usd"
                    type="number"
                    step="0.01"
                    value={formData.price_premium_usd}
                    onChange={(e) => handleInputChange('price_premium_usd', e.target.value)}
                    className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                    placeholder="Additional cost over base model"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card className="bg-explorer-card border-explorer-chrome/30">
            <CardHeader>
              <CardTitle className="text-explorer-text">Features & Equipment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes" className="text-explorer-text">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                  placeholder="Additional notes about this configuration..."
                  rows={4}
                />
              </div>

              <div className="text-sm text-explorer-text-muted">
                <p className="mb-2">Note: Component assignment is handled through the Component Library.</p>
                <p>Use the Component Library to assign engines, brakes, frames, suspension, and wheels to this configuration.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedConfigurationManager;
