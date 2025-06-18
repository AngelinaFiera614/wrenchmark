
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Wrench, Disc, Frame, Shock, Wheel } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchEngines } from "@/services/engineService";
import { fetchBrakes } from "@/services/brakeService";
import { fetchFrames } from "@/services/frameService";
import { fetchSuspensions } from "@/services/suspensionService";
import { fetchWheels } from "@/services/wheelService";
import AdminEngineDialog from "./AdminEngineDialog";
import AdminBrakeSystemDialog from "./AdminBrakeSystemDialog";
import AdminFrameDialog from "./AdminFrameDialog";
import AdminSuspensionDialog from "./AdminSuspensionDialog";
import AdminWheelDialog from "./AdminWheelDialog";

const ComponentManagementTabs = () => {
  const [activeDialog, setActiveDialog] = useState<{
    type: 'engine' | 'brake' | 'frame' | 'suspension' | 'wheel' | null;
    item?: any;
  }>({ type: null });

  // Fetch all component data
  const { data: engines, refetch: refetchEngines } = useQuery({
    queryKey: ['engines'],
    queryFn: fetchEngines
  });

  const { data: brakes, refetch: refetchBrakes } = useQuery({
    queryKey: ['brakes'],
    queryFn: fetchBrakes
  });

  const { data: frames, refetch: refetchFrames } = useQuery({
    queryKey: ['frames'],
    queryFn: fetchFrames
  });

  const { data: suspensions, refetch: refetchSuspensions } = useQuery({
    queryKey: ['suspensions'],
    queryFn: () => fetchSuspensions()
  });

  const { data: wheels, refetch: refetchWheels } = useQuery({
    queryKey: ['wheels'],
    queryFn: () => fetchWheels()
  });

  const handleCloseDialog = (refreshData?: boolean) => {
    setActiveDialog({ type: null });
    if (refreshData) {
      // Refresh the appropriate data based on dialog type
      switch (activeDialog.type) {
        case 'engine':
          refetchEngines();
          break;
        case 'brake':
          refetchBrakes();
          break;
        case 'frame':
          refetchFrames();
          break;
        case 'suspension':
          refetchSuspensions();
          break;
        case 'wheel':
          refetchWheels();
          break;
      }
    }
  };

  const renderComponentTable = (components: any[], type: string, icon: React.ReactNode) => (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            {type} Components
          </div>
          <Button 
            onClick={() => setActiveDialog({ type: type.toLowerCase() as any })}
            className="bg-accent-teal text-black hover:bg-accent-teal/80"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add {type}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {components?.map((component) => (
            <div key={component.id} className="flex items-center justify-between p-3 bg-explorer-dark rounded border border-explorer-chrome/30">
              <div>
                <div className="font-medium text-explorer-text">
                  {component.name || component.type || `${type} Component`}
                </div>
                <div className="text-sm text-explorer-text-muted">
                  {component.description || 'No description'}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveDialog({ type: type.toLowerCase() as any, item: component })}
                className="border-explorer-chrome/30"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {(!components || components.length === 0) && (
            <div className="text-center py-8 text-explorer-text-muted">
              No {type.toLowerCase()} components found. Add one to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full">
      <Tabs defaultValue="engines" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="engines">Engines</TabsTrigger>
          <TabsTrigger value="brakes">Brakes</TabsTrigger>
          <TabsTrigger value="frames">Frames</TabsTrigger>
          <TabsTrigger value="suspension">Suspension</TabsTrigger>
          <TabsTrigger value="wheels">Wheels</TabsTrigger>
        </TabsList>
        
        <TabsContent value="engines" className="space-y-6">
          {renderComponentTable(engines, 'Engine', <Wrench className="h-5 w-5" />)}
        </TabsContent>
        
        <TabsContent value="brakes" className="space-y-6">
          {renderComponentTable(brakes, 'Brake', <Disc className="h-5 w-5" />)}
        </TabsContent>
        
        <TabsContent value="frames" className="space-y-6">
          {renderComponentTable(frames, 'Frame', <Frame className="h-5 w-5" />)}
        </TabsContent>
        
        <TabsContent value="suspension" className="space-y-6">
          {renderComponentTable(suspensions, 'Suspension', <Shock className="h-5 w-5" />)}
        </TabsContent>
        
        <TabsContent value="wheels" className="space-y-6">
          {renderComponentTable(wheels, 'Wheel', <Wheel className="h-5 w-5" />)}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AdminEngineDialog
        open={activeDialog.type === 'engine'}
        engine={activeDialog.item}
        onClose={handleCloseDialog}
      />
      <AdminBrakeSystemDialog
        open={activeDialog.type === 'brake'}
        brakeSystem={activeDialog.item}
        onClose={handleCloseDialog}
      />
      <AdminFrameDialog
        open={activeDialog.type === 'frame'}
        frame={activeDialog.item}
        onClose={handleCloseDialog}
      />
      <AdminSuspensionDialog
        open={activeDialog.type === 'suspension'}
        suspension={activeDialog.item}
        onClose={handleCloseDialog}
      />
      <AdminWheelDialog
        open={activeDialog.type === 'wheel'}
        wheel={activeDialog.item}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default ComponentManagementTabs;
