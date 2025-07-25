import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ModelYear } from "@/types/motorcycle";
import { Info, Calendar } from "lucide-react";

interface BasicInfoSectionProps {
  formData: any;
  modelYears: ModelYear[];
  validation: any;
  onInputChange: (field: string, value: any) => void;
}

const BasicInfoSection = ({
  formData,
  modelYears,
  validation,
  onInputChange
}: BasicInfoSectionProps) => {
  const getFieldError = (field: string) => {
    return validation.errors.find((error: any) => error.field === field)?.message;
  };

  const handleYearSelectionChange = (yearId: string, checked: boolean) => {
    const currentYears = formData.target_years || [];
    if (checked) {
      onInputChange("target_years", [...currentYears, yearId]);
    } else {
      onInputChange("target_years", currentYears.filter((id: string) => id !== yearId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="bg-explorer-dark border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-explorer-text">
            <Info className="h-5 w-5 text-accent-teal" />
            Configuration Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-explorer-text">
                Configuration Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => onInputChange("name", e.target.value)}
                placeholder="e.g., Sport, Touring, Base"
                className="bg-explorer-card border-explorer-chrome/30"
              />
              {getFieldError("name") && (
                <p className="text-destructive text-sm">{getFieldError("name")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="trim_level" className="text-explorer-text">
                Trim Level
              </Label>
              <Select
                value={formData.trim_level}
                onValueChange={(value) => onInputChange("trim_level", value)}
              >
                <SelectTrigger className="bg-explorer-card border-explorer-chrome/30">
                  <SelectValue placeholder="Select trim level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="sport">Sport</SelectItem>
                  <SelectItem value="touring">Touring</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="limited">Limited Edition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-explorer-text">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onInputChange("description", e.target.value)}
              placeholder="Describe this configuration's unique features and characteristics..."
              className="bg-explorer-card border-explorer-chrome/30 min-h-[80px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_default"
              checked={formData.is_default}
              onCheckedChange={(checked) => onInputChange("is_default", checked)}
            />
            <Label htmlFor="is_default" className="text-explorer-text">
              Set as default configuration
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Model Year Selection */}
      <Card className="bg-explorer-dark border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-explorer-text">
            <Calendar className="h-5 w-5 text-accent-teal" />
            Target Model Years
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-explorer-text/70 text-sm">
              Select which model years this configuration applies to:
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {modelYears.map((year) => (
                <div
                  key={year.id}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-explorer-card border border-explorer-chrome/30"
                >
                  <Checkbox
                    id={`year-${year.id}`}
                    checked={formData.target_years?.includes(year.id) || false}
                    onCheckedChange={(checked) => handleYearSelectionChange(year.id, checked as boolean)}
                  />
                  <Label htmlFor={`year-${year.id}`} className="text-explorer-text font-medium">
                    {year.year}
                  </Label>
                </div>
              ))}
            </div>

            {formData.target_years?.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-explorer-text/70 text-sm">Selected:</span>
                {formData.target_years.map((yearId: string) => {
                  const year = modelYears.find(y => y.id === yearId);
                  return year ? (
                    <Badge key={yearId} className="bg-accent-teal text-black">
                      {year.year}
                    </Badge>
                  ) : null;
                })}
              </div>
            )}

            {getFieldError("target_years") && (
              <p className="text-destructive text-sm">{getFieldError("target_years")}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Information */}
      <Card className="bg-explorer-dark border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Pricing Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="msrp_usd" className="text-explorer-text">
                MSRP (USD)
              </Label>
              <Input
                id="msrp_usd"
                type="number"
                value={formData.msrp_usd}
                onChange={(e) => onInputChange("msrp_usd", e.target.value ? Number(e.target.value) : "")}
                placeholder="Base price"
                className="bg-explorer-card border-explorer-chrome/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_premium_usd" className="text-explorer-text">
                Price Premium (USD)
              </Label>
              <Input
                id="price_premium_usd"
                type="number"
                value={formData.price_premium_usd}
                onChange={(e) => onInputChange("price_premium_usd", e.target.value ? Number(e.target.value) : "")}
                placeholder="Additional cost over base"
                className="bg-explorer-card border-explorer-chrome/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="market_region" className="text-explorer-text">
              Market Region
            </Label>
            <Select
              value={formData.market_region}
              onValueChange={(value) => onInputChange("market_region", value)}
            >
              <SelectTrigger className="bg-explorer-card border-explorer-chrome/30">
                <SelectValue placeholder="Select market region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="north_america">North America</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia_pacific">Asia Pacific</SelectItem>
                <SelectItem value="japan_domestic">Japan Domestic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicInfoSection;