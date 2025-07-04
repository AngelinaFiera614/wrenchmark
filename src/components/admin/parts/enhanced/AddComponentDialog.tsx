
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createEngine } from "@/services/engineService";
import { createBrake } from "@/services/brakeService";
import { createFrame } from "@/services/frameService";
import { createSuspension } from "@/services/suspensionService";
import { createWheel } from "@/services/wheelService";

interface AddComponentDialogProps {
  open: boolean;
  onClose: () => void;
  onComponentAdded: () => void;
  defaultComponentType?: string;
}

const AddComponentDialog: React.FC<AddComponentDialogProps> = ({
  open,
  onClose,
  onComponentAdded,
  defaultComponentType = "engines"
}) => {
  const { toast } = useToast();
  const [componentType, setComponentType] = useState(defaultComponentType);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    
    try {
      console.log("AddComponentDialog saving:", { componentType, formData });
      
      switch (componentType) {
        case 'engines':
          await createEngine({
            name: formData.name || '',
            displacement_cc: parseInt(formData.displacement_cc) || 0,
            power_hp: formData.power_hp ? parseFloat(formData.power_hp) : undefined,
            engine_type: formData.engine_type,
            notes: formData.notes
          });
          break;
          
        case 'brakes':
          // Ensure all required fields are present for brake system
          const brakeData = {
            type: formData.type || '',
            brake_brand: formData.brake_brand || null,
            front_type: formData.front_type || null,
            rear_type: formData.rear_type || null,
            front_disc_size_mm: formData.front_disc_size_mm ? formData.front_disc_size_mm.toString() : null,
            rear_disc_size_mm: formData.rear_disc_size_mm ? formData.rear_disc_size_mm.toString() : null,
            caliper_type: formData.caliper_type || null,
            has_abs: formData.has_abs || false,
            has_traction_control: formData.has_traction_control || false,
            notes: formData.notes || null
          };
          console.log("Creating brake with data:", brakeData);
          await createBrake(brakeData);
          break;
          
        case 'frames':
          await createFrame({
            type: formData.type || '',
            material: formData.material,
            construction_method: formData.construction_method,
            notes: formData.notes
          });
          break;
          
        case 'suspensions':
          await createSuspension({
            brand: formData.brand,
            front_type: formData.front_type,
            rear_type: formData.rear_type,
            adjustability: formData.adjustability,
            notes: formData.notes
          });
          break;
          
        case 'wheels':
          await createWheel({
            type: formData.type,
            front_size: formData.front_size,
            rear_size: formData.rear_size,
            rim_material: formData.rim_material,
            notes: formData.notes
          });
          break;
      }
      
      toast({
        title: "Success",
        description: "Component added successfully"
      });
      
      onComponentAdded();
      onClose();
      setFormData({});
    } catch (error: any) {
      console.error("Error creating component:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add component"
      });
    } finally {
      setSaving(false);
    }
  };

  const renderBrakeForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="type">System Type *</Label>
        <Input
          id="type"
          value={formData.type || ''}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          placeholder="e.g. Dual-channel ABS, Standard Disc Brakes"
        />
      </div>
      
      <div>
        <Label htmlFor="brake_brand">Brand</Label>
        <Input
          id="brake_brand"
          value={formData.brake_brand || ''}
          onChange={(e) => setFormData({ ...formData, brake_brand: e.target.value })}
          placeholder="e.g. Brembo, Nissin, Tokico"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="front_type">Front Brake Type</Label>
          <Input
            id="front_type"
            value={formData.front_type || ''}
            onChange={(e) => setFormData({ ...formData, front_type: e.target.value })}
            placeholder="e.g. Dual 320mm Discs"
          />
        </div>
        <div>
          <Label htmlFor="rear_type">Rear Brake Type</Label>
          <Input
            id="rear_type"
            value={formData.rear_type || ''}
            onChange={(e) => setFormData({ ...formData, rear_type: e.target.value })}
            placeholder="e.g. Single 245mm Disc"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="front_disc_size_mm">Front Disc Size (mm)</Label>
          <Input
            id="front_disc_size_mm"
            type="number"
            value={formData.front_disc_size_mm || ''}
            onChange={(e) => setFormData({ ...formData, front_disc_size_mm: e.target.value })}
            placeholder="320"
          />
        </div>
        <div>
          <Label htmlFor="rear_disc_size_mm">Rear Disc Size (mm)</Label>
          <Input
            id="rear_disc_size_mm"
            type="number"
            value={formData.rear_disc_size_mm || ''}
            onChange={(e) => setFormData({ ...formData, rear_disc_size_mm: e.target.value })}
            placeholder="245"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="caliper_type">Caliper Type</Label>
        <Input
          id="caliper_type"
          value={formData.caliper_type || ''}
          onChange={(e) => setFormData({ ...formData, caliper_type: e.target.value })}
          placeholder="e.g. 4-piston radial, 2-piston floating"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <Label htmlFor="has_abs">ABS</Label>
            <p className="text-sm text-muted-foreground">Anti-lock Braking System</p>
          </div>
          <Switch
            id="has_abs"
            checked={formData.has_abs || false}
            onCheckedChange={(checked) => setFormData({ ...formData, has_abs: checked })}
          />
        </div>
        
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <Label htmlFor="has_traction_control">Traction Control</Label>
            <p className="text-sm text-muted-foreground">Traction control system</p>
          </div>
          <Switch
            id="has_traction_control"
            checked={formData.has_traction_control || false}
            onCheckedChange={(checked) => setFormData({ ...formData, has_traction_control: checked })}
          />
        </div>
      </div>
    </div>
  );

  const renderEngineForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Engine name"
        />
      </div>
      <div>
        <Label htmlFor="displacement_cc">Displacement (CC) *</Label>
        <Input
          id="displacement_cc"
          type="number"
          value={formData.displacement_cc || ''}
          onChange={(e) => setFormData({ ...formData, displacement_cc: e.target.value })}
          placeholder="650"
        />
      </div>
      <div>
        <Label htmlFor="power_hp">Power (HP)</Label>
        <Input
          id="power_hp"
          type="number"
          value={formData.power_hp || ''}
          onChange={(e) => setFormData({ ...formData, power_hp: e.target.value })}
          placeholder="75"
        />
      </div>
      <div>
        <Label htmlFor="engine_type">Engine Type</Label>
        <Input
          id="engine_type"
          value={formData.engine_type || ''}
          onChange={(e) => setFormData({ ...formData, engine_type: e.target.value })}
          placeholder="Parallel Twin"
        />
      </div>
    </div>
  );

  const renderGenericForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="type">Type *</Label>
        <Input
          id="type"
          value={formData.type || ''}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          placeholder="Component type"
        />
      </div>
    </div>
  );

  const renderForm = () => {
    switch (componentType) {
      case 'engines':
        return renderEngineForm();
      case 'brakes':
        return renderBrakeForm();
      default:
        return renderGenericForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-explorer-card border-explorer-chrome/30">
        <DialogHeader>
          <DialogTitle className="text-explorer-text">Add Component</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="componentType">Component Type</Label>
            <Select value={componentType} onValueChange={setComponentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engines">Engine</SelectItem>
                <SelectItem value="brakes">Brake System</SelectItem>
                <SelectItem value="frames">Frame</SelectItem>
                <SelectItem value="suspensions">Suspension</SelectItem>
                <SelectItem value="wheels">Wheels</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {renderForm()}
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              className="min-h-[80px]"
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Adding..." : "Add Component"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddComponentDialog;
