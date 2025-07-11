import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { updateModelYear } from "@/services/models/modelYearService";

interface ModelYear {
  id: string;
  year: number;
  changes?: string;
  msrp_usd?: number;
  marketing_tagline?: string;
  is_available: boolean;
  image_url?: string;
}

interface ModelYearEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  modelYear: ModelYear | null;
  onSuccess: () => void;
}

const ModelYearEditDialog = ({ isOpen, onClose, modelYear, onSuccess }: ModelYearEditDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<ModelYear>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (modelYear) {
      setFormData({
        year: modelYear.year,
        changes: modelYear.changes || "",
        msrp_usd: modelYear.msrp_usd || undefined,
        marketing_tagline: modelYear.marketing_tagline || "",
        is_available: modelYear.is_available,
        image_url: modelYear.image_url || "",
      });
    }
  }, [modelYear]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelYear) return;

    setIsSubmitting(true);
    try {
      const success = await updateModelYear(modelYear.id, {
        year: formData.year,
        changes: formData.changes || null,
        msrp_usd: formData.msrp_usd || null,
        marketing_tagline: formData.marketing_tagline || null,
        is_available: formData.is_available,
        image_url: formData.image_url || null,
      });

      if (success) {
        toast({
          title: "Success!",
          description: `${formData.year} model year has been updated.`,
        });
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update model year.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-explorer-card border-explorer-chrome/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-explorer-text">
            Edit {modelYear?.year} Model Year
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="year" className="text-explorer-text">Year</Label>
            <Input
              id="year"
              type="number"
              min="1900"
              max="2030"
              value={formData.year || ""}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="changes" className="text-explorer-text">Changes</Label>
            <Textarea
              id="changes"
              placeholder="Describe changes for this model year..."
              value={formData.changes || ""}
              onChange={(e) => setFormData({ ...formData, changes: e.target.value })}
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="msrp" className="text-explorer-text">Base MSRP (USD)</Label>
            <Input
              id="msrp"
              type="number"
              min="0"
              step="100"
              placeholder="e.g., 15000"
              value={formData.msrp_usd || ""}
              onChange={(e) => setFormData({ ...formData, msrp_usd: parseFloat(e.target.value) || undefined })}
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline" className="text-explorer-text">Marketing Tagline</Label>
            <Input
              id="tagline"
              placeholder="e.g., More Power, More Fun"
              value={formData.marketing_tagline || ""}
              onChange={(e) => setFormData({ ...formData, marketing_tagline: e.target.value })}
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url" className="text-explorer-text">Image URL</Label>
            <Input
              id="image_url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image_url || ""}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="bg-explorer-dark border-explorer-chrome/30 text-explorer-text"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="available"
              checked={formData.is_available || false}
              onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
            />
            <Label htmlFor="available" className="text-explorer-text">
              Currently Available
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="bg-explorer-dark border-explorer-chrome/30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              {isSubmitting ? "Updating..." : "Update Year"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModelYearEditDialog;