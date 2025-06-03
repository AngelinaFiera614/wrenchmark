
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info } from "lucide-react";

interface BasicInfoTabProps {
  formData: {
    name: string;
    description: string;
    notes: string;
    is_default: boolean;
    trim_level: string;
    market_region: string;
    msrp_usd: string;
  };
  onInputChange: (field: string, value: any) => void;
  existingDefault?: any;
}

const BasicInfoTab = ({ formData, onInputChange, existingDefault }: BasicInfoTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-explorer-text">
              Trim Level Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onInputChange("name", e.target.value)}
              placeholder="e.g., Standard, Sport, Touring, Limited Edition"
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-explorer-text">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onInputChange("description", e.target.value)}
              placeholder="Brief description of this trim level..."
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trim_level" className="text-explorer-text">
              Trim Level Category
            </Label>
            <Input
              id="trim_level"
              value={formData.trim_level}
              onChange={(e) => onInputChange("trim_level", e.target.value)}
              placeholder="e.g., Base, Sport, Premium, Limited"
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Market & Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="market_region" className="text-explorer-text">
              Market Region
            </Label>
            <Input
              id="market_region"
              value={formData.market_region}
              onChange={(e) => onInputChange("market_region", e.target.value)}
              placeholder="e.g., North America, Europe, Global"
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="msrp_usd" className="text-explorer-text">
              MSRP (USD)
            </Label>
            <Input
              id="msrp_usd"
              type="number"
              min="0"
              value={formData.msrp_usd}
              onChange={(e) => onInputChange("msrp_usd", e.target.value)}
              placeholder="12995"
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
            <p className="text-xs text-explorer-text-muted">
              Manufacturer's Suggested Retail Price for this configuration
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Configuration Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_default"
                checked={formData.is_default}
                onCheckedChange={(checked) => onInputChange("is_default", checked)}
              />
              <Label htmlFor="is_default" className="text-explorer-text">
                Set as Base Model (Default Configuration)
              </Label>
            </div>
            
            {existingDefault && !formData.is_default && (
              <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-md">
                <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm text-blue-400 font-medium">
                    Current Base Model: {existingDefault.name}
                  </p>
                  <p className="text-xs text-blue-300">
                    Only one configuration can be the base model per model year.
                  </p>
                </div>
              </div>
            )}
            
            {formData.is_default && existingDefault && (
              <div className="flex items-start gap-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-md">
                <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm text-orange-400 font-medium">
                    Will Replace Current Base Model
                  </p>
                  <p className="text-xs text-orange-300">
                    "{existingDefault.name}" will no longer be the base model if you save this as default.
                  </p>
                </div>
              </div>
            )}
            
            {!existingDefault && (
              <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-md">
                <Info className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm text-green-400 font-medium">
                    No Base Model Set
                  </p>
                  <p className="text-xs text-green-300">
                    Consider making this the base model if it's the standard configuration.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-explorer-text">
              Internal Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => onInputChange("notes", e.target.value)}
              placeholder="Internal notes for admins..."
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text min-h-[60px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicInfoTab;
