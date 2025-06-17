
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
  const categories = [
    "Sport", "Cruiser", "Touring", "Adventure", "Naked", "Standard", 
    "Scooter", "Off-road", "Dual-sport", "Electric"
  ];

  const productionStatuses = [
    "active", "discontinued", "concept", "limited", "upcoming"
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardHeader>
          <CardTitle className="text-explorer-text">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make/Brand *</Label>
              {isEditing ? (
                <Input
                  id="make"
                  value={motorcycle.make || ''}
                  onChange={(e) => onUpdate({ make: e.target.value })}
                  className="bg-explorer-card border-explorer-chrome/30"
                />
              ) : (
                <div className="p-2 text-explorer-text">{motorcycle.make || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              {isEditing ? (
                <Input
                  id="model"
                  value={motorcycle.model || ''}
                  onChange={(e) => onUpdate({ model: e.target.value })}
                  className="bg-explorer-card border-explorer-chrome/30"
                />
              ) : (
                <div className="p-2 text-explorer-text">{motorcycle.model || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              {isEditing ? (
                <Select value={motorcycle.category || ''} onValueChange={(value) => onUpdate({ category: value })}>
                  <SelectTrigger className="bg-explorer-card border-explorer-chrome/30">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 text-explorer-text">{motorcycle.category || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              {isEditing ? (
                <Input
                  id="year"
                  type="number"
                  value={motorcycle.year || ''}
                  onChange={(e) => onUpdate({ year: parseInt(e.target.value) || undefined })}
                  className="bg-explorer-card border-explorer-chrome/30"
                />
              ) : (
                <div className="p-2 text-explorer-text">{motorcycle.year || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="production_status">Production Status</Label>
              {isEditing ? (
                <Select value={motorcycle.production_status || ''} onValueChange={(value) => onUpdate({ production_status: value })}>
                  <SelectTrigger className="bg-explorer-card border-explorer-chrome/30">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {productionStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 text-explorer-text">{motorcycle.production_status || 'Not specified'}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty_level">Difficulty Level (1-5)</Label>
              {isEditing ? (
                <Input
                  id="difficulty_level"
                  type="number"
                  min="1"
                  max="5"
                  value={motorcycle.difficulty_level || ''}
                  onChange={(e) => onUpdate({ difficulty_level: parseInt(e.target.value) || undefined })}
                  className="bg-explorer-card border-explorer-chrome/30"
                />
              ) : (
                <div className="p-2 text-explorer-text">{motorcycle.difficulty_level || 'Not specified'}</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary/Description</Label>
            {isEditing ? (
              <Textarea
                id="summary"
                value={motorcycle.summary || ''}
                onChange={(e) => onUpdate({ summary: e.target.value })}
                rows={4}
                className="bg-explorer-card border-explorer-chrome/30"
              />
            ) : (
              <div className="p-2 text-explorer-text min-h-[100px]">
                {motorcycle.summary || 'No description provided'}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex items-center space-x-2">
              <Switch
                id="is_draft"
                checked={motorcycle.is_draft}
                onCheckedChange={(checked) => onUpdate({ is_draft: checked })}
              />
              <Label htmlFor="is_draft">Save as draft</Label>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MotorcycleBasicInfoForm;
