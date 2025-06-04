
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface TrimNotesSectionProps {
  formData: any;
  validation: any;
  completeness: any;
  onInputChange: (field: string, value: any) => void;
}

const TrimNotesSection = ({ formData, validation, completeness, onInputChange }: TrimNotesSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Price & Dimensions Summary */}
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-explorer-text">Price & Dimensions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {formData.name && (
              <div className="text-xs text-explorer-text-muted">
                <span className="font-medium">Name:</span> {formData.name}
              </div>
            )}
            {formData.msrp_usd && (
              <div className="text-xs text-explorer-text-muted">
                <span className="font-medium">MSRP:</span> ${formData.msrp_usd.toLocaleString()}
              </div>
            )}
            {formData.seat_height_mm && (
              <div className="text-xs text-explorer-text-muted">
                <span className="font-medium">Seat Height:</span> {formData.seat_height_mm}mm
              </div>
            )}
            {formData.weight_kg && (
              <div className="text-xs text-explorer-text-muted">
                <span className="font-medium">Weight:</span> {formData.weight_kg}kg
              </div>
            )}
            {formData.wheelbase_mm && (
              <div className="text-xs text-explorer-text-muted">
                <span className="font-medium">Wheelbase:</span> {formData.wheelbase_mm}mm
              </div>
            )}
          </CardContent>
        </Card>

        {/* Component Assignment Summary */}
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-explorer-text">Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {formData.engine_id && (
              <Badge variant="outline" className="text-xs">Engine Assigned</Badge>
            )}
            {formData.brake_system_id && (
              <Badge variant="outline" className="text-xs">Brakes Assigned</Badge>
            )}
            {formData.frame_id && (
              <Badge variant="outline" className="text-xs">Frame Assigned</Badge>
            )}
            {formData.suspension_id && (
              <Badge variant="outline" className="text-xs">Suspension Assigned</Badge>
            )}
            {formData.wheel_id && (
              <Badge variant="outline" className="text-xs">Wheels Assigned</Badge>
            )}
            {!formData.engine_id && !formData.brake_system_id && !formData.frame_id && (
              <div className="text-xs text-explorer-text-muted">No components assigned</div>
            )}
          </CardContent>
        </Card>

        {/* Validation Status */}
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-explorer-text">Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xs text-explorer-text-muted">
              <span className="font-medium">Completion:</span> {completeness.overall}%
            </div>
            <div className="text-xs text-explorer-text-muted">
              <span className="font-medium">Errors:</span> {validation.errors?.length || 0}
            </div>
            <div className="text-xs text-explorer-text-muted">
              <span className="font-medium">Warnings:</span> {validation.warnings?.length || 0}
            </div>
            {validation.isValid ? (
              <Badge className="bg-green-100 text-green-800 text-xs">Valid</Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800 text-xs">Has Issues</Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes Field */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text">Notes & Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-explorer-text">
              General Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any notes, special features, or documentation for this trim level..."
              value={formData.notes || ''}
              onChange={(e) => onInputChange('notes', e.target.value)}
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrimNotesSection;
