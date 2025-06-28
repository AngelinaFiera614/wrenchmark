import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Engine } from "@/services/engineService";

interface AdminEngineDialogProps {
  open: boolean;
  engine: Engine | null;
  onClose: (wasUpdated?: boolean) => void;
}

const AdminEngineDialog = ({ open, engine, onClose }: AdminEngineDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    displacement_cc: '',
    power_hp: '',
    torque_nm: '',
    power_rpm: '',
    torque_rpm: '',
    engine_type: '',
    cylinder_count: '',
    valve_count: '',
    cooling: '',
    fuel_system: '',
    stroke_type: '',
    bore_mm: '',
    stroke_mm: '',
    compression_ratio: '',
    valves_per_cylinder: ''
  });

  useEffect(() => {
    if (engine) {
      console.log("=== EDITING ENGINE ===", engine);
      setFormData({
        name: engine.name || '',
        displacement_cc: engine.displacement_cc?.toString() || '',
        power_hp: engine.power_hp?.toString() || '',
        torque_nm: engine.torque_nm?.toString() || '',
        power_rpm: engine.power_rpm?.toString() || '',
        torque_rpm: engine.torque_rpm?.toString() || '',
        engine_type: engine.engine_type || '',
        cylinder_count: engine.cylinder_count?.toString() || '',
        valve_count: engine.valve_count?.toString() || '',
        cooling: engine.cooling || '',
        fuel_system: engine.fuel_system || '',
        stroke_type: engine.stroke_type || '',
        bore_mm: engine.bore_mm?.toString() || '',
        stroke_mm: engine.stroke_mm?.toString() || '',
        compression_ratio: engine.compression_ratio || '',
        valves_per_cylinder: engine.valves_per_cylinder?.toString() || ''
      });
    } else {
      setFormData({
        name: '',
        displacement_cc: '',
        power_hp: '',
        torque_nm: '',
        power_rpm: '',
        torque_rpm: '',
        engine_type: '',
        cylinder_count: '',
        valve_count: '',
        cooling: '',
        fuel_system: '',
        stroke_type: '',
        bore_mm: '',
        stroke_mm: '',
        compression_ratio: '',
        valves_per_cylinder: ''
      });
    }
    setValidationErrors({});
  }, [engine]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Required field validation
    if (!formData.name?.trim()) {
      errors.name = 'Engine name is required';
    }
    
    if (!formData.displacement_cc?.trim()) {
      errors.displacement_cc = 'Displacement is required';
    } else if (isNaN(Number(formData.displacement_cc)) || Number(formData.displacement_cc) <= 0) {
      errors.displacement_cc = 'Displacement must be a positive number';
    }
    
    // Numeric field validation
    const numericFields = [
      'power_hp', 'torque_nm', 'power_rpm', 'torque_rpm', 
      'cylinder_count', 'valve_count', 'bore_mm', 'stroke_mm', 'valves_per_cylinder'
    ];
    
    numericFields.forEach(field => {
      if (formData[field as keyof typeof formData] && formData[field as keyof typeof formData].trim() !== '') {
        if (isNaN(Number(formData[field as keyof typeof formData])) || Number(formData[field as keyof typeof formData]) < 0) {
          errors[field] = `${field.replace('_', ' ')} must be a valid positive number`;
        }
      }
    });
    
    console.log("=== VALIDATION ERRORS ===", errors);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("=== FORM SUBMIT STARTED ===");
    console.log("Raw form data:", formData);
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the form errors before saving.",
      });
      return;
    }
    
    setLoading(true);

    try {
      // Convert form data with detailed logging
      const engineData = {
        name: formData.name?.trim(),
        displacement_cc: formData.displacement_cc ? parseInt(formData.displacement_cc) : null,
        power_hp: formData.power_hp ? parseFloat(formData.power_hp) : null,
        torque_nm: formData.torque_nm ? parseFloat(formData.torque_nm) : null,
        power_rpm: formData.power_rpm ? parseInt(formData.power_rpm) : null,
        torque_rpm: formData.torque_rpm ? parseInt(formData.torque_rpm) : null,
        cylinder_count: formData.cylinder_count ? parseInt(formData.cylinder_count) : null,
        valve_count: formData.valve_count ? parseInt(formData.valve_count) : null,
        bore_mm: formData.bore_mm ? parseFloat(formData.bore_mm) : null,
        stroke_mm: formData.stroke_mm ? parseFloat(formData.stroke_mm) : null,
        valves_per_cylinder: formData.valves_per_cylinder ? parseInt(formData.valves_per_cylinder) : null,
        engine_type: formData.engine_type || null,
        cooling: formData.cooling || null,
        fuel_system: formData.fuel_system || null,
        stroke_type: formData.stroke_type || null,
        compression_ratio: formData.compression_ratio || null
      };

      console.log("=== PROCESSED ENGINE DATA ===", engineData);

      if (engine) {
        console.log("=== UPDATING ENGINE ===", engine.id);
        // Update existing engine
        const { data, error } = await supabase
          .from('engines')
          .update(engineData)
          .eq('id', engine.id)
          .select();

        console.log("=== UPDATE RESPONSE ===", { data, error });

        if (error) {
          console.error("=== UPDATE ERROR DETAILS ===", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }

        toast({
          title: "Engine updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        console.log("=== CREATING NEW ENGINE ===");
        // Create new engine
        const { data, error } = await supabase
          .from('engines')
          .insert([engineData])
          .select();

        console.log("=== INSERT RESPONSE ===", { data, error });

        if (error) {
          console.error("=== INSERT ERROR DETAILS ===", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }

        toast({
          title: "Engine created",
          description: `${formData.name} has been created successfully.`,
        });
      }

      onClose(true);
    } catch (error: any) {
      console.error("=== SAVE ENGINE ERROR ===", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        stack: error.stack
      });
      
      let errorMessage = "Failed to save engine. Please try again.";
      
      // Provide more specific error messages based on the error
      if (error.code === '23505') {
        errorMessage = "An engine with this name already exists.";
      } else if (error.code === '23502') {
        errorMessage = "Missing required field. Please check all required inputs.";
      } else if (error.code === '22P02') {
        errorMessage = "Invalid data format. Please check numeric fields.";
      } else if (error.message) {
        errorMessage = `Database error: ${error.message}`;
      }
      
      toast({
        variant: "destructive",
        title: "Error Saving Engine",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`=== FIELD CHANGE === ${field}:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const renderFieldError = (fieldName: string) => {
    if (validationErrors[fieldName]) {
      return <span className="text-red-500 text-xs mt-1">{validationErrors[fieldName]}</span>;
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {engine ? `Edit Engine: ${engine.name}` : "Add New Engine"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., 599cc Parallel Twin"
                className={validationErrors.name ? 'border-red-500' : ''}
                required
              />
              {renderFieldError('name')}
            </div>

            <div className="space-y-2">
              <Label htmlFor="displacement_cc">Displacement (cc) *</Label>
              <Input
                id="displacement_cc"
                type="number"
                value={formData.displacement_cc}
                onChange={(e) => handleInputChange('displacement_cc', e.target.value)}
                placeholder="e.g., 599"
                className={validationErrors.displacement_cc ? 'border-red-500' : ''}
                required
              />
              {renderFieldError('displacement_cc')}
            </div>

            <div className="space-y-2">
              <Label htmlFor="power_hp">Power (hp)</Label>
              <Input
                id="power_hp"
                type="number"
                step="0.1"
                value={formData.power_hp}
                onChange={(e) => handleInputChange('power_hp', e.target.value)}
                placeholder="e.g., 67.1"
                className={validationErrors.power_hp ? 'border-red-500' : ''}
              />
              {renderFieldError('power_hp')}
            </div>

            <div className="space-y-2">
              <Label htmlFor="power_rpm">Power RPM</Label>
              <Input
                id="power_rpm"
                type="number"
                value={formData.power_rpm}
                onChange={(e) => handleInputChange('power_rpm', e.target.value)}
                placeholder="e.g., 8500"
                className={validationErrors.power_rpm ? 'border-red-500' : ''}
              />
              {renderFieldError('power_rpm')}
            </div>

            <div className="space-y-2">
              <Label htmlFor="torque_nm">Torque (Nm)</Label>
              <Input
                id="torque_nm"
                type="number"
                step="0.1"
                value={formData.torque_nm}
                onChange={(e) => handleInputChange('torque_nm', e.target.value)}
                placeholder="e.g., 64.0"
                className={validationErrors.torque_nm ? 'border-red-500' : ''}
              />
              {renderFieldError('torque_nm')}
            </div>

            <div className="space-y-2">
              <Label htmlFor="torque_rpm">Torque RPM</Label>
              <Input
                id="torque_rpm"
                type="number"
                value={formData.torque_rpm}
                onChange={(e) => handleInputChange('torque_rpm', e.target.value)}
                placeholder="e.g., 6500"
                className={validationErrors.torque_rpm ? 'border-red-500' : ''}
              />
              {renderFieldError('torque_rpm')}
            </div>

            <div className="space-y-2">
              <Label htmlFor="engine_type">Engine Type</Label>
              <Select value={formData.engine_type} onValueChange={(value) => handleInputChange('engine_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select engine type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Parallel Twin">Parallel Twin</SelectItem>
                  <SelectItem value="V-Twin">V-Twin</SelectItem>
                  <SelectItem value="Inline-3">Inline-3</SelectItem>
                  <SelectItem value="Inline-4">Inline-4</SelectItem>
                  <SelectItem value="V4">V4</SelectItem>
                  <SelectItem value="Flat Twin">Flat Twin</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cylinder_count">Cylinder Count</Label>
              <Input
                id="cylinder_count"
                type="number"
                value={formData.cylinder_count}
                onChange={(e) => handleInputChange('cylinder_count', e.target.value)}
                placeholder="e.g., 2"
                className={validationErrors.cylinder_count ? 'border-red-500' : ''}
              />
              {renderFieldError('cylinder_count')}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cooling">Cooling System</Label>
              <Select value={formData.cooling} onValueChange={(value) => handleInputChange('cooling', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cooling type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Liquid">Liquid</SelectItem>
                  <SelectItem value="Air">Air</SelectItem>
                  <SelectItem value="Oil">Oil</SelectItem>
                  <SelectItem value="Air/Oil">Air/Oil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuel_system">Fuel System</Label>
              <Select value={formData.fuel_system} onValueChange={(value) => handleInputChange('fuel_system', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fuel Injection">Fuel Injection</SelectItem>
                  <SelectItem value="Carburetor">Carburetor</SelectItem>
                  <SelectItem value="Throttle Body">Throttle Body</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stroke_type">Stroke Type</Label>
              <Select value={formData.stroke_type} onValueChange={(value) => handleInputChange('stroke_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stroke type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4-Stroke">4-Stroke</SelectItem>
                  <SelectItem value="2-Stroke">2-Stroke</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bore_mm">Bore (mm)</Label>
              <Input
                id="bore_mm"
                type="number"
                step="0.1"
                value={formData.bore_mm}
                onChange={(e) => handleInputChange('bore_mm', e.target.value)}
                placeholder="e.g., 67.0"
                className={validationErrors.bore_mm ? 'border-red-500' : ''}
              />
              {renderFieldError('bore_mm')}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stroke_mm">Stroke (mm)</Label>
              <Input
                id="stroke_mm"
                type="number"
                step="0.1"
                value={formData.stroke_mm}
                onChange={(e) => handleInputChange('stroke_mm', e.target.value)}
                placeholder="e.g., 42.5"
                className={validationErrors.stroke_mm ? 'border-red-500' : ''}
              />
              {renderFieldError('stroke_mm')}
            </div>

            <div className="space-y-2">
              <Label htmlFor="compression_ratio">Compression Ratio</Label>
              <Input
                id="compression_ratio"
                value={formData.compression_ratio}
                onChange={(e) => handleInputChange('compression_ratio', e.target.value)}
                placeholder="e.g., 11.6:1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valve_count">Total Valve Count</Label>
              <Input
                id="valve_count"
                type="number"
                value={formData.valve_count}
                onChange={(e) => handleInputChange('valve_count', e.target.value)}
                placeholder="e.g., 8"
                className={validationErrors.valve_count ? 'border-red-500' : ''}
              />
              {renderFieldError('valve_count')}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valves_per_cylinder">Valves per Cylinder</Label>
              <Input
                id="valves_per_cylinder"
                type="number"
                value={formData.valves_per_cylinder}
                onChange={(e) => handleInputChange('valves_per_cylinder', e.target.value)}
                placeholder="e.g., 4"
                className={validationErrors.valves_per_cylinder ? 'border-red-500' : ''}
              />
              {renderFieldError('valves_per_cylinder')}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onClose(false)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              {loading ? "Saving..." : engine ? "Update Engine" : "Create Engine"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminEngineDialog;
