
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Cog,
  Disc,
  Box,
  Zap,
  Circle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { fetchEngines, fetchEngineById, deleteEngine } from "@/services/engineService";
import { fetchBrakes, fetchBrakeById, deleteBrake } from "@/services/brakeService";
import { fetchFrames, fetchFrameById, deleteFrame } from "@/services/frameService";
import { fetchSuspensions, fetchSuspensionById, deleteSuspension } from "@/services/suspensionService";
import { fetchWheels, fetchWheelById, deleteWheel } from "@/services/wheelService";
import AdminEngineDialog from "@/components/admin/components/AdminEngineDialog";
import AdminBrakeSystemDialog from "@/components/admin/components/AdminBrakeSystemDialog";
import AdminFrameDialog from "@/components/admin/components/AdminFrameDialog";
import AdminSuspensionDialog from "@/components/admin/components/AdminSuspensionDialog";
import AdminWheelDialog from "@/components/admin/components/AdminWheelDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

interface ComponentTypeCardProps {
  title: string;
  icon: React.ReactNode;
  data: any[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  renderItem: (item: any) => React.ReactNode;
}

const ComponentTypeCard: React.FC<ComponentTypeCardProps> = ({
  title,
  icon,
  data,
  loading,
  onAdd,
  onEdit,
  onDelete,
  renderItem
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredData = data.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-explorer-text flex items-center gap-2">
            {icon}
            {title}
            <Badge variant="secondary" className="ml-2">
              {data.length}
            </Badge>
          </CardTitle>
          <Button
            onClick={onAdd}
            size="sm"
            className="bg-accent-teal hover:bg-accent-teal/80"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-explorer-text-muted" />
          <Input
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-explorer-dark border-explorer-chrome/30"
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-explorer-text-muted">
            Loading {title.toLowerCase()}...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-8 text-explorer-text-muted">
            {searchTerm ? `No ${title.toLowerCase()} found` : `No ${title.toLowerCase()} created yet`}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-explorer-dark rounded-lg border border-explorer-chrome/20"
              >
                <div className="flex-1">
                  {renderItem(item)}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item.id)}
                    className="border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                    className="border-red-400/30 text-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ComponentsLibraryPage = () => {
  const { toast } = useToast();
  
  // Dialog state management
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [editingComponent, setEditingComponent] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Delete confirmation state
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    componentId: string | null;
    componentType: string | null;
    componentName: string | null;
  }>({
    open: false,
    componentId: null,
    componentType: null,
    componentName: null
  });

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

  const handleAdd = (type: string) => {
    setIsEditing(false);
    setEditingComponent(null);
    setActiveDialog(type);
  };

  const handleEdit = async (type: string, id: string) => {
    try {
      setIsEditing(true);
      let componentData = null;
      
      switch (type) {
        case 'engine':
          componentData = await fetchEngineById(id);
          break;
        case 'brake':
          componentData = await fetchBrakeById(id);
          break;
        case 'frame':
          componentData = await fetchFrameById(id);
          break;
        case 'suspension':
          componentData = await fetchSuspensionById(id);
          break;
        case 'wheel':
          componentData = await fetchWheelById(id);
          break;
        default:
          throw new Error(`Unknown component type: ${type}`);
      }
      
      setEditingComponent(componentData);
      setActiveDialog(type);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load ${type} data for editing.`
      });
    }
  };

  const handleDelete = (type: string, id: string) => {
    // Find the component name for confirmation dialog
    let componentName = 'Unknown';
    const allComponents = [...engines, ...brakes, ...frames, ...suspensions, ...wheels];
    const component = allComponents.find(c => c.id === id);
    if (component) {
      componentName = component.name || component.type || 'Unknown';
    }
    
    setDeleteDialog({
      open: true,
      componentId: id,
      componentType: type,
      componentName
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.componentId || !deleteDialog.componentType) return;
    
    try {
      switch (deleteDialog.componentType) {
        case 'engine':
          await deleteEngine(deleteDialog.componentId);
          refetchEngines();
          break;
        case 'brake':
          await deleteBrake(deleteDialog.componentId);
          refetchBrakes();
          break;
        case 'frame':
          await deleteFrame(deleteDialog.componentId);
          refetchFrames();
          break;
        case 'suspension':
          await deleteSuspension(deleteDialog.componentId);
          refetchSuspensions();
          break;
        case 'wheel':
          await deleteWheel(deleteDialog.componentId);
          refetchWheels();
          break;
      }
      
      toast({
        title: "Success",
        description: `${deleteDialog.componentType} deleted successfully.`
      });
    } catch (error) {
      console.error(`Error deleting ${deleteDialog.componentType}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete ${deleteDialog.componentType}.`
      });
    } finally {
      setDeleteDialog({
        open: false,
        componentId: null,
        componentType: null,
        componentName: null
      });
    }
  };

  const handleDialogClose = () => {
    setActiveDialog(null);
    setEditingComponent(null);
    setIsEditing(false);
    // Refresh all component data when dialog closes
    refetchEngines();
    refetchBrakes();
    refetchFrames();
    refetchSuspensions();
    refetchWheels();
  };

  return (
    <div className="flex-1 p-6 bg-explorer-dark">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-explorer-text mb-2">
          Components Library
        </h1>
        <p className="text-explorer-text-muted">
          Manage all motorcycle components in one place
        </p>
      </div>

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
        onClose={() => setDeleteDialog(prev => ({ ...prev, open: false }))}
        onConfirm={confirmDelete}
        componentName={deleteDialog.componentName || 'Unknown'}
        componentType={deleteDialog.componentType || 'component'}
      />
    </div>
  );
};

export default ComponentsLibraryPage;
