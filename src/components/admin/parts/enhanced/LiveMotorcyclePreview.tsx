
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Clock, ExternalLink, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveMotorcyclePreviewProps {
  configuration: any;
  modelData?: any;
  yearData?: any;
  onFlaggedClick?: () => void;
  onFixIssue?: (issueType: string) => void;
  compact?: boolean;
}

const LiveMotorcyclePreview = ({ 
  configuration, 
  modelData, 
  yearData, 
  onFlaggedClick,
  onFixIssue,
  compact = false 
}: LiveMotorcyclePreviewProps) => {
  const issues = [];
  const warnings = [];
  const completions = [];

  // Analyze configuration completeness
  if (!configuration.engine_id) issues.push({ type: "engine", message: "Missing engine component" });
  if (!configuration.brake_system_id) issues.push({ type: "brake_system", message: "Missing brake system" });
  if (!configuration.frame_id) issues.push({ type: "frame", message: "Missing frame" });
  if (!configuration.suspension_id) warnings.push({ type: "suspension", message: "Missing suspension" });
  if (!configuration.wheel_id) warnings.push({ type: "wheel", message: "Missing wheels" });
  
  if (!configuration.seat_height_mm) warnings.push({ type: "dimensions", message: "Missing seat height" });
  if (!configuration.weight_kg) warnings.push({ type: "dimensions", message: "Missing weight" });
  if (!configuration.msrp_usd && !configuration.price_premium_usd) warnings.push({ type: "pricing", message: "Missing pricing" });
  
  if (configuration.engine_id) completions.push("Engine assigned");
  if (configuration.brake_system_id) completions.push("Brake system assigned");
  if (configuration.seat_height_mm && configuration.weight_kg) completions.push("Basic dimensions complete");

  const FlaggedSection = ({ 
    title, 
    type, 
    issues 
  }: { 
    title: string, 
    type: 'error' | 'warning' | 'success', 
    issues: Array<{ type?: string; message?: string } | string> 
  }) => (
    <Alert 
      className={`cursor-pointer transition-colors ${
        type === 'error' ? 'border-red-200 bg-red-50 hover:bg-red-100' :
        type === 'warning' ? 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100' :
        'border-green-200 bg-green-50'
      }`}
      onClick={onFlaggedClick}
    >
      {type === 'error' ? <AlertTriangle className="h-4 w-4 text-red-600" /> :
       type === 'warning' ? <Clock className="h-4 w-4 text-yellow-600" /> :
       <CheckCircle className="h-4 w-4 text-green-600" />}
      <AlertDescription className={
        type === 'error' ? 'text-red-800' :
        type === 'warning' ? 'text-yellow-800' :
        'text-green-800'
      }>
        <div className="font-medium">{title}</div>
        <div className="space-y-2 mt-2">
          {issues.map((issue, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">
                {typeof issue === 'string' ? issue : issue.message}
              </span>
              {onFixIssue && typeof issue === 'object' && issue.type && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-1 h-auto ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFixIssue(issue.type);
                  }}
                >
                  <Settings className="h-3 w-3" />
                  Fix
                </Button>
              )}
            </div>
          ))}
        </div>
        {onFlaggedClick && (
          <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto">
            <ExternalLink className="h-3 w-3 mr-1" />
            Click to edit
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );

  return (
    <div className={`space-y-4 ${compact ? 'text-sm' : ''}`}>
      {/* Motorcycle Header */}
      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardHeader className={compact ? "pb-2" : ""}>
          <CardTitle className={`text-explorer-text ${compact ? 'text-lg' : 'text-xl'}`}>
            {modelData?.brand?.name || 'Unknown Brand'} {modelData?.name || 'Unknown Model'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{yearData?.year || 'Unknown Year'}</Badge>
            <Badge variant="outline">
              {configuration.name || configuration.trim_level || 'Base Configuration'}
            </Badge>
            {configuration.is_default && (
              <Badge className="bg-accent-teal/20 text-accent-teal">Default</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className={compact ? "pt-0" : ""}>
          {configuration.description && (
            <p className="text-explorer-text-muted">{configuration.description}</p>
          )}
        </CardContent>
      </Card>

      {/* Issues and Warnings */}
      {issues.length > 0 && (
        <FlaggedSection 
          title="Critical Issues" 
          type="error" 
          issues={issues} 
        />
      )}

      {warnings.length > 0 && (
        <FlaggedSection 
          title="Missing Information" 
          type="warning" 
          issues={warnings} 
        />
      )}

      {completions.length > 0 && (
        <FlaggedSection 
          title="Completed Sections" 
          type="success" 
          issues={completions} 
        />
      )}

      {/* Specs Preview */}
      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardHeader>
          <CardTitle className={`text-explorer-text ${compact ? 'text-base' : ''}`}>
            Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid grid-cols-2 gap-4 ${compact ? 'text-sm' : ''}`}>
            <div>
              <div className="text-explorer-text-muted">Engine</div>
              <div className="text-explorer-text">
                {configuration.engine?.name || 'Not specified'}
              </div>
            </div>
            <div>
              <div className="text-explorer-text-muted">Power</div>
              <div className="text-explorer-text">
                {configuration.engine?.power_hp ? `${configuration.engine.power_hp} HP` : 'Not specified'}
              </div>
            </div>
            <div>
              <div className="text-explorer-text-muted">Weight</div>
              <div className="text-explorer-text">
                {configuration.weight_kg ? `${configuration.weight_kg} kg` : 'Not specified'}
              </div>
            </div>
            <div>
              <div className="text-explorer-text-muted">Seat Height</div>
              <div className="text-explorer-text">
                {configuration.seat_height_mm ? `${configuration.seat_height_mm} mm` : 'Not specified'}
              </div>
            </div>
            <div>
              <div className="text-explorer-text-muted">MSRP</div>
              <div className="text-explorer-text">
                {configuration.msrp_usd ? `$${configuration.msrp_usd.toLocaleString()}` : 'Not specified'}
              </div>
            </div>
            <div>
              <div className="text-explorer-text-muted">Market</div>
              <div className="text-explorer-text">
                {configuration.market_region || 'Global'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Components Preview */}
      {!compact && (
        <Card className="bg-explorer-dark border-explorer-chrome/20">
          <CardHeader>
            <CardTitle className="text-explorer-text">Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Engine', data: configuration.engine, id: configuration.engine_id },
                { label: 'Brakes', data: configuration.brakes, id: configuration.brake_system_id },
                { label: 'Frame', data: configuration.frame, id: configuration.frame_id },
                { label: 'Suspension', data: configuration.suspension, id: configuration.suspension_id },
                { label: 'Wheels', data: configuration.wheels, id: configuration.wheel_id }
              ].map((component) => (
                <div key={component.label} className="flex items-center justify-between p-2 bg-explorer-card rounded-md">
                  <div>
                    <div className="font-medium text-explorer-text">{component.label}</div>
                    <div className="text-sm text-explorer-text-muted">
                      {component.data?.name || (component.id ? 'Component assigned' : 'Not assigned')}
                    </div>
                  </div>
                  <div>
                    {component.id ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LiveMotorcyclePreview;
