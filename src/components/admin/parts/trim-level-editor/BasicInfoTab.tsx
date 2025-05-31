
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface BasicInfoTabProps {
  formData: {
    name: string;
    market_region: string;
    price_premium_usd: string;
    is_default: boolean;
  };
  onInputChange: (field: string, value: any) => void;
}

const BasicInfoTab = ({ formData, onInputChange }: BasicInfoTabProps) => {
  return (
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
              onChange={(e) => onInputChange('name', e.target.value)}
              placeholder="e.g., Fireball, Stellar, Sport, Touring"
              className="bg-explorer-dark border-explorer-chrome/30"
              required
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
              onChange={(e) => onInputChange('market_region', e.target.value)}
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
              min="0"
              value={formData.price_premium_usd}
              onChange={(e) => onInputChange('price_premium_usd', e.target.value)}
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
            onCheckedChange={(checked) => onInputChange('is_default', checked)}
          />
          <Label htmlFor="is_default">Base Model (Default Trim)</Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoTab;
