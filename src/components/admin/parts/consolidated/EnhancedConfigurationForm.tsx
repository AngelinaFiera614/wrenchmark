
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  X, 
  Info, 
  Settings, 
  DollarSign, 
  Ruler,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EnhancedConfigurationFormProps {
  open: boolean;
  onClose: () => void;
  selectedYearData?: any;
  configurationToEdit?: any;
  onSuccess: () => void;
}

const EnhancedConfigurationForm: React.FC<EnhancedConfigurationFormProps> = ({
  open,
  onClose,
  selectedYearData,
  configurationToEdit,
  onSuccess
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    trim_level: "",
    market_region: "US",
    seat_height_mm: "",
    weight_kg: "",
    wheelbase_mm: "",
    fuel_capacity_l: "",
    ground_clearance_mm: "",
    msrp_usd: "",
    price_premium_usd: "",
    special_features: [] as string[],
    optional_equipment: [] as string[],
    notes: "",
    is_default: false
  });

  // Initialize form data when editing
  useEffect(() => {
    if (configurationToEdit) {
      setFormData({
        name: configurationToEdit.name || "",
        description: configurationToEdit.description || "",
        trim_level: configurationToEdit.trim_level || "",
        market_region: configurationToEdit.market_region || "US",
        seat_height_mm: configurationToEdit.seat_height_mm?.toString() || "",
        weight_kg: configurationToEdit.weight_kg?.toString() || "",
        wheelbase_mm: configurationToEdit.wheelbase_mm?.toString() || "",
        fuel_capacity_l: configurationToEdit.fuel_capacity_l?.toString() || "",
        ground_clearance_mm: configurationToEdit.ground_clearance_mm?.toString() || "",
        msrp_usd: configurationToEdit.msrp_usd?.toString() || "",
        price_premium_usd: configurationToEdit.price_premium_usd?.toString() || "",
        special_features: configurationToEdit.special_features || [],
        optional_equipment: configurationToEdit.optional_equipment || [],
        notes: configurationToEdit.notes || "",
        is_default: configurationToEdit.is_default || false
      });
    } else {
      // Reset form for new configuration
      setFormData({
        name: "Standard",
        description: "",
        trim_level: "",
        market_region: "US",
        seat_height_mm: "",
        weight_kg: "",
        wheelbase_mm: "",
        fuel_capacity_l: "",
        ground_clearance_mm: "",
        msrp_usd: "",
        price_premium_usd: "",
        special_features: [],
        optional_equipment: [],
        notes: "",
        is_default: false
      });
    }
    setErrors({});
  }, [configurationToEdit, open]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleArrayChange = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    handleInputChange(field, arrayValue);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Configuration name is required";
    }
    
    if (!selectedYearData && !configurationToEdit) {
      newErrors.general = "No model year selected";
    }

    // Validate numeric fields
    const numericFields = ['seat_height_mm', 'weight_kg', 'wheelbase_mm', 'fuel_capacity_l', 'ground_clearance_mm', 'msrp_usd', 'price_premium_usd'];
    numericFields.forEach(field => {
      const value = formData[field as keyof typeof formData] as string;
      if (value && isNaN(Number(value))) {
        newErrors[field] = "Must be a valid number";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors before saving."
      });
      return;
    }

    setSaving(true);
    
    try {
      const dataToSave = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        trim_level: formData.trim_level.trim() || null,
        market_region: formData.market_region,
        seat_height_mm: formData.seat_height_mm ? parseInt(formData.seat_height_mm) : null,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        wheelbase_mm: formData.wheelbase_mm ? parseInt(formData.wheelbase_mm) : null,
        fuel_capacity_l: formData.fuel_capacity_l ? parseFloat(formData.fuel_capacity_l) : null,
        ground_clearance_mm: formData.ground_clearance_mm ? parseInt(formData.ground_clearance_mm) : null,
        msrp_usd: formData.msrp_usd ? parseFloat(formData.msrp_usd) : null,
        price_premium_usd: formData.price_premium_usd ? parseFloat(formData.price_premium_usd) : null,
        special_features: formData.special_features.length > 0 ? formData.special_features : null,
        optional_equipment: formData.optional_equipment.length > 0 ? formData.optional_equipment : null,
        notes: formData.notes.trim() || null,
        is_default: formData.is_default
      };

      if (configurationToEdit) {
        // Update existing configuration
        const { error } = await supabase
          .from('model_configurations')
          .update(dataToSave)
          .eq('id', configurationToEdit.id);

        if (error) throw error;
        
        toast({
          title: "Configuration Updated",
          description: `${formData.name} has been updated successfully.`
        });
      } else {
        // Create new configuration
        const { error } = await supabase
          .from('model_configurations')
          .insert({
            model_year_id: selectedYearData.id,
            ...dataToSave
          });

        if (error) throw error;
        
        toast({
          title: "Configuration Created",
          description: `${formData.name} has been created successfully.`
        });
      }

      onSuccess();
      onClose();
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

  const getCompletionBadge = () => {
    const fieldsCompleted = [
      formData.name,
      formData.seat_height_mm,
      formData.weight_kg,
      formData.msrp_usd
    ].filter(Boolean).length;
    
    const totalFields = 4;
    const percentage = Math.round((fieldsCompleted / totalFields) * 100);
    
    return (
      <Badge variant={percentage >= 75 ? "default" : "secondary"} className="ml-2">
        {percentage}% Complete
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-explorer-card border-explorer-chrome/30">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-explorer-text flex items-center">
                {configurationToEdit ? 'Edit Configuration' : 'Create New Configuration'}
                {getCompletionBadge()}
              </DialogTitle>
              <p className="text-sm text-explorer-text-muted mt-1">
                {configurationToEdit 
                  ? `Editing: ${configurationToEdit.name}`
                  : selectedYearData 
                    ? `Creating for ${selectedYearData.year} ${selectedYearData.motorcycle?.name}`
                    : "No model year selected"
                }
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={onClose}
                variant="outline"
                className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !!errors.general}
                className="bg-accent-teal text-black hover:bg-accent-teal/80"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : configurationToEdit ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {errors.general && (
          <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-red-400 text-sm">{errors.general}</span>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
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

          <div className="mt-6 overflow-y-auto max-h-[60vh]">
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-explorer-text">Configuration Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`bg-explorer-dark border-explorer-chrome/30 text-explorer-text ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="e.g., Standard, Sport, Touring"
                  />
                  {errors.name && <span className="text-red-400 text-xs">{errors.name}</span>}
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
            </TabsContent>

            <TabsContent value="dimensions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="seat_height_mm" className="text-explorer-text">Seat Height (mm)</Label>
                  <Input
                    id="seat_height_mm"
                    type="number"
                    value={formData.seat_height_mm}
                    onChange={(e) => handleInputChange('seat_height_mm', e.target.value)}
                    className={`bg-explorer-dark border-explorer-chrome/30 text-explorer-text ${errors.seat_height_mm ? 'border-red-500' : ''}`}
                  />
                  {errors.seat_height_mm && <span className="text-red-400 text-xs">{errors.seat_height_mm}</span>}
                </div>

                <div>
                  <Label htmlFor="weight_kg" className="text-explorer-text">Weight (kg)</Label>
                  <Input
                    id="weight_kg"
                    type="number"
                    step="0.1"
                    value={formData.weight_kg}
                    onChange={(e) => handleInputChange('weight_kg', e.target.value)}
                    className={`bg-explorer-dark border-explorer-chrome/30 text-explorer-text ${errors.weight_kg ? 'border-red-500' : ''}`}
                  />
                  {errors.weight_kg && <span className="text-red-400 text-xs">{errors.weight_kg}</span>}
                </div>

                <div>
                  <Label htmlFor="wheelbase_mm" className="text-explorer-text">Wheelbase (mm)</Label>
                  <Input
                    id="wheelbase_mm"
                    type="number"
                    value={formData.wheelbase_mm}
                    onChange={(e) => handleInputChange('wheelbase_mm', e.target.value)}
                    className={`bg-explorer-dark border-explorer-chrome/30 text-explorer-text ${errors.wheelbase_mm ? 'border-red-500' : ''}`}
                  />
                  {errors.wheelbase_mm && <span className="text-red-400 text-xs">{errors.wheelbase_mm}</span>}
                </div>

                <div>
                  <Label htmlFor="fuel_capacity_l" className="text-explorer-text">Fuel Capacity (L)</Label>
                  <Input
                    id="fuel_capacity_l"
                    type="number"
                    step="0.1"
                    value={formData.fuel_capacity_l}
                    onChange={(e) => handleInputChange('fuel_capacity_l', e.target.value)}
                    className={`bg-explorer-dark border-explorer-chrome/30 text-explorer-text ${errors.fuel_capacity_l ? 'border-red-500' : ''}`}
                  />
                  {errors.fuel_capacity_l && <span className="text-red-400 text-xs">{errors.fuel_capacity_l}</span>}
                </div>

                <div>
                  <Label htmlFor="ground_clearance_mm" className="text-explorer-text">Ground Clearance (mm)</Label>
                  <Input
                    id="ground_clearance_mm"
                    type="number"
                    value={formData.ground_clearance_mm}
                    onChange={(e) => handleInputChange('ground_clearance_mm', e.target.value)}
                    className={`bg-explorer-dark border-explorer-chrome/30 text-explorer-text ${errors.ground_clearance_mm ? 'border-red-500' : ''}`}
                  />
                  {errors.ground_clearance_mm && <span className="text-red-400 text-xs">{errors.ground_clearance_mm}</span>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="msrp_usd" className="text-explorer-text">MSRP (USD)</Label>
                  <Input
                    id="msrp_usd"
                    type="number"
                    step="0.01"
                    value={formData.msrp_usd}
                    onChange={(e) => handleInputChange('msrp_usd', e.target.value)}
                    className={`bg-explorer-dark border-explorer-chrome/30 text-explorer-text ${errors.msrp_usd ? 'border-red-500' : ''}`}
                    placeholder="Base price"
                  />
                  {errors.msrp_usd && <span className="text-red-400 text-xs">{errors.msrp_usd}</span>}
                </div>

                <div>
                  <Label htmlFor="price_premium_usd" className="text-explorer-text">Price Premium (USD)</Label>
                  <Input
                    id="price_premium_usd"
                    type="number"
                    step="0.01"
                    value={formData.price_premium_usd}
                    onChange={(e) => handleInputChange('price_premium_usd', e.target.value)}
                    className={`bg-explorer-dark border-explorer-chrome/30 text-explorer-text ${errors.price_premium_usd ? 'border-red-500' : ''}`}
                    placeholder="Additional cost over base model"
                  />
                  {errors.price_premium_usd && <span className="text-red-400 text-xs">{errors.price_premium_usd}</span>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="special_features" className="text-explorer-text">Special Features</Label>
                  <Input
                    id="special_features"
                    value={formData.special_features.join(', ')}
                    onChange={(e) => handleArrayChange('special_features', e.target.value)}
                    className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                    placeholder="e.g., Traction Control, Quickshifter (comma-separated)"
                  />
                </div>

                <div>
                  <Label htmlFor="optional_equipment" className="text-explorer-text">Optional Equipment</Label>
                  <Input
                    id="optional_equipment"
                    value={formData.optional_equipment.join(', ')}
                    onChange={(e) => handleArrayChange('optional_equipment', e.target.value)}
                    className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                    placeholder="e.g., Heated Grips, Cruise Control (comma-separated)"
                  />
                </div>
              </div>

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
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedConfigurationForm;
