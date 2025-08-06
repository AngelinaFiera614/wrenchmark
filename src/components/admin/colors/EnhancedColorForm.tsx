import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ColorFormState } from "@/types/colors";

interface EnhancedColorFormProps {
  formData: ColorFormState;
  setFormData: (data: ColorFormState) => void;
}

const COLOR_FAMILIES = [
  "Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink",
  "Black", "White", "Gray", "Silver", "Gold", "Brown", "Beige"
];

const FINISH_TYPES = [
  { value: "solid", label: "Solid" },
  { value: "metallic", label: "Metallic" },
  { value: "pearl", label: "Pearl" },
  { value: "matte", label: "Matte" },
  { value: "satin", label: "Satin" },
  { value: "gloss", label: "Gloss" }
];

const AVAILABILITY_STATUS = [
  { value: "available", label: "Available" },
  { value: "discontinued", label: "Discontinued" },
  { value: "limited", label: "Limited Edition" },
  { value: "special_order", label: "Special Order" }
];

export default function EnhancedColorForm({ formData, setFormData }: EnhancedColorFormProps) {
  const updateFormData = (field: keyof ColorFormState, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Color Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              placeholder="e.g., Racing Red"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hex_code">Hex Code</Label>
            <div className="flex gap-2">
              <Input
                id="hex_code"
                value={formData.hex_code || ''}
                onChange={(e) => updateFormData('hex_code', e.target.value)}
                placeholder="#FF0000"
                maxLength={7}
              />
              {formData.hex_code && (
                <div 
                  className="w-10 h-10 rounded border border-border"
                  style={{ backgroundColor: formData.hex_code }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color_description">Description</Label>
          <Textarea
            id="color_description"
            value={formData.color_description || ''}
            onChange={(e) => updateFormData('color_description', e.target.value)}
            placeholder="Detailed description of the color..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            value={formData.image_url || ''}
            onChange={(e) => updateFormData('image_url', e.target.value)}
            placeholder="https://example.com/color-image.jpg"
          />
        </div>
      </div>

      {/* Color Classification */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Classification</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="color_family">Color Family</Label>
            <Select 
              value={formData.color_family || ''} 
              onValueChange={(value) => updateFormData('color_family', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select color family" />
              </SelectTrigger>
              <SelectContent>
                {COLOR_FAMILIES.map((family) => (
                  <SelectItem key={family} value={family.toLowerCase()}>
                    {family}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="finish_type">Finish Type</Label>
            <Select 
              value={formData.finish_type || 'solid'} 
              onValueChange={(value) => updateFormData('finish_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select finish type" />
              </SelectTrigger>
              <SelectContent>
                {FINISH_TYPES.map((finish) => (
                  <SelectItem key={finish.value} value={finish.value}>
                    {finish.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Availability & Pricing */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Availability & Pricing</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="availability_status">Availability Status</Label>
            <Select 
              value={formData.availability_status || 'available'} 
              onValueChange={(value) => updateFormData('availability_status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABILITY_STATUS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="msrp_premium">MSRP Premium (USD)</Label>
            <Input
              id="msrp_premium"
              type="number"
              value={formData.msrp_premium_usd || 0}
              onChange={(e) => updateFormData('msrp_premium_usd', parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="special_edition_name">Special Edition Name</Label>
          <Input
            id="special_edition_name"
            value={formData.special_edition_name || ''}
            onChange={(e) => updateFormData('special_edition_name', e.target.value)}
            placeholder="e.g., Anniversary Edition"
          />
        </div>
      </div>

      {/* Market Data */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Market Data</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="popularity_score">Popularity Score (0-100)</Label>
            <Input
              id="popularity_score"
              type="number"
              value={formData.popularity_score || 0}
              onChange={(e) => updateFormData('popularity_score', parseInt(e.target.value) || 0)}
              placeholder="0"
              min="0"
              max="100"
            />
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="is_limited"
              checked={formData.is_limited}
              onCheckedChange={(checked) => updateFormData('is_limited', checked)}
            />
            <Label htmlFor="is_limited">Limited Edition</Label>
          </div>
        </div>
      </div>
    </div>
  );
}