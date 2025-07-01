
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Link, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";

interface SmartFieldProps {
  label: string;
  value: any;
  componentValue?: any;
  configValue?: any;
  modelValue?: any;
  fieldKey: string;
  isEditing: boolean;
  onUpdate: (field: string, value: any) => void;
  onEditComponent?: () => void;
  onSyncFromComponent?: () => void;
  type?: 'text' | 'number' | 'textarea';
  unit?: string;
  componentType?: string;
  componentName?: string;
}

export const SmartFieldRenderer = ({
  label,
  value,
  componentValue,
  configValue,
  modelValue,
  fieldKey,
  isEditing,
  onUpdate,
  onEditComponent,
  onSyncFromComponent,
  type = 'text',
  unit,
  componentType,
  componentName
}: SmartFieldProps) => {
  // Determine data source and effective value
  const getDataSource = () => {
    if (componentValue !== undefined && componentValue !== null && componentValue !== '') {
      if (value === componentValue) {
        return { source: 'component', status: 'synced', color: 'text-green-600 bg-green-50 border-green-200' };
      } else if (value !== undefined && value !== null && value !== '') {
        return { source: 'override', status: 'overridden', color: 'text-blue-600 bg-blue-50 border-blue-200' };
      }
    }
    
    if (configValue !== undefined && configValue !== null && configValue !== '') {
      return { source: 'config', status: 'config', color: 'text-purple-600 bg-purple-50 border-purple-200' };
    }
    
    if (modelValue !== undefined && modelValue !== null && modelValue !== '') {
      return { source: 'model', status: 'model', color: 'text-gray-600 bg-gray-50 border-gray-200' };
    }
    
    return { source: 'missing', status: 'missing', color: 'text-red-600 bg-red-50 border-red-200' };
  };

  const dataSource = getDataSource();
  const effectiveValue = value || componentValue || configValue || modelValue;
  const hasComponentValue = componentValue !== undefined && componentValue !== null && componentValue !== '';
  const hasConflict = hasComponentValue && value !== componentValue && value !== undefined && value !== null && value !== '';

  const getSourceLabel = () => {
    switch (dataSource.source) {
      case 'component':
        return `From ${componentName || componentType || 'Component'}`;
      case 'override':
        return 'Model Override';
      case 'config':
        return 'Configuration';
      case 'model':
        return 'Model';
      case 'missing':
        return 'Not Set';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = () => {
    switch (dataSource.status) {
      case 'synced':
        return <CheckCircle2 className="h-3 w-3" />;
      case 'overridden':
        return <Edit className="h-3 w-3" />;
      case 'missing':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Link className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={fieldKey} className="text-explorer-text flex items-center gap-2">
          {label}
          {unit && <span className="text-sm text-explorer-text-muted">({unit})</span>}
        </Label>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-xs ${dataSource.color}`}>
            {getStatusIcon()}
            <span className="ml-1">{getSourceLabel()}</span>
          </Badge>
          {hasConflict && (
            <Badge variant="outline" className="text-xs text-yellow-600 bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-3 w-3 mr-1" />
              Conflict
            </Badge>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          {type === 'textarea' ? (
            <Textarea
              id={fieldKey}
              value={value || ''}
              onChange={(e) => onUpdate(fieldKey, e.target.value)}
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
              rows={3}
            />
          ) : (
            <Input
              id={fieldKey}
              type={type}
              value={value || ''}
              onChange={(e) => onUpdate(fieldKey, type === 'number' ? parseFloat(e.target.value) || null : e.target.value)}
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          )}
          
          {/* Action buttons */}
          <div className="flex gap-2">
            {hasComponentValue && value !== componentValue && (
              <Button
                size="sm"
                variant="outline"
                onClick={onSyncFromComponent}
                className="text-xs"
              >
                <Link className="h-3 w-3 mr-1" />
                Use {componentName || 'Component'} Value ({componentValue}{unit})
              </Button>
            )}
            {onEditComponent && hasComponentValue && (
              <Button
                size="sm"
                variant="outline"
                onClick={onEditComponent}
                className="text-xs"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Edit {componentName || 'Component'}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-explorer-text">
            {effectiveValue ? `${effectiveValue}${unit ? ` ${unit}` : ''}` : (
              <span className="text-red-400 italic">Not specified</span>
            )}
          </div>
          
          {hasConflict && (
            <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-200">
              <div className="font-medium">Data Conflict:</div>
              <div>Model: {value}{unit}</div>
              <div>{componentName || 'Component'}: {componentValue}{unit}</div>
            </div>
          )}
          
          {hasComponentValue && !hasConflict && (
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
              Inherited from {componentName || componentType || 'linked component'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
