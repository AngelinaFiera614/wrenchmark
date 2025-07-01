
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Link, AlertCircle, CheckCircle2, ExternalLink, ToggleLeft, ToggleRight } from "lucide-react";
import { useMeasurement } from "@/context/MeasurementContext";
import { 
  kgToLbs, lbsToKg, mmToInches, inchesToMm, 
  litersToGallons, gallonsToLiters, kphToMph, mphToKph,
  formatWeightForForm, formatLengthForForm, formatVolumeForForm, formatSpeedForForm,
  parseWeightForDb, parseLengthForDb, parseVolumeForDb, parseSpeedForDb
} from "@/utils/imperialConverters";

interface MeasurementAwareFieldProps {
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
  measurementType?: 'weight' | 'length' | 'volume' | 'speed';
  componentType?: string;
  componentName?: string;
}

export const MeasurementAwareFieldRenderer = ({
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
  measurementType,
  componentType,
  componentName
}: MeasurementAwareFieldProps) => {
  const { unit: globalUnit } = useMeasurement();
  const [localUnitOverride, setLocalUnitOverride] = useState<'metric' | 'imperial' | null>(null);
  const activeUnit = localUnitOverride || globalUnit;

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

  // Format display value based on measurement type and unit system
  const formatDisplayValue = (val: any) => {
    if (!val || !measurementType) return val;
    
    if (activeUnit === 'imperial') {
      switch (measurementType) {
        case 'weight':
          return typeof val === 'number' ? kgToLbs(val).toFixed(1) : val;
        case 'length':
          return typeof val === 'number' ? mmToInches(val).toFixed(1) : val;
        case 'volume':
          return typeof val === 'number' ? litersToGallons(val).toFixed(1) : val;
        case 'speed':
          return typeof val === 'number' ? kphToMph(val).toFixed(0) : val;
        default:
          return val;
      }
    }
    return val;
  };

  // Get appropriate unit suffix
  const getUnitSuffix = () => {
    if (!measurementType) return unit;
    
    if (activeUnit === 'imperial') {
      switch (measurementType) {
        case 'weight': return 'lbs';
        case 'length': return 'in';
        case 'volume': return 'gal';
        case 'speed': return 'mph';
        default: return unit;
      }
    }
    return unit;
  };

  // Handle input value conversion
  const handleInputChange = (inputValue: string) => {
    if (!measurementType) {
      onUpdate(fieldKey, type === 'number' ? parseFloat(inputValue) || null : inputValue);
      return;
    }

    let convertedValue;
    if (activeUnit === 'imperial') {
      switch (measurementType) {
        case 'weight':
          convertedValue = parseWeightForDb(inputValue);
          break;
        case 'length':
          convertedValue = parseLengthForDb(inputValue);
          break;
        case 'volume':
          convertedValue = parseVolumeForDb(inputValue);
          break;
        case 'speed':
          convertedValue = parseSpeedForDb(inputValue);
          break;
        default:
          convertedValue = parseFloat(inputValue) || null;
      }
    } else {
      convertedValue = parseFloat(inputValue) || null;
    }
    
    onUpdate(fieldKey, convertedValue);
  };

  const toggleUnit = () => {
    setLocalUnitOverride(activeUnit === 'metric' ? 'imperial' : 'metric');
  };

  const displayValue = formatDisplayValue(effectiveValue);
  const unitSuffix = getUnitSuffix();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={fieldKey} className="text-explorer-text flex items-center gap-2">
          {label}
          {unitSuffix && <span className="text-sm text-explorer-text-muted">({unitSuffix})</span>}
          {measurementType && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleUnit}
              className="h-5 w-5 p-0 ml-1"
            >
              {activeUnit === 'metric' ? (
                <ToggleLeft className="h-3 w-3" />
              ) : (
                <ToggleRight className="h-3 w-3" />
              )}
            </Button>
          )}
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
              value={formatDisplayValue(value) || ''}
              onChange={(e) => handleInputChange(e.target.value)}
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
                Use {componentName || 'Component'} Value ({formatDisplayValue(componentValue)}{unitSuffix})
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
            {displayValue ? `${displayValue}${unitSuffix ? ` ${unitSuffix}` : ''}` : (
              <span className="text-red-400 italic">Not specified</span>
            )}
            {measurementType && effectiveValue && activeUnit === 'imperial' && (
              <span className="text-sm text-explorer-text-muted ml-2">
                (≈ {effectiveValue}{unit})
              </span>
            )}
            {measurementType && effectiveValue && activeUnit === 'metric' && (
              <span className="text-sm text-explorer-text-muted ml-2">
                (≈ {formatDisplayValue(effectiveValue)}{getUnitSuffix()})
              </span>
            )}
          </div>
          
          {hasConflict && (
            <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-200">
              <div className="font-medium">Data Conflict:</div>
              <div>Model: {formatDisplayValue(value)}{unitSuffix}</div>
              <div>{componentName || 'Component'}: {formatDisplayValue(componentValue)}{unitSuffix}</div>
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
