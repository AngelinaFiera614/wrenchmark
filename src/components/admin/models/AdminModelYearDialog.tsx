
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ImageUpload from "@/components/admin/shared/ImageUpload";

const AdminModelYearDialog = ({ open, model, onClose }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    changes: '',
    image_url: '',
    msrp_usd: '',
    production_numbers: '',
    market_regions: [],
    special_editions: [],
    technical_updates: '',
    marketing_tagline: ''
  });

  useEffect(() => {
    if (open && !model) {
      // Reset form when opening without a model
      setFormData({
        year: new Date().getFullYear(),
        changes: '',
        image_url: '',
        msrp_usd: '',
        production_numbers: '',
        market_regions: [],
        special_editions: [],
        technical_updates: '',
        marketing_tagline: ''
      });
    }
  }, [open, model]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!model) return;

    setLoading(true);

    try {
      const dataToSubmit = {
        motorcycle_id: model.id,
        year: formData.year,
        changes: formData.changes || null,
        image_url: formData.image_url || null,
        msrp_usd: formData.msrp_usd ? parseFloat(formData.msrp_usd) : null,
        production_numbers: formData.production_numbers ? parseInt(formData.production_numbers) : null,
        market_regions: formData.market_regions.length > 0 ? formData.market_regions : null,
        special_editions: formData.special_editions.length > 0 ? formData.special_editions : null,
        technical_updates: formData.technical_updates || null,
        marketing_tagline: formData.marketing_tagline || null
      };

      const { error } = await supabase
        .from('model_years')
        .insert([dataToSubmit]);

      if (error) throw error;

      toast({
        title: "Model year added",
        description: `${formData.year} ${model.name} has been added successfully.`,
      });

      onClose(true);
    } catch (error) {
      console.error("Error creating model year:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add model year. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInputChange = (field, value) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: arrayValue }));
  };

  if (!model) return null;

  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Add Model Year for {model.brand?.name} {model.name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                min="1885"
                max="2030"
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
                onChange={(e) => handleInputChange('msrp_usd', e.target.value)}
                placeholder="e.g., 15999.99"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="production_numbers">Production Numbers</Label>
              <Input
                id="production_numbers"
                type="number"
                value={formData.production_numbers}
                onChange={(e) => handleInputChange('production_numbers', e.target.value)}
                placeholder="Total units produced"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketing_tagline">Marketing Tagline</Label>
              <Input
                id="marketing_tagline"
                value={formData.marketing_tagline}
                onChange={(e) => handleInputChange('marketing_tagline', e.target.value)}
                placeholder="e.g., The Ultimate Superbike"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="changes">Changes from Previous Year</Label>
            <Textarea
              id="changes"
              value={formData.changes}
              onChange={(e) => handleInputChange('changes', e.target.value)}
              placeholder="What changed in this model year?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technical_updates">Technical Updates</Label>
            <Textarea
              id="technical_updates"
              value={formData.technical_updates}
              onChange={(e) => handleInputChange('technical_updates', e.target.value)}
              placeholder="Technical improvements, new features, etc."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="market_regions">Market Regions</Label>
              <Input
                id="market_regions"
                value={formData.market_regions.join(', ')}
                onChange={(e) => handleArrayInputChange('market_regions', e.target.value)}
                placeholder="e.g., North America, Europe, Asia (comma-separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="special_editions">Special Editions</Label>
              <Input
                id="special_editions"
                value={formData.special_editions.join(', ')}
                onChange={(e) => handleArrayInputChange('special_editions', e.target.value)}
                placeholder="e.g., Anniversary, Limited (comma-separated)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Year-Specific Image</Label>
            <ImageUpload
              bucketName="motorcycles"
              folderPath={`models/${model.slug}/${formData.year}`}
              value={formData.image_url}
              onChange={(url) => handleInputChange('image_url', url)}
              previewHeight={200}
              previewWidth={300}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onClose(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-accent-teal text-black hover:bg-accent-teal/80">
              {loading ? "Adding..." : "Add Model Year"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminModelYearDialog;
