
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Motorcycle } from "@/types";

interface MotorcycleBasicInfoFormProps {
  motorcycle: Motorcycle;
  isEditing: boolean;
  onUpdate: (data: Partial<Motorcycle>) => void;
}

const MotorcycleBasicInfoForm = ({ motorcycle, isEditing, onUpdate }: MotorcycleBasicInfoFormProps) => {
  const handleFieldChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardHeader>
          <CardTitle className="text-explorer-text">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              {isEditing ? (
                <Input
                  id="make"
                  value={motorcycle.make || ''}
                  onChange={(e) => handleFieldChange('make', e.target.value)}
                  className="bg-explorer-card border-explorer-chrome/30"
                />
              ) : (
                <div className="p-2 text-explorer-text">{motorcycle.make || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              {isEditing ? (
                <Input
                  id="model"
                  value={motorcycle.model || ''}
                  onChange={(e) => handleFieldChange('model', e.target.value)}
                  className="bg-explorer-card border-explorer-chrome/30"
                />
              ) : (
                <div className="p-2 text-explorer-text">{motorcycle.model || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              {isEditing ? (
                <Input
                  id="year"
                  type="number"
                  value={motorcycle.year || ''}
                  onChange={(e) => handleFieldChange('year', parseInt(e.target.value) || null)}
                  className="bg-explorer-card border-explorer-chrome/30"
                />
              ) : (
                <div className="p-2 text-explorer-text">{motorcycle.year || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              {isEditing ? (
                <Select value={motorcycle.category || ''} onValueChange={(value) => handleFieldChange('category', value)}>
                  <SelectTrigger className="bg-explorer-card border-explorer-chrome/30">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sport">Sport</SelectItem>
                    <SelectItem value="touring">Touring</SelectItem>
                    <SelectItem value="cruiser">Cruiser</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="dirt">Dirt/Off-road</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 text-explorer-text">{motorcycle.category || 'Not specified'}</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="base_description">Description</Label>
            {isEditing ? (
              <Textarea
                id="base_description"
                value={motorcycle.base_description || ''}
                onChange={(e) => handleFieldChange('base_description', e.target.value)}
                className="bg-explorer-card border-explorer-chrome/30"
                rows={3}
              />
            ) : (
              <div className="p-2 text-explorer-text">{motorcycle.base_description || 'No description provided'}</div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {isEditing ? (
              <Switch
                id="is_draft"
                checked={motorcycle.is_draft || false}
                onCheckedChange={(checked) => handleFieldChange('is_draft', checked)}
              />
            ) : (
              <div className={`w-4 h-4 rounded-sm ${motorcycle.is_draft ? 'bg-orange-500' : 'bg-green-500'}`} />
            )}
            <Label htmlFor="is_draft">Draft Status</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotorcycleBasicInfoForm;
