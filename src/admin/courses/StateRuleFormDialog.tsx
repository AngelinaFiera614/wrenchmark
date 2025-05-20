
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { upsertStateRule } from "@/services/stateRulesService";
import { StateRule } from "@/types/state";
import { toast } from "sonner";

interface StateRuleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stateRule?: StateRule | null;
  onSuccess: () => void;
}

export const StateRuleFormDialog: React.FC<StateRuleFormDialogProps> = ({
  open,
  onOpenChange,
  stateRule,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<StateRule>>({
    state_code: "",
    state_name: "",
    permit_age_min: null,
    helmet_required: false,
    special_rules: "",
    road_test_required: true,
    link_to_dmv: "",
  });

  // Load state data when editing
  useEffect(() => {
    if (stateRule) {
      setFormData({
        state_code: stateRule.state_code,
        state_name: stateRule.state_name,
        permit_age_min: stateRule.permit_age_min,
        helmet_required: stateRule.helmet_required,
        special_rules: stateRule.special_rules || "",
        road_test_required: stateRule.road_test_required,
        link_to_dmv: stateRule.link_to_dmv || "",
      });
    } else {
      // Reset form when adding new
      setFormData({
        state_code: "",
        state_name: "",
        permit_age_min: null,
        helmet_required: false,
        special_rules: "",
        road_test_required: true,
        link_to_dmv: "",
      });
    }
  }, [stateRule, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'permit_age_min') {
      const ageValue = value === '' ? null : parseInt(value, 10);
      setFormData((prev) => ({ ...prev, [name]: ageValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.state_code || !formData.state_name) {
      toast.error("State code and name are required");
      return;
    }
    
    if (formData.state_code.length !== 2) {
      toast.error("State code must be exactly 2 characters (e.g., CA, TX)");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await upsertStateRule(formData);
      toast.success(`State rule ${stateRule ? "updated" : "created"} successfully`);
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving state rule:", error);
      toast.error(`Failed to ${stateRule ? "update" : "create"} state rule: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {stateRule ? "Edit State Rule" : "Add State Rule"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state_code">State Code</Label>
                <Input
                  id="state_code"
                  name="state_code"
                  maxLength={2}
                  value={formData.state_code}
                  onChange={handleChange}
                  placeholder="CA"
                  className="uppercase"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state_name">State Name</Label>
                <Input
                  id="state_name"
                  name="state_name"
                  value={formData.state_name}
                  onChange={handleChange}
                  placeholder="California"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="permit_age_min">Minimum Permit Age</Label>
                <Input
                  id="permit_age_min"
                  name="permit_age_min"
                  type="number"
                  min="14"
                  max="21"
                  value={formData.permit_age_min === null ? "" : formData.permit_age_min}
                  onChange={handleChange}
                  placeholder="16"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="link_to_dmv">DMV Website URL</Label>
                <Input
                  id="link_to_dmv"
                  name="link_to_dmv"
                  type="url"
                  value={formData.link_to_dmv || ""}
                  onChange={handleChange}
                  placeholder="https://dmv.ca.gov/motorcycle"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="helmet_required" className="cursor-pointer">
                  Helmet Required
                </Label>
                <Switch
                  id="helmet_required"
                  name="helmet_required"
                  checked={formData.helmet_required}
                  onCheckedChange={(checked) => handleSwitchChange("helmet_required", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="road_test_required" className="cursor-pointer">
                  Road Test Required
                </Label>
                <Switch
                  id="road_test_required"
                  name="road_test_required"
                  checked={formData.road_test_required}
                  onCheckedChange={(checked) => handleSwitchChange("road_test_required", checked)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="special_rules">Special Rules</Label>
              <Textarea
                id="special_rules"
                name="special_rules"
                value={formData.special_rules || ""}
                onChange={handleChange}
                placeholder="Enter any special rules or requirements specific to this state..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StateRuleFormDialog;
