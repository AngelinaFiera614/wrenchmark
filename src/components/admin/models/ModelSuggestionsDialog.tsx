import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Save, 
  X, 
  AlertTriangle,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SuggestionField, FetchedModelData } from "@/types/autofill";
import { autofillService } from "@/services/autofillService";

interface ModelSuggestionsDialogProps {
  open: boolean;
  onClose: () => void;
  model: any;
  suggestedData: FetchedModelData;
  source?: string;
  onApplied: (appliedFields: Record<string, any>) => void;
}

const FIELD_LABELS: Record<string, string> = {
  name: 'Model Name',
  type: 'Type',
  engine_size: 'Engine Size (cc)',
  horsepower: 'Horsepower',
  torque_nm: 'Torque (Nm)',
  top_speed_kph: 'Top Speed (km/h)',
  weight_kg: 'Weight (kg)',
  seat_height_mm: 'Seat Height (mm)',
  fuel_capacity_l: 'Fuel Capacity (L)',
  has_abs: 'ABS',
  base_description: 'Description',
  default_image_url: 'Image URL',
  production_start_year: 'Production Start Year',
  production_end_year: 'Production End Year'
};

export default function ModelSuggestionsDialog({
  open,
  onClose,
  model,
  suggestedData,
  source,
  onApplied
}: ModelSuggestionsDialogProps) {
  const [fields, setFields] = useState<SuggestionField[]>([]);
  const [ignoreAutofill, setIgnoreAutofill] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && model && suggestedData) {
      const suggestionFields: SuggestionField[] = [];
      
      Object.keys(suggestedData).forEach(field => {
        const currentValue = model[field];
        const suggestedValue = suggestedData[field as keyof FetchedModelData];
        
        if (suggestedValue !== undefined && suggestedValue !== currentValue) {
          suggestionFields.push({
            field,
            currentValue,
            suggestedValue,
            isSelected: false,
            isEdited: false
          });
        }
      });
      
      setFields(suggestionFields);
      setIgnoreAutofill(model.ignore_autofill || false);
    }
  }, [open, model, suggestedData]);

  const handleFieldToggle = (index: number, checked: boolean) => {
    setFields(prev => prev.map((field, i) => 
      i === index ? { ...field, isSelected: checked } : field
    ));
  };

  const handleFieldEdit = (index: number) => {
    setFields(prev => prev.map((field, i) => 
      i === index ? { 
        ...field, 
        isEdited: !field.isEdited,
        editedValue: field.isEdited ? undefined : field.suggestedValue
      } : field
    ));
  };

  const handleEditedValueChange = (index: number, value: any) => {
    setFields(prev => prev.map((field, i) => 
      i === index ? { ...field, editedValue: value } : field
    ));
  };

  const selectAll = () => {
    setFields(prev => prev.map(field => ({ ...field, isSelected: true })));
  };

  const selectNone = () => {
    setFields(prev => prev.map(field => ({ ...field, isSelected: false })));
  };

  const handleApply = async () => {
    setIsApplying(true);
    
    try {
      const selectedFields = fields.filter(f => f.isSelected);
      const appliedFields: Record<string, any> = {};
      const rejectedFields: Record<string, any> = {};
      
      fields.forEach(field => {
        if (field.isSelected) {
          appliedFields[field.field] = field.isEdited ? field.editedValue : field.suggestedValue;
        } else {
          rejectedFields[field.field] = field.suggestedValue;
        }
      });

      // Apply selected fields
      if (Object.keys(appliedFields).length > 0) {
        const success = await autofillService.applySelectedFields(model.id, appliedFields);
        if (!success) {
          throw new Error('Failed to apply changes');
        }
      }

      // Update ignore flag if changed
      if (ignoreAutofill !== model.ignore_autofill) {
        await autofillService.setIgnoreAutofill(model.id, ignoreAutofill);
      }

      // Log the action
      await autofillService.logAction(
        model.id,
        'apply',
        appliedFields,
        rejectedFields,
        source,
        `Applied ${Object.keys(appliedFields).length} fields, rejected ${Object.keys(rejectedFields).length} fields`
      );

      toast({
        title: "Changes Applied",
        description: `Successfully updated ${Object.keys(appliedFields).length} fields.`,
      });

      onApplied(appliedFields);
      onClose();
    } catch (error) {
      console.error('Error applying changes:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to apply changes. Please try again.",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleIgnore = async () => {
    try {
      await autofillService.logAction(
        model.id,
        'ignore',
        {},
        Object.fromEntries(fields.map(f => [f.field, f.suggestedValue])),
        source,
        'Ignored all suggestions'
      );

      toast({
        title: "Suggestions Ignored",
        description: "All suggestions have been ignored.",
      });

      onClose();
    } catch (error) {
      console.error('Error ignoring suggestions:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to ignore suggestions.",
      });
    }
  };

  const formatValue = (value: any, field: string): string => {
    if (value === null || value === undefined) return 'Not set';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (field.includes('url') && typeof value === 'string') {
      return value.length > 50 ? `${value.substring(0, 50)}...` : value;
    }
    return String(value);
  };

  const selectedCount = fields.filter(f => f.isSelected).length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Model Suggestions for {model?.brand?.name} {model?.name}
            {source && (
              <Badge variant="outline" className="ml-2">
                {source}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between gap-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Select All ({fields.length})
                </Button>
                <Button variant="outline" size="sm" onClick={selectNone}>
                  Select None
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedCount} of {fields.length} fields selected
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={ignoreAutofill}
                onCheckedChange={setIgnoreAutofill}
                id="ignore-autofill"
              />
              <label htmlFor="ignore-autofill" className="text-sm">
                Ignore future autofill for this model
              </label>
            </div>
          </div>

          {/* Suggestions Grid */}
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.field} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={field.isSelected}
                      onCheckedChange={(checked) => handleFieldToggle(index, checked as boolean)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      {/* Field Label */}
                      <div className="space-y-2">
                        <div className="font-medium text-sm">
                          {FIELD_LABELS[field.field] || field.field}
                        </div>
                      </div>

                      {/* Current Value */}
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Current</div>
                        <div className="text-sm bg-red-50 border border-red-200 rounded p-2">
                          {formatValue(field.currentValue, field.field)}
                        </div>
                      </div>

                      {/* Suggested Value */}
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          Suggested
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFieldEdit(index)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {field.isEdited ? (
                          <div className="space-y-2">
                            {field.field === 'base_description' ? (
                              <Textarea
                                value={field.editedValue || ''}
                                onChange={(e) => handleEditedValueChange(index, e.target.value)}
                                className="text-sm"
                                rows={3}
                              />
                            ) : (
                              <Input
                                value={field.editedValue || ''}
                                onChange={(e) => {
                                  let value: any = e.target.value;
                                  if (field.field === 'has_abs') {
                                    value = value === 'true';
                                  } else if (['engine_size', 'horsepower', 'torque_nm', 'top_speed_kph', 'weight_kg', 'seat_height_mm', 'fuel_capacity_l', 'production_start_year', 'production_end_year'].includes(field.field)) {
                                    value = parseFloat(value) || 0;
                                  }
                                  handleEditedValueChange(index, value);
                                }}
                                className="text-sm"
                              />
                            )}
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFieldEdit(index)}
                                className="h-6 px-2"
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm bg-green-50 border border-green-200 rounded p-2">
                            {formatValue(field.suggestedValue, field.field)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleIgnore}>
                <EyeOff className="mr-2 h-4 w-4" />
                Ignore All Suggestions
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleApply}
                disabled={selectedCount === 0 || isApplying}
              >
                {isApplying ? (
                  "Applying..."
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Apply Selected Fields ({selectedCount})
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
