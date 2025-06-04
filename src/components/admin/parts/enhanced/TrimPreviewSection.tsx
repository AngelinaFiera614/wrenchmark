
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

interface TrimPreviewSectionProps {
  formData: any;
  validation: any;
  completeness: any;
  metrics: any;
}

const TrimPreviewSection = ({ formData, validation, completeness, metrics }: TrimPreviewSectionProps) => {
  const getCompletionColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getCompletionIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Configuration Overview */}
      <Card className="bg-explorer-dark border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Configuration Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-explorer-text">{completeness.overall}%</div>
              <div className="text-xs text-explorer-text-muted">Overall</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getCompletionColor(completeness.basicInfo)}`}>
                {completeness.basicInfo}%
              </div>
              <div className="text-xs text-explorer-text-muted">Basic Info</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getCompletionColor(completeness.components)}`}>
                {completeness.components}%
              </div>
              <div className="text-xs text-explorer-text-muted">Components</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getCompletionColor(completeness.dimensions)}`}>
                {completeness.dimensions}%
              </div>
              <div className="text-xs text-explorer-text-muted">Dimensions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Issues */}
      {(validation.errors.length > 0 || validation.warnings.length > 0) && (
        <div className="space-y-3">
          {validation.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">Validation Errors ({validation.errors.length})</div>
                <ul className="list-disc list-inside space-y-1">
                  {validation.errors.map((error: string, index: number) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {validation.warnings.length > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                <div className="font-medium mb-2 text-yellow-800">Warnings ({validation.warnings.length})</div>
                <ul className="list-disc list-inside space-y-1">
                  {validation.warnings.map((warning: string, index: number) => (
                    <li key={index} className="text-sm text-yellow-700">{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Configuration Preview */}
      <Card className="bg-explorer-dark border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Configuration Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-explorer-text mb-2">Basic Information</h4>
              <div className="space-y-1 text-sm">
                <div><span className="text-explorer-text-muted">Name:</span> {formData.name || 'Not set'}</div>
                <div><span className="text-explorer-text-muted">MSRP:</span> {formData.msrp_usd ? `$${formData.msrp_usd}` : 'Not set'}</div>
                <div><span className="text-explorer-text-muted">Region:</span> {formData.market_region || 'Not set'}</div>
                <div>
                  <span className="text-explorer-text-muted">Base Model:</span> 
                  <Badge variant={formData.is_default ? "default" : "secondary"} className="ml-2">
                    {formData.is_default ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-explorer-text mb-2">Dimensions</h4>
              <div className="space-y-1 text-sm">
                <div><span className="text-explorer-text-muted">Seat Height:</span> {formData.seat_height_mm ? `${formData.seat_height_mm}mm` : 'Not set'}</div>
                <div><span className="text-explorer-text-muted">Weight:</span> {formData.weight_kg ? `${formData.weight_kg}kg` : 'Not set'}</div>
                <div><span className="text-explorer-text-muted">Wheelbase:</span> {formData.wheelbase_mm ? `${formData.wheelbase_mm}mm` : 'Not set'}</div>
                <div><span className="text-explorer-text-muted">Fuel Capacity:</span> {formData.fuel_capacity_l ? `${formData.fuel_capacity_l}L` : 'Not set'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      {metrics && (
        <Card className="bg-explorer-dark border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-explorer-text">Calculated Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {metrics.powerToWeightRatio && (
                <div>
                  <div className="text-explorer-text-muted">Power/Weight</div>
                  <div className="font-medium text-explorer-text">{metrics.powerToWeightRatio} hp/kg</div>
                </div>
              )}
              {metrics.fuelRange && (
                <div>
                  <div className="text-explorer-text-muted">Est. Range</div>
                  <div className="font-medium text-explorer-text">{metrics.fuelRange} km</div>
                </div>
              )}
              {metrics.displacement && (
                <div>
                  <div className="text-explorer-text-muted">Displacement</div>
                  <div className="font-medium text-explorer-text">{metrics.displacement}cc</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrimPreviewSection;
