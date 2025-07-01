
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Edit, Eye, AlertTriangle, X } from "lucide-react";
import { Motorcycle } from "@/types";
import { calculateDataCompletenessSync } from "@/utils/dataCompleteness";
import { useMotorcycleForm } from "@/hooks/useMotorcycleForm";
import MotorcycleBasicInfoForm from "./forms/MotorcycleBasicInfoForm";
import SmartMotorcycleSpecsForm from "./forms/SmartMotorcycleSpecsForm";
import MotorcycleComponentsForm from "./forms/MotorcycleComponentsForm";
import MotorcycleYearsForm from "./forms/MotorcycleYearsForm";
import MotorcycleAdminNotes from "./MotorcycleAdminNotes";
import ComponentCompletionPanel from "./forms/ComponentCompletionPanel";

interface MotorcycleDetailsPanelProps {
  motorcycle: Motorcycle;
  onUpdate: () => void;
}

const MotorcycleDetailsPanel = ({ motorcycle, onUpdate }: MotorcycleDetailsPanelProps) => {
  const [isEditing, setIsEditing] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");
  
  const {
    formData,
    saving,
    hasUnsavedChanges,
    updateField,
    updateData,
    saveChanges,
    discardChanges
  } = useMotorcycleForm(motorcycle, () => {
    setIsEditing(false);
    onUpdate();
  });

  const completeness = calculateDataCompletenessSync(formData as Motorcycle);

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-400 bg-green-400/20";
    if (percentage >= 70) return "text-yellow-400 bg-yellow-400/20";
    return "text-red-400 bg-red-400/20";
  };

  const handleSave = async () => {
    await saveChanges();
  };

  const handleCancel = () => {
    discardChanges();
    setIsEditing(false);
  };

  const handlePreview = () => {
    window.open(`/motorcycles/${motorcycle.slug}`, '_blank');
  };

  const handleEditComponent = (componentType: string, componentId: string) => {
    console.log(`Edit ${componentType} component:`, componentId);
    // This could open a component editing dialog or navigate to component management
  };

  return (
    <div className="h-full flex gap-6">
      {/* Main Content */}
      <div className="flex-1">
        <Card className="bg-explorer-card border-explorer-chrome/30 h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-explorer-text flex items-center gap-2">
                  {formData.name}
                  {formData.is_draft && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">Draft</Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-md ${getCompletionColor(completeness.completionPercentage)}`}>
                    <span className="text-sm font-medium">{completeness.completionPercentage}% Complete</span>
                  </div>
                  {completeness.missingCriticalFields.length > 0 && (
                    <div className="flex items-center gap-1 text-red-400">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">{completeness.missingCriticalFields.length} critical missing</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {hasUnsavedChanges && (
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                    Unsaved Changes
                  </Badge>
                )}
                
                {isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCancel} disabled={saving}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSave} 
                      disabled={saving || !hasUnsavedChanges}
                      className="bg-accent-teal text-black hover:bg-accent-teal/80"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={handlePreview}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="years">Years & Trims</TabsTrigger>
                <TabsTrigger value="notes">Admin Notes</TabsTrigger>
              </TabsList>

              <div className="mt-4 h-[600px] overflow-y-auto">
                <TabsContent value="basic" className="mt-0">
                  <MotorcycleBasicInfoForm
                    motorcycle={formData as Motorcycle}
                    isEditing={isEditing}
                    onUpdate={updateData}
                  />
                </TabsContent>

                <TabsContent value="specs" className="mt-0">
                  <SmartMotorcycleSpecsForm
                    motorcycle={formData as Motorcycle}
                    isEditing={isEditing}
                    onUpdate={updateField}
                    onEditComponent={handleEditComponent}
                  />
                </TabsContent>

                <TabsContent value="components" className="mt-0">
                  <MotorcycleComponentsForm
                    motorcycle={formData as Motorcycle}
                    isEditing={isEditing}
                    onUpdate={updateData}
                  />
                </TabsContent>

                <TabsContent value="years" className="mt-0">
                  <MotorcycleYearsForm
                    motorcycle={formData as Motorcycle}
                    isEditing={isEditing}
                    onUpdate={updateData}
                  />
                </TabsContent>

                <TabsContent value="notes" className="mt-0">
                  <MotorcycleAdminNotes
                    motorcycle={formData as Motorcycle}
                    onUpdate={onUpdate}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Completion Guide */}
      <div className="w-80 space-y-4">
        <ComponentCompletionPanel
          motorcycle={formData as Motorcycle}
          onManageComponents={() => {
            console.log('Manage components for:', formData.id);
          }}
        />
        
        {/* Quick completion tips */}
        <Card className="bg-explorer-card border-explorer-chrome/30">
          <CardHeader>
            <CardTitle className="text-explorer-text text-sm">Smart Data Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xs text-explorer-text-muted space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                <span>Green badges = Data from linked components</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                <span>Blue badges = Model-level overrides</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                <span>Yellow badges = Data conflicts need attention</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                <span>Red badges = Missing data</span>
              </div>
            </div>
            <div className="text-xs text-explorer-text-muted mt-2 pt-2 border-t border-explorer-chrome/30">
              Use "Sync from Component" buttons to eliminate duplicate data entry.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MotorcycleDetailsPanel;
