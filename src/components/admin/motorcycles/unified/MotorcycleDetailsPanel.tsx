
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Edit, Eye, AlertTriangle } from "lucide-react";
import { Motorcycle } from "@/types";
import { calculateDataCompleteness } from "@/utils/dataCompleteness";
import MotorcycleBasicInfoForm from "./forms/MotorcycleBasicInfoForm";
import MotorcycleSpecsForm from "./forms/MotorcycleSpecsForm";
import MotorcycleComponentsForm from "./forms/MotorcycleComponentsForm";
import MotorcycleYearsForm from "./forms/MotorcycleYearsForm";
import MotorcycleAdminNotes from "./MotorcycleAdminNotes";

interface MotorcycleDetailsPanelProps {
  motorcycle: Motorcycle;
  onUpdate: () => void;
}

const MotorcycleDetailsPanel = ({ motorcycle, onUpdate }: MotorcycleDetailsPanelProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const completeness = calculateDataCompleteness(motorcycle);

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-400 bg-green-400/20";
    if (percentage >= 70) return "text-yellow-400 bg-yellow-400/20";
    return "text-red-400 bg-red-400/20";
  };

  const handleSave = async () => {
    // Save logic here
    setIsEditing(false);
    setUnsavedChanges(false);
    onUpdate();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUnsavedChanges(false);
  };

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30 h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-explorer-text flex items-center gap-2">
              {motorcycle.make} {motorcycle.model}
              {motorcycle.is_draft && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">Draft</Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <div className={`flex items-center gap-2 px-2 py-1 rounded-md ${getCompletionColor(completeness.completionPercentage)}`}>
                <span className="text-sm font-medium">{completeness.completionPercentage}% Complete</span>
              </div>
              {completeness.missingCriticalFields.length > 0 && (
                <div className="flex items-center gap-1 text-red-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">{completeness.missingCriticalFields.length} missing fields</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {unsavedChanges && (
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                Unsaved Changes
              </Badge>
            )}
            
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} className="bg-accent-teal text-black hover:bg-accent-teal/80">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm">
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

          <div className="mt-4 h-[500px] overflow-y-auto">
            <TabsContent value="basic" className="mt-0">
              <MotorcycleBasicInfoForm
                motorcycle={motorcycle}
                isEditing={isEditing}
                onUpdate={(data) => {
                  setUnsavedChanges(true);
                  // Update logic here
                }}
              />
            </TabsContent>

            <TabsContent value="specs" className="mt-0">
              <MotorcycleSpecsForm
                motorcycle={motorcycle}
                isEditing={isEditing}
                onUpdate={(data) => {
                  setUnsavedChanges(true);
                  // Update logic here
                }}
              />
            </TabsContent>

            <TabsContent value="components" className="mt-0">
              <MotorcycleComponentsForm
                motorcycle={motorcycle}
                isEditing={isEditing}
                onUpdate={(data) => {
                  setUnsavedChanges(true);
                  // Update logic here
                }}
              />
            </TabsContent>

            <TabsContent value="years" className="mt-0">
              <MotorcycleYearsForm
                motorcycle={motorcycle}
                isEditing={isEditing}
                onUpdate={(data) => {
                  setUnsavedChanges(true);
                  // Update logic here
                }}
              />
            </TabsContent>

            <TabsContent value="notes" className="mt-0">
              <MotorcycleAdminNotes
                motorcycle={motorcycle}
                onUpdate={onUpdate}
              />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MotorcycleDetailsPanel;
