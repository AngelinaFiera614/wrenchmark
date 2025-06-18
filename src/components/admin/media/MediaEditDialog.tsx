
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MediaEditDialogProps {
  open: boolean;
  item: any;
  onClose: (refresh?: boolean) => void;
}

const MediaEditDialog = ({ open, item, onClose }: MediaEditDialogProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    caption: "",
    alt_text: "",
    tags: ""
  });

  useEffect(() => {
    if (item) {
      setFormData({
        caption: item.caption || "",
        alt_text: item.alt_text || "",
        tags: item.tags ? item.tags.join(", ") : ""
      });
    }
  }, [item]);

  const handleSave = async () => {
    if (!item) return;

    setSaving(true);

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

      const { error } = await supabase
        .from('media_library')
        .update({
          caption: formData.caption,
          alt_text: formData.alt_text,
          tags: tagsArray,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Media updated",
        description: `${item.file_name} has been updated successfully.`,
      });

      onClose(true);

    } catch (error) {
      console.error('Error updating media:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update media item. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="bg-explorer-card border-explorer-chrome/30 text-explorer-text sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Media: {item?.file_name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Input
              id="caption"
              placeholder="Brief description of the media..."
              value={formData.caption}
              onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
              className="bg-explorer-dark border-explorer-chrome/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alt_text">Alt Text (for accessibility)</Label>
            <Input
              id="alt_text"
              placeholder="Describe the image for screen readers..."
              value={formData.alt_text}
              onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
              className="bg-explorer-dark border-explorer-chrome/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="motorcycle, yamaha, sport..."
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="bg-explorer-dark border-explorer-chrome/30"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => onClose()}
              className="border-explorer-chrome/30"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaEditDialog;
