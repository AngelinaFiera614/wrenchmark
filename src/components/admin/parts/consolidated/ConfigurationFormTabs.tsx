
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Info, 
  Ruler,
  DollarSign,
  Settings
} from "lucide-react";

interface ConfigurationFormTabsProps {
  formData: any;
  errors: Record<string, string>;
  onInputChange: (field: string, value: any) => void;
  onArrayChange: (field: string, value: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ConfigurationFormTabs: React.FC<ConfigurationFormTabsProps> = ({
  formData,
  errors,
  onInputChange,
  onArrayChange,
  activeTab,
  onTabChange
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1">
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
                onChange={(e) => onInputChange('name', e.target.value)}
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
                onChange={(e) => onInputChange('trim_level', e.target.value)}
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
              onChange={(e) => onInputChange('description', e.target.value)}
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
              onChange={(e) => onInputChange('market_region', e.target.value)}
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
                onChange={(e) => onInputChange('seat_height_mm', e.target.value)}
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
                onChange={(e) => onInputChange('weight_kg', e.target.value)}
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
                onChange={(e) => onInputChange('wheelbase_mm', e.target.value)}
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
                onChange={(e) => onInputChange('fuel_capacity_l', e.target.value)}
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
                onChange={(e) => onInputChange('ground_clearance_mm', e.target.value)}
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
                onChange={(e) => onInputChange('msrp_usd', e.target.value)}
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
                onChange={(e) => onInputChange('price_premium_usd', e.target.value)}
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
                onChange={(e) => onArrayChange('special_features', e.target.value)}
                className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
                placeholder="e.g., Traction Control, Quickshifter (comma-separated)"
              />
            </div>

            <div>
              <Label htmlFor="optional_equipment" className="text-explorer-text">Optional Equipment</Label>
              <Input
                id="optional_equipment"
                value={formData.optional_equipment.join(', ')}
                onChange={(e) => onArrayChange('optional_equipment', e.target.value)}
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
              onChange={(e) => onInputChange('notes', e.target.value)}
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
              placeholder="Additional notes about this configuration..."
              rows={4}
            />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ConfigurationFormTabs;
