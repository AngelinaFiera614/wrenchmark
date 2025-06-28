import React, { useState } from "react";
import { Cog, Disc, Box, Zap, Circle, Bug } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchEngines } from "@/services/engineService";
import { fetchBrakes } from "@/services/brakeService";
import { fetchFrames } from "@/services/frameService";
import { fetchSuspensions } from "@/services/suspensionService";
import { fetchWheels } from "@/services/wheelService";
import { debugJSeriesEngine, getEngineOperationLogs } from "@/services/engineServiceDebug";
import AdminEngineDialog from "@/components/admin/components/AdminEngineDialog";
import AdminBrakeSystemDialog from "@/components/admin/components/AdminBrakeSystemDialog";
import AdminFrameDialog from "@/components/admin/components/AdminFrameDialog";
import AdminSuspensionDialog from "@/components/admin/components/AdminSuspensionDialog";
import AdminWheelDialog from "@/components/admin/components/AdminWheelDialog";
import EngineDebugInfo from "@/components/admin/components/EngineDebugInfo";
import ComponentTypeCard from "./components/ComponentTypeCard";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { useComponentEdit } from "./hooks/useComponentEdit";
import { useComponentDelete } from "./hooks/useComponentDelete";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const ComponentsLibraryPage = () => {
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  // Fetch all component types
  const { data: engines = [], isLoading: enginesLoading, refetch: refetchEngines } = useQuery({
    queryKey: ['engines'],
    queryFn: fetchEngines
  });

  const { data: brakes = [], isLoading: brakesLoading, refetch: refetchBrakes } = useQuery({
    queryKey: ['brakes'],
    queryFn: fetchBrakes
  });

  const { data: frames = [], isLoading: framesLoading, refetch: refetchFrames } = useQuery({
    queryKey: ['frames'],
    queryFn: fetchFrames
  });

  const { data: suspensions = [], isLoading: suspensionsLoading, refetch: refetchSuspensions } = useQuery({
    queryKey: ['suspensions'],
    queryFn: fetchSuspensions
  });

  const { data: wheels = [], isLoading: wheelsLoading, refetch: refetchWheels } = useQuery({
    queryKey: ['wheels'],
    queryFn: fetchWheels
  });

  const refetchCallbacks = {
    refetchEngines,
    refetchBrakes,
    refetchFrames,
    refetchSuspensions,
    refetchWheels
  };

  // Use custom hooks for edit and delete functionality
  const {
    activeDialog,
    editingComponent,
    isEditing,
    handleAdd,
    handleEdit,
    handleDialogClose
  } = useComponentEdit(refetchCallbacks);

  const {
    deleteDialog,
    handleDelete,
    confirmDelete,
    closeDeleteDialog
  } = useComponentDelete(engines, brakes, frames, suspensions, wheels, refetchCallbacks);

  const handleDebugJSeries = async () => {
    const result = await debugJSeriesEngine();
    console.log("J-Series Debug Result:", result);
    setShowDebugInfo(true);
  };

  const handleShowLogs = () => {
    const logs = getEngineOperationLogs();
    console.log("Engine Operation Logs:", logs);
    alert(`Found ${logs.length} engine operation logs. Check console for details.`);
  };

  return (
    <div className="flex-1 p-6 bg-explorer-dark">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-explorer-text mb-2">
            Components Library
          </h1>
          <p className="text-explorer-text-muted">
            Manage all motorcycle components in one place
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDebugJSeries}
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
          >
            <Bug className="h-4 w-4 mr-2" />
            Debug J-Series
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShowLogs}
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            <Bug className="h-4 w-4 mr-2" />
            Show Logs
          </Button>
        </div>
      </div>

      {showDebugInfo && (
        <Collapsible className="mb-6">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full mb-4">
              <Bug className="h-4 w-4 mr-2" />
              Engine Debug Information (Click to toggle)
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <EngineDebugInfo />
          </CollapsibleContent>
        </Collapsible>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ComponentTypeCard
          title="Engines"
          icon={<Cog className="h-5 w-5" />}
          data={engines}
          loading={enginesLoading}
          onAdd={() => handleAdd('engine')}
          onEdit={(id) => handleEdit('engine', id)}
          onDelete={(id) => handleDelete('engine', id)}
          renderItem={(engine) => (
            <div>
              <div className="font-medium text-explorer-text">{engine.name}</div>
              <div className="text-sm text-explorer-text-muted">
                {engine.displacement_cc}cc
                {engine.power_hp && ` • ${engine.power_hp}hp`}
                {engine.engine_type && ` • ${engine.engine_type}`}
              </div>
            </div>
          )}
        />

        <ComponentTypeCard
          title="Brake Systems"
          icon={<Disc className="h-5 w-5" />}
          data={brakes}
          loading={brakesLoading}
          onAdd={() => handleAdd('brake')}
          onEdit={(id) => handleEdit('brake', id)}
          onDelete={(id) => handleDelete('brake', id)}
          renderItem={(brake) => (
            <div>
              <div className="font-medium text-explorer-text">{brake.name || brake.type}</div>
              <div className="text-sm text-explorer-text-muted">
                {brake.brake_brand && `${brake.brake_brand} • `}
                {brake.has_abs && 'ABS'}
                {brake.has_traction_control && ' • Traction Control'}
              </div>
            </div>
          )}
        />

        <ComponentTypeCard
          title="Frames"
          icon={<Box className="h-5 w-5" />}
          data={frames}
          loading={framesLoading}
          onAdd={() => handleAdd('frame')}
          onEdit={(id) => handleEdit('frame', id)}
          onDelete={(id) => handleDelete('frame', id)}
          renderItem={(frame) => (
            <div>
              <div className="font-medium text-explorer-text">{frame.name || frame.type}</div>
              <div className="text-sm text-explorer-text-muted">
                {frame.material && `${frame.material} • `}
                {frame.construction_method}
              </div>
            </div>
          )}
        />

        <ComponentTypeCard
          title="Suspension"
          icon={<Zap className="h-5 w-5" />}
          data={suspensions}
          loading={suspensionsLoading}
          onAdd={() => handleAdd('suspension')}
          onEdit={(id) => handleEdit('suspension', id)}
          onDelete={(id) => handleDelete('suspension', id)}
          renderItem={(suspension) => (
            <div>
              <div className="font-medium text-explorer-text">
                {suspension.brand || 'Suspension System'}
              </div>
              <div className="text-sm text-explorer-text-muted">
                F: {suspension.front_type || 'Standard'} • R: {suspension.rear_type || 'Standard'}
                {suspension.adjustability && ` • ${suspension.adjustability}`}
              </div>
            </div>
          )}
        />

        <div className="xl:col-span-2">
          <ComponentTypeCard
            title="Wheels"
            icon={<Circle className="h-5 w-5" />}
            data={wheels}
            loading={wheelsLoading}
            onAdd={() => handleAdd('wheel')}
            onEdit={(id) => handleEdit('wheel', id)}
            onDelete={(id) => handleDelete('wheel', id)}
            renderItem={(wheel) => (
              <div>
                <div className="font-medium text-explorer-text">
                  {wheel.type || 'Wheel Set'}
                </div>
                <div className="text-sm text-explorer-text-muted">
                  F: {wheel.front_size || 'Unknown'} • R: {wheel.rear_size || 'Unknown'}
                  {wheel.rim_material && ` • ${wheel.rim_material}`}
                </div>
              </div>
            )}
          />
        </div>
      </div>

      {/* Dialog Components */}
      <AdminEngineDialog
        open={activeDialog === 'engine'}
        engine={isEditing ? editingComponent : null}
        onClose={handleDialogClose}
      />
      
      <AdminBrakeSystemDialog
        open={activeDialog === 'brake'}
        brakeSystem={isEditing ? editingComponent : null}
        onClose={handleDialogClose}
      />
      
      <AdminFrameDialog
        open={activeDialog === 'frame'}
        frame={isEditing ? editingComponent : null}
        onClose={handleDialogClose}
      />
      
      <AdminSuspensionDialog
        open={activeDialog === 'suspension'}
        suspension={isEditing ? editingComponent : null}
        onClose={handleDialogClose}
      />
      
      <AdminWheelDialog
        open={activeDialog === 'wheel'}
        wheel={isEditing ? editingComponent : null}
        onClose={handleDialogClose}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        componentName={deleteDialog.componentName || 'Unknown'}
        componentType={deleteDialog.componentType || 'component'}
      />
    </div>
  );
};

export default ComponentsLibraryPage;
