
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createModelYear } from "@/services/models/modelYearService";

interface AdminModelYearDialogProps {
  open: boolean;
  model: any;
  onClose: () => void;
}

const AdminModelYearDialog = ({ open, model, onClose }: AdminModelYearDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    msrp_usd: "",
    changes: "",
    image_url: "",
    marketing_tagline: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!model?.id) return;

    setLoading(true);
    try {
      const yearData = {
        motorcycle_id: model.id,
        year: Number(formData.year),
        msrp_usd: formData.msrp_usd ? Number(formData.msrp_usd) : undefined,
        changes: formData.changes || undefined,
        image_url: formData.image_url || undefined,
        marketing_tagline: formData.marketing_tagline || undefined,
      };

      const result = await createModelYear(yearData);
      if (result) {
        toast({
          title: "Model year created",
          description: `${formData.year} model year has been added successfully.`,
        });
        onClose();
        // Reset form
        setFormData({
          year: new Date().getFullYear(),
          msrp_usd: "",
          changes: "",
          image_url: "",
          marketing_tagline: "",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create model year. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-explorer-card border-explorer-chrome/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-explorer-text">Add Model Year</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData(prev => ({ ...prev, year: Number(e.target.value) }))}
              className="bg-explorer-dark border-explorer-chrome/30"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="msrp_usd">MSRP (USD)</Label>
            <Input
              id="msrp_usd"
              type="number"
              step="0.01"
              value={formData.msrp_usd}
              onChange={(e) => setFormData(prev => ({ ...prev, msrp_usd: e.target.value }))}
              className="bg-explorer-dark border-explorer-chrome/30"
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="changes">Changes</Label>
            <Textarea
              id="changes"
              value={formData.changes}
              onChange={(e) => setFormData(prev => ({ ...prev, changes: e.target.value }))}
              className="bg-explorer-dark border-explorer-chrome/30"
              placeholder="Describe changes for this model year..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              className="bg-explorer-dark border-explorer-chrome/30"
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketing_tagline">Marketing Tagline</Label>
            <Input
              id="marketing_tagline"
              value={formData.marketing_tagline}
              onChange={(e) => setFormData(prev => ({ ...prev, marketing_tagline: e.target.value }))}
              className="bg-explorer-dark border-explorer-chrome/30"
              placeholder="Marketing tagline for this year..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              {loading ? "Creating..." : "Create Year"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminModelYearDialog;
